import {Component, Inject, OnInit, OnDestroy, ViewChild} from '@angular/core';

import {ActivatedRoute, Router, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';

import {Submission, PageTab, SubmissionService, SubmissionModel, DictionaryService} from '../../submission/index';

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
                .editSubmission(this.accno)
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
                    console.log("submission:", this.submission);

                    this.__subscr = pt.changes().subscribe((changes) => {
                        console.debug("save changes");
                        this.submService.saveSubmission(this.__wrap())
                            .subscribe(resp => {
                                console.debug("saved");
                            });
                    });
                });
        });
    }

    ngOnDestroy() {
        console.debug("SubmissionEditComponent::OnDestroy");
        if (this.__subscr) {
            this.__subscr.unsubscribe();
        }
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.canSubmit()) {
            return;
        }

        this.errors = this.submModel.validate(this.submission);
        if (this.errors.length > 0) {
            this.showSubmitResults();
            return;
        }
        this.submService.submitSubmission(this.__wrap())
            .subscribe(resp => {
                console.debug("submitted", resp);
                if (resp.status !== "OK") {
                    //TODO get real messages from response
                    this.errors = ['Failed to submit'];
                }
                this.showSubmitResults()
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