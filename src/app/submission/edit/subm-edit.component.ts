import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild
} from '@angular/core';
import {
    ActivatedRoute,
    Params
} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import {BsModalService} from 'ngx-bootstrap/modal';

import {
    Submission,
    Section
} from '../shared/submission.model';
import {SubmissionService} from '../shared/submission.service';
import {
    SubmissionType
} from '../shared/submission-type.model';

import {PageTab} from '../shared/pagetab.model';
import {
    SubmissionValidator,
    SubmValidationErrors
} from '../shared/submission.validator';
import {ServerError} from '../../http/server-error.handler';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';
import {ConfirmDialogComponent} from 'app/shared/index';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {
    sideBarCollapsed = false;
    readonly = false;

    subm: Submission;
    section: Section;

    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    accno = '';

    private subscr: Subscription;
    private isSubmitting = false;
    private isSaving = false;
    private wrappedSubm: any;
    @ViewChild('confirmDialog') confirmDialog: ConfirmDialogComponent;

    constructor(private route: ActivatedRoute,
                private submService: SubmissionService,
                private modalService: BsModalService) {
    }

    ngOnInit() {
        this.route.params
            .map((params: Params) => params['accno'])
            .switchMap(accno => this.submService.getSubmission(accno))
            .subscribe(wrappedSubm => {
                this.wrappedSubm = wrappedSubm;
                this.accno = wrappedSubm.accno;
                this.subm = (new PageTab(wrappedSubm.data)).toSubmission(SubmissionType.createDefault());

                this.errors = SubmissionValidator.validate(this.subm);

                this.subm
                    .updates()
                    .switchMap(ue => SubmissionValidator.createObservable(this.subm))
                    .subscribe(errors => {
                        this.errors = errors;
                    });

                this.changeSection(this.subm.root.id);
            });
    }

    ngOnDestroy() {
        if (this.subscr) {
            this.subscr.unsubscribe();
        }
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    get submValid(): boolean {
        return this.errors.empty();
    }

    onSectionClick(section: Section): void {
        this.changeSection(section.id);
    }

    onSectionDelete(section: Section): void {
        let confirmMsg: string = 'You are about to permanently delete the section';

        if (section.accno) {
            confirmMsg += ` with accession number ${section.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.'

        this.confirm(confirmMsg)
            .subscribe(() => {
                this.section.sections.remove(section);
            });
    }

    /**
     * Handler for field change events. Saves the current data to the server, flagging the request's progress.
     */
    onChange() {
        this.isSaving = true;
        this.submService.saveSubmission(this.wrap()).subscribe(result => this.isSaving = false);
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.canSubmit() || !this.submValid) {
            return;
        }

        this.submService.submitSubmission(this.wrap())
            .subscribe(
                resp => {
                    console.log('submitted', resp);
                    this.showSubmitResults(resp);
                },
                (error: ServerError) => {

                    //Uses the original error object given by the server
                    this.showSubmitResults(error.data.error);

                    if (!error.isDataError) {
                        throw error;
                    }
                });
    }

    canSubmit() {
        return this.isSubmitting ? false : (this.isSubmitting = true);
    }

    showSubmitResults(resp: any) {
        this.isSubmitting = false;

        const subscriptions = (function () {
            let list = [];
            return {
                push: function (i) {
                    list.push(i);
                },
                unsubscribe: function () {
                    list.forEach(i => i.unsubscribe());
                    list = [];
                }
            }
        })();

        const bsModalRef = this.modalService.show(SubmResultsModalComponent);
        bsModalRef.content.log = resp.log || {};
        bsModalRef.content.mapping = resp.mapping || [];
        bsModalRef.content.status = resp.status;
    }

    private wrap(): any {
        const w = Object.assign({}, this.wrappedSubm);
        w.data = PageTab.fromSubmission(this.subm);
        return w;
    }

    private confirm(text: string): Observable<any> {
        return this.confirmDialog.confirm(text);
    }

    private changeSection(sectionId: string) {
        const path: Section[] = this.subm.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
    }
}
