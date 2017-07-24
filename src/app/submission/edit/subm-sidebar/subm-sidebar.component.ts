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
    @Input() collapsed?: boolean = false;
    @Input() section: Section;
    @Output() toggle? = new EventEmitter();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    editing: boolean = false;
    items: any[] = [];

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
                            ev.name === 'feature_remove')
                            this.onItemsChange();
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