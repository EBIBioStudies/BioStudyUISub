import {Component} from '@angular/core';
import {Params} from '@angular/router';

import {SubmEditComponent} from './subm-edit.component';
import {SubmissionType} from '../shared/submission-type.model';

import {pageTab2Submission} from '../shared/pagetab-to-submission.utils';
import {Observable, of} from 'rxjs';
import {findSubmissionTemplateName} from '../shared/templates/submission.templates';

@Component({
    selector: 'subm-view',
    templateUrl: './subm-view.component.html',
})
export class SubmViewComponent extends SubmEditComponent {
    ngOnInit(): Observable<any> {
        this.route.params.forEach((params: Params) => {
            this.accno = params['accno'];
            this.submService
                .getSubmittedSubmission(this.accno)
                .subscribe(wrappedSubm => {
                    const page = wrappedSubm.data;

                    this.wrappedSubm = wrappedSubm;
                    this.accno = wrappedSubm.accno;
                    this.subm = pageTab2Submission(SubmissionType.fromTemplate(findSubmissionTemplateName(page)), page);
                    this.updateCurrentSection(this.subm.section.id);
                });
        });

        return of(true);
    }
}
