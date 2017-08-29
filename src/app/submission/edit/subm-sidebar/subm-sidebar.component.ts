import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';
import {
    NgForm,
    FormControl,
} from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import {
    Section,
    Feature
} from '../../shared/submission.model';
import { SubmAddDialogComponent } from '../subm-add/subm-add.component';
import { ConfirmDialogComponent } from 'app/shared/index';
import { SubmAddEvent } from '../subm-add/subm-add-event.model';
import { SectionType } from '../../shared/submission-type.model';

//TODO: comments
class SubmItem {
    feature: Feature;
    icon: string;
    private _deleted: boolean;

    constructor(feature: Feature, icon: string = 'fa-file-o') {
        this.feature = feature;
        this.icon = icon;
        this._deleted = false;
    }

    get isDeleted(): boolean {
        return this._deleted;
    }

    delete(): void {
        this._deleted = true;
    }

    reset(): void {
        this._deleted = false;
    }

    isReadOnly(): boolean {
        return !this.feature.type.canModify;
    }

    onClick(event: Event): void {
        if (this.feature.singleRow) {
            this.feature.addColumn();
            return;
        }

        if (this.feature.colSize() === 0) {
            this.feature.addColumn();
        }

        this.feature.addRow();
    }
}

/**
 * Array extension for submission items with a global flag for pending deletions.
 * Class pattern loosely based on convention for global prototypes created by SimonTest:
 * {@link https://blog.simontest.net/extend-array-with-typescript-965cc1134b3}
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
  */
class SubmItems extends Array<SubmItem> {
    private _isDeletion: boolean;    //has any of the items been deleted?

    /**
     * Creates a collection of submission items. Private to prevent erroneous extension.
     * @param {Array<SubmItem>} [items] - Optional literal of initial items
     */
    private constructor(items?: Array<SubmItem>) {
        super(...items);
        this._isDeletion = false;
    }

    /**
     * Factory to ensure prototypal inheritance.
     * @returns {SubmItems} Collection of submission items.
     */
    static create(): SubmItems {
        return Object.create(SubmItems.prototype);
    }

    get isDeletion(): boolean {
        return this._isDeletion;
    }

    /**
     * Removes a given item from the collection, flagging it globally for the collection.
     * @param {number} itemIdx - Array index of the item to be removed.
     */
    delete(itemIdx: number): void {
        this[itemIdx].delete();
        this._isDeletion = true;
    }

    /**
     * Gets items within the collection that are pending deletion.
     * @returns {SubmItem[]} Collection of items flagged for deletion.
     */
    getDeleted(): SubmItem[] {
        return this.filter((item) => {
            return item.isDeleted
        });
    }

    /**
     * Resets both the item and collection-level flags, effectively cancelling all
     * pending deletions.
     */
    reset(): void {
        this.forEach((item) => item.reset());
        this._isDeletion = false;
    }
}

//TODO: Use model-driven approach to make dynamic manipulation of form more syntactic
@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSideBarComponent implements OnChanges {
    @Input() collapsed? = false;
    @Input() section: Section;
    @Output() toggle? = new EventEmitter();
    @ViewChild('addDialog') addDialog: SubmAddDialogComponent;
    @ViewChild('confirmDialog') confirmDialog: ConfirmDialogComponent;

    idxPrefix: string = '_';     //default character prefixing array indexes. Component-wide constant used in template too.
    editing: boolean = false;    //component's mode: display or editing, with different renderings
    items: SubmItems;            //current collection of feature/subsection items

    private subscr: Subscription;

    ngOnChanges(changes: any): void {
        const change: SimpleChange = changes.section;

        if (change) {
            if (this.subscr) {
                this.subscr.unsubscribe();
            }
            if (this.section !== undefined) {
                this.subscr = this.section.features
                    .updates()
                    .subscribe(ev => {
                        if (ev.name === 'feature_add' ||
                            ev.name === 'feature_remove') {
                            this.onItemsChange();
                        }
                    });
                this.onItemsChange();
            }
        }
    }

    onToggle(ev): void {
        ev.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    /**
     * Provided is valid, it saves the form data onto the model's respective properties on submission.
     * @param {NgForm} form Object generated from type name fields.
     * @param {string} [separator] Optional separator between field name and array index. Takes default if left out.
     */
    onSubmit(form: NgForm, separator: string = this.idxPrefix): void {

        //Removes features marked as deleted
        if (this.items.isDeletion) {
            this.items.getDeleted().forEach(({feature}) => {
                this.section.features.remove(feature);
            });
        }

        //Updates items collection if there has been scalar changes
        if (form.dirty && form.valid) {
            Object.keys(form.value).forEach((key) => {
                const itemsIdx = key.split(separator)[1];

                this.items[itemsIdx].feature.typeName = form.value[key];
            }, this);
        }

        this.onEditModeToggle();
    }

    /**
     *
     * @param {Event} event - click event object.
     */
    onCancel(event: Event): void {
        if (this.items.isDeletion) {
            this.items.reset();
        }
        this.onEditModeToggle(event);
    }

    /**
     * Transitions between the display/edit mode by changing a flag.
     * @param {Event} [event] - Optional click event object. If passed, the default action is prevented.
     */
    onEditModeToggle(event?:Event): void {
        event && event.preventDefault();
        this.editing = !this.editing;
    }

    onAddClick(ev): void {
        ev.preventDefault();
        this.addDialog.show();
    }

    onAdd(ev: SubmAddEvent) {
        const rootType: SectionType = this.section.type;

        if (ev.itemType === 'Section') {
            const sectionType = rootType.getSectionType(ev.name);
            this.section.sections.add(sectionType);
            return;
        }
        const idx = ['AttributeList', 'AttributeGrid'].indexOf(ev.itemType);
        if (idx > -1) {
            const singleRow = idx === 0;
            const featureType = rootType.getFeatureType(ev.name, singleRow);
            const f = this.section.features.add(featureType);
        }
    }

    /**
     *
     * @param {Event} event
     * @param {FormControl[]} controls
     * @param {string} nameInput
     * @param {number} itemIdx
     */
    onItemDelete(event: Event, controls: FormControl[], nameInput: string, itemIdx: number): void {
        event.preventDefault();
        this.items.delete(itemIdx);

        //Updates validity after deletion to avoid inconsistencies, especially regarding the uniqueness test.
        delete controls[nameInput];
        Object.keys(controls).forEach((key) => {
            controls[key].updateValueAndValidity();
        });
    }

    /**
     *
     */
    onItemsChange(): void {
        this.items = SubmItems.create();

        this.items.push(new SubmItem(this.section.annotations));
        this.section.features.list().forEach((feature) => {
            this.items.push(new SubmItem(feature))
        });
    }

    /**
     *
     * @returns {Observable<any>}
     */
    private confirm(): Observable<any> {
        return this.confirmDialog.confirm();
    }
}