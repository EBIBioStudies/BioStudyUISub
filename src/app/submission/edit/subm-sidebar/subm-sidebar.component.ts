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

import {Section, Feature} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {SubmAddEvent} from '../subm-add/subm-add-event.model';
import {SectionType, FieldType, FeatureType} from '../../shared/submission-template.model';
import * as stu from '../../shared/submission-template.utils';

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSideBarComponent implements OnChanges {
    @Input() collapsed?: boolean = false;
    @Input() sectionWithType: [Section, SectionType];
    @Output() toggle? = new EventEmitter();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    editing: boolean = false;
    items: any[] = [];

    private subscr: Subscription;

    ngOnChanges(changes: any): void {
        const secChange: SimpleChange = changes.sectionWithType;
        if (secChange) {
            if (this.subscr) {
                this.subscr.unsubscribe();
            }
            if (this.sectionWithType !== undefined) {
                this.subscr = this.sectionWithType[0].features
                    .updates()
                    .subscribe(ev => {
                        if (ev.name === 'feature_add' ||
                            ev.name === 'feature_remove')
                            this.onItemsChange();
                    });
                this.onItemsChange();
            }
        }
    }

    get section(): Section {
        return this.sectionWithType ? this.sectionWithType[0] : undefined;
    }

    get sectionType(): SectionType {
        return this.sectionWithType ? this.sectionWithType[1] : undefined;
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
        if (ev.itemType === 'SingleAttribute') {
            const fieldType = this.sectionType.getFieldType(ev.name);
            stu.addField(this.section, fieldType);
            return;
        }
        if (ev.itemType === 'Section') {
            const sectionType = this.sectionType.getSectionType(ev.name);
            stu.addSection(this.section, sectionType);
            return;
        }
        const idx = ['AttributeList', 'AttributeGrid'].indexOf(ev.itemType);
        if (idx > -1) {
            const singleRow = idx === 0;
            const featureType = this.sectionType.getFeatureType(ev.name, singleRow);
            stu.addFeature(this.section, featureType);
        }
    }

    onItemsChange(): void {
        const items = [];
        this.section.features.list().forEach(
            (f: Feature) => items.push({
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
            })
        );
        this.items = items;
    }

}