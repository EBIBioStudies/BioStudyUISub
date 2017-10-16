import {
    Component,
    OnInit
} from '@angular/core';

import {
    ActivatedRoute,
    Router,
    Params
} from '@angular/router';

import {
    Submission,
    PageTab,
    DictionaryService
} from 'app/submission-model/index';

import {SubmissionService} from '../shared/submission.service';

@Component({
    selector: 'subm-view',
    templateUrl: './subm-edit.component.html',
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
export class SubmViewComponent implements OnInit {
    submission: Submission;
    readonly = true;

    constructor(private route: ActivatedRoute,
                private submService: SubmissionService,
                private dictService: DictionaryService,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            const accno = params['accno'];
            this.submService
                .getSubmittedSubmission(accno)
                .subscribe(resp => {
                    const pt = new PageTab(resp.data);
                    this.submission = pt.asSubmission(this.dictService.dict());
                });
        });
    }

    onEditSubmission() {
        this.router.navigate(['/submissions', this.submission.accno])
    }
}
