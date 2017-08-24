import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';
import { NgForm } from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

import {
    Section,
    Feature
} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {SubmAddEvent} from '../subm-add/subm-add-event.model';
import {SectionType} from '../../shared/submission-type.model';

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

class SubmItems {
    private _isDeletion: boolean;    //has any of the items been deleted?
    private _items: SubmItem[];

    constructor(section: Section) {
        this._items = [];
        this._isDeletion = false;

        this._items.push(new SubmItem(section.annotations));
        section.features.list().forEach(
            feature => this._items.push(new SubmItem(feature))
        );
    }

    get isDeletion(): boolean {
        return this._isDeletion;
    }

    list(): SubmItem[] {
        return this._items;
    }

    delete(itemIdx: number): void {
        this._items[itemIdx].delete();
        this._isDeletion = true;
    }

    reset(): void {
        this._items.forEach(item => item.reset());
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

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    @ViewChild('confirmDialog')
    confirmDialog: ConfirmDialogComponent;

    editing: boolean = false;           //component's mode: display or editing, with different renderings
    items: SubmItems;                   //current collection of feature/subsection items

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
     */
    onSubmit(form: NgForm): void {
        const items = this.items;

        if (form.valid) {

            //Updates items collection if there has been scalar changes
            if (form.dirty) {
                Object.keys(form.value).forEach(key => {
                    const itemsIdx = key.split('_')[1];     //Field names suffixed with items array index

                    items[itemsIdx].feature.typeName = form.value[key];
                });
            }
        }
        this.onEditModeToggle();
    }

    onCancel(event: Event): void {
        if (this.items.isDeletion) {
            this.items.reset();
        }
        this.onEditModeToggle(event);
    }

    /**
     * Transitions between the display/edit mode by changing a flag.
     * @param {Event} [event] Optional click event object. If passed, the default action is prevented.
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

    onItemDelete(event: Event, itemIdx: number): void {
        event.preventDefault();
        this.items.delete(itemIdx);
    }

    onItemsChange(): void {
        this.items = new SubmItems(this.section);
    }

    private confirm(): Observable<any> {
        return this.confirmDialog.confirm();
    }
}