import {Component, Inject, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {ActivatedRoute, Router, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';

import {Submission} from '../../submission/submission';
import {PageTab} from '../../submission/pagetab';
import {SubmissionService} from '../../submission/submission.service';
import {DictionaryService} from '../../submission/dictionary.service';
import {SubmissionModel} from '../../submission/submission.model';

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