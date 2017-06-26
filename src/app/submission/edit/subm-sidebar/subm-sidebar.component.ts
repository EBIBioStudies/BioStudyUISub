import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';

import {SubmissionTemplate} from '../../shared/submission-template.model';
import {Section, Feature} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {SubmAddEvent} from '../subm-add/subm-add-event.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSideBarComponent implements OnChanges {
    @Input() collapsed?: boolean = false;
    @Input() submTemplate: SubmissionTemplate;
    @Input() submSection: Section;

    @Output() toggle? = new EventEmitter();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    editing: boolean = false;
    items: any[] = [];

    private subscr: Subscription;

    ngOnChanges(changes: any): void {
        const secChange: SimpleChange = changes.submSection;
        if (secChange) {
            if (this.subscr) {
                this.subscr.unsubscribe();
            }
            const sec: Section = secChange.currentValue;
            if (sec) {
                this.subscr = sec.features
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

    onItemsChange(): void {
        const items = [];
        this.submSection.features.list().forEach(
            (f: Feature) => items.push({
                feature: f,
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
        this.items = items;
    }

}