import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { Location } from '@angular/common';
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
import {SubmFormComponent} from "./subm-form/subm-form.component";
import {AppConfig} from "../../app.config";
import {FieldControl} from "./subm-form/subm-form.service";

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {
    subm: Submission;
    section: Section;
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    formControls: FieldControl[] = [];       //immutable list of controls making up the form's section (fields, features...)
    sideBarCollapsed: boolean = false;
    readonly: boolean = false;
    accno: string = '';
    wrappedSubm: any;

    private subscr: Subscription;
    private isSubmitting = false;
    private isSaving = false;
    private isNew = false;


    @ViewChild('confirmDialog') confirmDialog: ConfirmDialogComponent;
    @ViewChild('submForm') submForm: SubmFormComponent;

    constructor(public route: ActivatedRoute,
                public submService: SubmissionService,
                private location: Location,
                private modalService: BsModalService,
                private appConfig: AppConfig) {

        //Initally collapses the sidebar for tablet-sized screens if applicable
        if (this.appConfig) {
            this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;
        }
    }

    ngOnInit() {

        //Determines if the current submission has just been created
        this.route.data.subscribe((data) => {
            this.isNew = data.isNew || false;
        });

        this.route.params
            .switchMap((params: Params) => this.submService.getSubmission(params.accno))
            .subscribe(wrappedSubm => {
                let page;

                this.wrappedSubm = wrappedSubm;
                this.accno = wrappedSubm.accno;
                page = new PageTab(wrappedSubm.data);
                this.subm = page.toSubmission(SubmissionType.createDefault());

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

    /**
     * As soon as there is a new form section created, traverse it and get all its controls.
     * Note that, by design, the section –and effectively the whole form– is rebuilt every time there
     * is a change in the form.
     * @see {@link SubmFormComponent}
     */
    ngAfterViewChecked() {
        if (this.submForm) {
            this.submForm.sectionForm.controls(this.formControls);
        }
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

    get formValid(): boolean {
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
     * Handler for field change events. Saves the current data to the server, flagging the request's progress,
     * and updates the state of the view if the submission was new (replacing whatever route already exists).
     */
    onChange() {
        this.isSaving = true;
        this.submService.saveSubmission(this.wrap()).subscribe((result) => {
            this.isSaving = false;
            this.isNew && this.location.replaceState('/submissions/edit/' + this.accno);
        });
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.canSubmit() || !this.formValid) {
            this.submForm.sectionForm.markAsTouched();
            this.isSubmitting = false;
            return;
        }

        this.submService.submitSubmission(this.wrap())
            .subscribe(
                resp => {
                    this.showSubmitResults(resp);

                    //Updates the view to reflect the "sent" state of the submission without knock-on effects on history
                    this.location.replaceState('/submissions/' + resp.mapping[0].assigned);
                    this.accno = resp.mapping[0].assigned;
                    this.readonly = true;
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

    changeSection(sectionId: string) {
        const path: Section[] = this.subm.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
    }

    private wrap(): any {
        const w = Object.assign({}, this.wrappedSubm);
        w.data = PageTab.fromSubmission(this.subm);
        return w;
    }

    private confirm(text: string): Observable<any> {
        return this.confirmDialog.confirm(text);
    }
}
