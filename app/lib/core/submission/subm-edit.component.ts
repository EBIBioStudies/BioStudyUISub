import {Component, Inject, OnInit, OnDestroy} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {Submission} from '../../submission/submission';
import {PageTab} from '../../submission/pagetab';
import {SubmissionService} from '../../submission/submission.service';
import {DictionaryService} from '../../submission/dictionary.service';

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
    private subscr: Subscription;

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute,
                @Inject(SubmissionService) private submService: SubmissionService,
                @Inject(DictionaryService) private dictService: DictionaryService) {
    }

    ngOnInit() {
        console.debug("SubmissionEditComponent::OnInit");
        let params = this.route.params.forEach((params:Params) => {
            let accno = params['accno'];
            this.submService
                .getSubmission(accno)
                .subscribe(resp => {
                    let wrap = resp;
                    let pt = new PageTab(wrap.data);
                    this.submission = pt.asSubmission(this.dictService.dict());
                    console.debug("submission:", this.submission);

                    this.subscr = pt.changes().subscribe((changes) => {
                        console.debug("save changes");
                        wrap.data = pt.data;
                        console.debug(wrap.data);
                        this.submService.saveSubmission(wrap)
                            .subscribe(resp => {
                               console.debug("saved");
                            });
                    });
                });
        });
    }

    ngOnDestroy() {
        console.debug("SubmissionEditComponent::OnDestroy");
        if (this.subscr) {
            this.subscr.unsubscribe();
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