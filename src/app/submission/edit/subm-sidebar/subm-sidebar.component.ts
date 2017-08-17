import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {
    Section,
    Feature
} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {SubmAddEvent} from '../subm-add/subm-add-event.model';
import {SectionType} from '../../shared/submission-type.model';

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
    editing: boolean = false;   //component's mode: display or editing, with different renderings
    valid: boolean = true;      //global flag for validity of items collection
                                //TODO: Refactor html to make form encompass menu-toggle
    items: any[] = [];          //items collection

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

    get sectionType(): SectionType {
        return this.section.type;
    }

    onToggle(ev): void {
        ev.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    onEditModeToggle(ev): void {
        ev.preventDefault();
        this.editing = !this.editing;
    }

    onAddClick(ev): void {
        ev.preventDefault();
        this.addDialog.show();
    }

    onAdd(ev: SubmAddEvent) {
        if (ev.itemType === 'Section') {
            const sectionType = this.sectionType.getSectionType(ev.name);
            this.section.sections.add(sectionType);
            return;
        }
        const idx = ['AttributeList', 'AttributeGrid'].indexOf(ev.itemType);
        if (idx > -1) {
            const singleRow = idx === 0;
            const featureType = this.sectionType.getFeatureType(ev.name);
            this.section.features.add(featureType);
        }
    }

    onItemsChange(): void {
        const items = [];
        items.push(this.createItem(this.section.annotations));
        this.section.features.list().forEach(
            (f: Feature) => items.push(this.createItem(f))
        );
        this.items = items;
    }

    /**
     * Checks that the collection of items contains no duplicate type names.
     * @private
     * @param {Object} itemTypeControl - Form control for item's type name
     * @returns {boolean} True if there are no duplicate names in the collection
     */
    private isValidItems(itemTypeControl: any): boolean {
        const names = this.items.map(item => item.feature.typeName);
        const nameSet = new Set(names);

        //NOTE: The conversion to a set drops any duplicated entries
        //TODO: Stop using two-way data binding and use form controls as temporary model, instead of blocking toggling
        this.valid = nameSet.size === names.length;

        //"Unique" is a custom field to indicate validity at the input level.
        //TODO: Use custom validator and native form flags instead
        itemTypeControl.unique = this.valid;

        return this.valid;
    }

    /**
     * Template helper that normalises the uniqueness flag to true in case the control
     * object does not exist yet. Initially, when no control is present, the type names
     * are guaranteed to be unique since no submission would have been allowed in the
     * first place.
     * @private
     * @param {Object} itemTypeControl - Form control for item's type name
     * @returns {boolean}
     */
    private isUnique(itemTypeControl: any): boolean {
        if (itemTypeControl && itemTypeControl.hasOwnProperty('unique')) {
            return itemTypeControl.unique;
        } else {
            return true;
        }
    }

    private createItem(f: Feature): any {
        return {
            feature: f,
            icon: 'fa-file-o',
            onClick: (ev) => {
                if (f.singleRow) {
                    f.addColumn();
                    return;
                }
                if (f.colSize() === 0) {
                    f.addColumn();
                }
                f.addRow();
            }
        };
    }
}
