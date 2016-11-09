import {Component, Inject} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {Submission, Attributes} from '../../submission/submission.model';
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel, Attr} from '../../submission/submission.model';

import tmpl from './subm-edit.component.html'

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
    readonly: boolean = false;
    submission: Submission;


    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel) {

        this.submission = submModel.importSubmission({}); // should be null
    }

    ngOnInit() {
        console.debug("SubmissionEdit: ngOnInit");
        let params = this.route.params.forEach((params:Params) => {
            let accno = params['accno'];
            this.submService
                .getSubmission(accno)
                .subscribe(subm => {
                    this.submission = this.submModel.importSubmission(subm.data);
                    //TODO
                    this.submission.releaseDate = "2016-01-01";
                    this.submission.addAnnotation(new Attr('name', 'value', 'text', true));
                    console.debug("submission:", this.submission);
                });
        });
    }

    addAnnotation() {
        if (this.submission) {
            this.submission.addAnnotation(new Attr('', ''));
        }
    }

    addLink() {
        if (this.submission) {
            this.submission.addLink();
        }
    }

    addFile() {
        if (this.submission) {
            this.submission.addFile();
        }
    }

    addPublication() {
        if (this.submission) {
            this.submission.addPublication();
        }
    }
}