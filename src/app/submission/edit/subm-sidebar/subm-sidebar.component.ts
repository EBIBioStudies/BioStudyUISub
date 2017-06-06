import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {SubmissionTemplate} from "../../shared/submission-template.model";
import {Submission} from "../../shared/submission.model";

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html'
})
export class SubmissionSideBarComponent {
    @Input() collapsed?: boolean = false;
    @Input() subm: Submission;
    @Input() submTemplate: SubmissionTemplate;
    @Input() currSection: string;

    @Output() toggle? = new EventEmitter();

    get items(): any[] {
        const items = [];
        if (this.subm) { //TODO
            const sec = this.subm.section(this.currSection);
            sec.features.list().forEach(
                f => items.push({
                    label: 'Add ' + f.name,
                    icon: 'fa-file-o',
                    onClick: function (ev) {
                        console.log('add row');
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