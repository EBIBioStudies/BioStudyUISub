import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';

import {SectionTemplate} from '../../shared/submission-template.model';
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
    @Input() sectionAndTmpl: [Section, SectionTemplate];
    @Output() toggle? = new EventEmitter();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    editing: boolean = false;
    items: any[] = [];

    private subscr: Subscription;

    ngOnChanges(changes: any): void {
        const secChange: SimpleChange = changes.sectionAndTmpl;
        if (secChange) {
            if (this.subscr) {
                this.subscr.unsubscribe();
            }
            const [sec, _] = secChange.currentValue || [undefined, undefined];
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

    get section(): Section {
        return this.sectionAndTmpl ? this.sectionAndTmpl[0] : undefined;
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
            this.section.fields.add(ev.name);
        }
        if (ev.itemType === 'AttributeList') {
            this.section.features.add(ev.name, true);
        }
        if (ev.itemType === 'AttributeGrid') {
            this.section.features.add(ev.name, false);
        }
        if (ev.itemType === 'Section') {
            this.section.sections.add(ev.name);
        }
    }

    onItemsChange(): void {
        const items = [];
        this.section.features.list().forEach(
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