import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {SubmissionTemplate} from '../../shared/submission-template.model';
import {Section, Feature} from "../../shared/submission.model";

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html'
})
export class SubmissionSideBarComponent {
    @Input() collapsed?: boolean = false;
    @Input() submTemplate: SubmissionTemplate;
    @Input() submSection: Section;

    @Output() toggle? = new EventEmitter();

    get items(): any[] {
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
        return items;
    }

    onToggle(ev): void {
        ev.preventDefault();

        if (this.toggle) {
            this.toggle.emit();
        }
    }
}