import {Component, Inject, OnInit, OnDestroy} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {Submission} from '../../submission/submission';
import {PageTab} from '../../submission/pagetab';
import {SubmissionService} from '../../submission/submission.service';
import {DictionaryService} from '../../submission/dictionary.service';
import {SubmissionModel} from '../../submission/submission.model';

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

    private __subscr: Subscription;
    private __wrap;

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(DictionaryService) private dictService: DictionaryService,
                @Inject(SubmissionModel) private submModel: SubmissionModel,) {
    }

    ngOnInit() {
        console.debug("SubmissionEditComponent::OnInit");
        let params = this.route.params.forEach((params: Params) => {
            let accno = params['accno'];
            this.submService
                .getSubmission(accno)
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
                    console.debug("submission:", this.submission);

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

        let errors = this.submModel.validate(this.submission);
        if (errors.length > 0) {
            //TODO show validation errors in modal dialog
            return;
        }
        this.submService.submitSubmission(this.__wrap)
            .subscribe(resp => {
                console.debug("submitted", resp);
                if (resp.status === "OK") {
                    //TODO: show success
                } else {
                    //TODO: showSubmitFailed(['Failed to submit.']);
                }
            });
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