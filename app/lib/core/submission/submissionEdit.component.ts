import {Component, Inject} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {Submission} from '../../submission/submission.model';
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel} from '../../submission/submission.model';

import tmpl from './submissionEdit.component.html'

@Component({
    selector: 'subm-edit',
    template: tmpl,
    styles: [`
    .popup {
      position: absolute;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #ddd;
      height: 251px;
    }
`]
})

export class SubmissionEditComponent {
    uisettings = {
        collapseLeftSide: false
    };
    readOnly: boolean = false;
    submission: Submission;


    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel) {

        this.submission = submModel.importSubmission({});
    }

    ngOnInit() {
        console.debug("SubmissionEdit: ngOnInit");
        let params = this.route.params.forEach((params:Params) => {
            let accno = params['accno'];
            this.submService
                .getSubmission(accno)
                .subscribe(subm => {
                    this.submission = this.submModel.importSubmission(subm.data);
                    console.debug("submission:", this.submission);
                });
        });
    }
}