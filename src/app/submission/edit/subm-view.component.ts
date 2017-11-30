import {
    Component,
    OnInit
} from '@angular/core';

import {
    ActivatedRoute,
    Params
} from '@angular/router';

import {SubmEditComponent} from "./subm-edit.component";
import {PageTab} from "../shared/pagetab.model";
import {SubmissionType} from "../shared/submission-type.model";

@Component({
    selector: 'subm-view',
    templateUrl: './subm-edit.component.html',
})
export class SubmViewComponent extends SubmEditComponent {
    ngOnInit() {
        this.readonly = true;
        this.route.params.forEach((params: Params) => {
            this.accno = params['accno'];
            this.submService
                .getSubmittedSubmission(this.accno)
                .subscribe(wrappedSubm => {
                    const page = new PageTab(wrappedSubm.data);

                    this.wrappedSubm = wrappedSubm;
                    this.accno = wrappedSubm.accno;
                    this.subm = page.toSubmission(SubmissionType.createDefault());
                    this.changeSection(this.subm.root.id);
                });
        });
    }
}
