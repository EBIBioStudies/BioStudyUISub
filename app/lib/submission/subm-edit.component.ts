import {Component, Inject, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {ActivatedRoute, Router, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {ModalDirective} from 'ng2-bootstrap/modal/modal.component';

import {Submission} from './submission';
import {PageTab} from './pagetab';
import {SubmissionService} from './submission.service';
import {SubmissionModel} from './submission.model';
import {DictionaryService} from './dictionary.service';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})

export class SubmissionEditComponent implements OnInit, OnDestroy {
    uisettings = {
        collapseLeftSide: false
    };
    readonly: boolean = false;
    submission: Submission;
    errors: string[] = [];

    private submitting: boolean = false;
    private accno: string = '';

    private __subscr: Subscription;
    private __wrap;

    @ViewChild('submitResults') public submitResults: ModalDirective;

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(DictionaryService) private dictService: DictionaryService,
                @Inject(SubmissionModel) private submModel: SubmissionModel,
                @Inject(Router) private router: Router) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.accno = params['accno'];

            this.submService
                .getSubmission(this.accno)
                .subscribe(resp => {
                    let wrap = resp;
                    let pt = new PageTab(wrap.data);
                    this.__wrap = ((w, p) => {
                        return function () {
                            w.data = p.data;
                            return wrap;
                        }
                    })(wrap, pt);

                    this.submission = pt.asSubmission(this.dictService.dict());
                    console.debug('SubmEdit: submission loaded ', this.submission);

                    this.__subscr = pt.changes().subscribe((changes) => {
                        console.debug('SubmEdit: sending changes to the server...');
                        this.submService.saveSubmission(this.__wrap())
                            .subscribe(resp => {
                                console.debug('SubmEdit: all sent');
                            });
                    });
                });
        });
    }

    ngOnDestroy() {
        console.debug("SubmEdit: (OnDestroy)");
        if (this.__subscr) {
            this.__subscr.unsubscribe();
        }
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.canSubmit()) {
            return;
        }

        this.errors = this.submModel.validate(this.submission);
        if (this.errors.length > 0) {
            this.showSubmitResults();
            return;
        }
        this.submService.submitSubmission(this.__wrap())
            .subscribe(
                resp => {
                    console.debug("submitted", resp);
                    this.showSubmitResults()
                },
                error => {
                    this.errors = ['Failed to submit'];
                    this.showSubmitResults();

                    if (!error.isInputError()) {
                        throw error;
                    }
                });
    }

    canSubmit() {
        return this.submitting ? false : (this.submitting = true);
    }

    showSubmitResults() {
        this.submitting = false;
        this.submitResults.show();
    }

    onSubmitResultsHide() {
        if (this.errors.length === 0) {
            this.router.navigate(['/submissions']);
        }
    }

    addAnnotation() {
        if (this.submission) {
            this.submission.addAnnotation();
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

    addContact() {
        if (this.submission) {
            this.submission.addContact();
        }
    }
}