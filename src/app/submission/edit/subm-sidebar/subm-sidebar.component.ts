import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';

import {Section, Feature} from '../../shared/submission.model';
import {SubmAddDialogComponent} from '../subm-add/subm-add.component';
import {SubmAddEvent} from '../subm-add/subm-add-event.model';
import {Subscription} from 'rxjs/Subscription';
import {SectionWithTemplate, FeatureWithTemplate} from '../../shared/submission-with-template.model';

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSideBarComponent implements OnChanges {
    @Input() collapsed?: boolean = false;
    @Input() sectionAndTmpl: SectionWithTemplate;
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
            const sectionAndTmpl = secChange.currentValue;
            if (sectionAndTmpl) {
                this.subscr = sectionAndTmpl.section.features
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
        return this.sectionAndTmpl ? this.sectionAndTmpl.section : undefined;
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
            this.sectionAndTmpl.addField(ev.name);
        }
        if (ev.itemType === 'AttributeList') {
            this.sectionAndTmpl.addFeature(ev.name, true);
        }
        if (ev.itemType === 'AttributeGrid') {
            this.sectionAndTmpl.addFeature(ev.name, false);
        }
        if (ev.itemType === 'Section') {
            this.sectionAndTmpl.addSection(ev.name);
        }
    }

    onItemsChange(): void {
        const items = [];
        this.sectionAndTmpl.features.forEach(
            (f: FeatureWithTemplate) => items.push({
                feature: f,
                icon: 'fa-file-o',
                onClick: (ev) => {
                    f.addItem();
                }
            })
        );
        this.items = items;
    }

}