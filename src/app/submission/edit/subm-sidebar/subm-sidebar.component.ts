import {
    Component,
    Input,
    Output,
    EventEmitter, ViewChild, OnChanges
} from '@angular/core';

import {SubmissionTemplate} from '../../shared/submission-template.model';
import {Section, Feature} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {SubmAddEvent} from "../subm-add/subm-add-event.model";

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html'
})
export class SubmSideBarComponent implements OnChanges {
    @Input() collapsed?: boolean = false;
    @Input() submTemplate: SubmissionTemplate;
    @Input() submSection: Section;

    @Output() toggle? = new EventEmitter();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    items: any[] = [];

    ngOnChanges(): void {
        const items = [];
        if (this.submSection) { //TODO
            this.submSection.features.list().forEach(
                (f: Feature) => items.push({
                    label: 'Add ' + f.name,
                    icon: 'fa-file-o',
                    onClick: function (ev) {
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
        }
        this.items = items;
    }

    onToggle(ev): void {
        ev.preventDefault();

        if (this.toggle) {
            this.toggle.emit();
        }
    }

    onAddClick(ev): void {
        ev.preventDefault();

        this.addDialog.show();
    }

    onAdd(ev: SubmAddEvent) {
        console.log('onAdd', ev);
        if (ev.itemType === 'SingleAttribute') {
            this.submSection.fields.add(ev.name);
        }
        if (ev.itemType === 'AttributeList') {
            this.submSection.features.add(ev.name, true);
        }
        if (ev.itemType === 'AttributeGrid') {
            this.submSection.features.add(ev.name, false);
        }
        if (ev.itemType === 'Section') {
            this.submSection.sections.add(ev.name);
        }
    }
}