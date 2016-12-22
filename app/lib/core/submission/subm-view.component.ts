import {Component, Inject, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {ActivatedRoute, Router, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';

import {Submission, PageTab, SubmissionService, DictionaryService} from '../../submission/index';

import tmpl from './subm-edit.component.html'

@Component({
    selector: 'subm-view',
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

export class SubmissionViewComponent implements OnInit {
    private readonly: boolean = true;
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