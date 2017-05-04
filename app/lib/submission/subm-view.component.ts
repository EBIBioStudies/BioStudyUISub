import {Component, Inject, OnInit} from '@angular/core';

import {ActivatedRoute, Router, Params} from '@angular/router';

import {Submission} from './submission';
import {PageTab} from './pagetab';
import {SubmissionService} from './submission.service';
import {DictionaryService} from './dictionary.service';

@Component({
    selector: 'subm-view',
    templateUrl:  './subm-edit.component.html',
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

export class SubmissionViewComponent implements OnInit {
    private submission: Submission;

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(DictionaryService) private dictService: DictionaryService,
                @Inject(Router) private router: Router) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            let accno = params['accno'];
            this.submService
                .getSubmittedSubmission(accno)
                .subscribe(resp => {
                    let pt = new PageTab(resp.data);
                    this.submission = pt.asSubmission(this.dictService.dict());
                });
        });
    }

    onEditSubmission() {
        this.router.navigate(['/edit', this.submission.accno])
    }
}