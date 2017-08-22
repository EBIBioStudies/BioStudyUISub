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

    editing: boolean = false;   //component's mode: display or editing, with different renderings
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

    /**
     * Provided is valid, it saves the form data onto the model's respective properties on submission.
     * @param {NgForm} form Object generated from type name fields.
     */
    onSubmit(form: NgForm): void {
        const items = this.items;

        if (form.valid) {

            //Field names suffixed with the corresponding items array index
            Object.keys(form.value).forEach(key => {
                const itemsIdx = key.split('_')[1];

                items[itemsIdx].feature.typeName = form.value[key];
            });
        }
        this.onEditModeToggle();
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
        if (ev.itemType === 'Section') {
            const sectionType = this.sectionType.getSectionType(ev.name);
            this.section.sections.add(sectionType);
            return;
        }
        const idx = ['AttributeList', 'AttributeGrid'].indexOf(ev.itemType);
        if (idx > -1) {
            const singleRow = idx === 0;
            const featureType = this.sectionType.getFeatureType(ev.name, singleRow);
            const f = this.section.features.add(featureType);
        }
    }

    onItemDelete(itemIdx: number): void {
        this.confirm().subscribe(() => {
            this.removeItemAt(itemIdx);
        });
    }

    onItemsChange(): void {
        const items = [];
        items.push(this.createItem(this.section.annotations));
        this.section.features.list().forEach(
            (f: Feature) => items.push(this.createItem(f))
        );
        this.items = items;
    }

    private confirm(): Observable<any> {
        return this.confirmDialog.confirm();
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

    private removeItemAt(index: number): void {
        this.items.splice(index, 1);
    }
}
