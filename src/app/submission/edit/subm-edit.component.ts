import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild, ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common';
import {
    ActivatedRoute,
    Params
} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from "rxjs/observable/forkJoin";
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
import {UserData} from "../../auth/user-data";
import {SubmValidationErrorsComponent} from "./subm-navbar/subm-validation-errors.component";
import * as _ from "lodash";

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {

    //List of non-bubbling events to trigger auto-save
    //NOTE: 'section_add' has been omitted since adding sections is at present buggy
    static watchedUpdates = ['column_add', 'column_remove', 'row_add', 'row_remove', 'section_remove'];

    subm: Submission;
    section: Section;
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    formControls: FieldControl[] = [];       //immutable list of controls making up the form's section (fields, features...)
    sideBarCollapsed: boolean = false;
    readonly: boolean = false;
    accno: string = '';
    wrappedSubm: any;

    private subscr: Subscription;
    private isSubmitting: boolean = false;      //flag indicating submission data is being sent
    private isReverting: boolean = false;       //flag indicating submission is being rolled back to its latest release
    private isSaving: boolean = false;          //flag indicating submission data is being backed up
    private isNew: boolean = false;             //flag indicating submission has just been created
    private isRevised: boolean = false;         //flag indicating a revision of an already sent submission

    @ViewChild('confirmSectionDel') confirmSectionDel: ConfirmDialogComponent;
    @ViewChild('confirmRevert') confirmRevert: ConfirmDialogComponent;
    @ViewChild('submForm') submForm: SubmFormComponent;

    constructor(public route: ActivatedRoute,
                public submService: SubmissionService,
                private location: Location,
                private modalService: BsModalService,
                private appConfig: AppConfig,
                private userData: UserData,
                private changeRef: ChangeDetectorRef) {

        //Initally collapses the sidebar for tablet-sized screens if applicable
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        //Avoids unnecessary post requests in case there's a cascade of updates from programmatic changes
        //NOTE: All calls are coalesced into the last one since it's that one that will lead to the most
        //up-to-date copy of the submission.
        this.onChange = _.throttle(this.onChange, 500, {'leading': false});
    }

    //TODO: this need splitting up. Especially the part dealing with server transactions and transformation of data.
    ngOnInit(): Observable<any> {
        let eventStream;

        this.route.params.subscribe((params) => {

            //Determines if the current submission has just been created
            this.isNew = this.route.snapshot.data.isNew || false;

            //Waits for the fetching of both the user data and the submission data to proceed
            eventStream = forkJoin([
                this.submService.getSubmission(params.accno),
                this.userData.whenFetched
            ]);

            eventStream.subscribe(results => {
                let page;

                //Converts data coming from the server into the in-app submission format
                this.wrappedSubm = results[0];
                this.accno = this.wrappedSubm.accno;
                page = new PageTab(this.wrappedSubm.data);
                this.subm = page.toSubmission(SubmissionType.createDefault());

                //Validates the submission immediately
                this.errors = SubmissionValidator.validate(this.subm);

                //Re-validates the submission on change (including non-text updates).
                this.subm.updates().switchMap((ue) => {

                        //Inspects the original event producing the cascade of subsequent ones and saves the submission if it was triggered by a non-text update.
                        //NOTE: Leaf nodes in the update event tree have no source.
                        if (SubmEditComponent.watchedUpdates.indexOf(ue.leafEvent.name) > -1) {
                            this.onChange();
                        }

                        //Performs programmatic validation, its results being aggregated in a modal log.
                        return SubmissionValidator.createObservable(this.subm);

                    }).subscribe(errors => {
                        this.errors = errors;
                    });

                //Determines the current section (in case the user navigates down to a subsection)
                this.changeSection(this.subm.root.id);

                //Newly created submission => sets default values
                if (this.isNew) {
                    this.setDefaults(this.section);
                    this.isRevised = false;
                }
            });
        });

        return eventStream;
    }

    /**
     * Sets default values for a given section of the submission
     * @param {Section} section - Section on which default values are to be applied
     * TODO: Apply defaults once recursively in case submission has subsections.
     */
    setDefaults(section: Section): void {
        const usrContact = this.userData.contact;
        const attributes = Object.keys(usrContact).map((key) => {
            return {name: key, value: usrContact[key]}
        });

        section.features.find('Contact', 'typeName').add(attributes, 0);
        this.onChange();
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
            this.changeRef.detectChanges();
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

    /**
     * Handler for revert action. It deletes the current revision and loads the latest released version by
     * fetching the same submission again (after deletion).
     * @param {Event} event DOM event for the click action.
     * TODO: This produces an spurious GET request. ngOnInit needs to be split up.
     */
    onRevert(event: Event) {
        this.confirmRevert.confirm().subscribe(() => {
            this.isReverting = true;
            this.submService.deleteSubmission(this.accno).subscribe(() => {
                this.ngOnInit().subscribe(() => {
                    this.isReverting = false;
                });
            });
        });
    }

    /**
     * Builds the string of text to be displayed in a confirmation modal rendered before deleting a section.
     * @param {Section} section - Section to be deleted
     */
    onSectionDelete(section: Section): void {
        let confirmMsg: string = `You are about to permanently delete the section named "${section.typeName}"`;

        if (section.accno) {
            confirmMsg += ` with accession number ${section.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.'

        this.confirmSectionDel.confirm(confirmMsg).subscribe(() => {
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

            //A sent submission has been backed up. It follows it's been revised.
            if (!this.subm.isTemp && !this.subm.isRevised) {
                this.subm.isRevised = true;
            }
        });
    }

    onSubmit(event) {
        //TODO: Why is this needed?
        if (event) {
            event.preventDefault();
        }

        //Validates in bulk if form incomplete
        if (!this.canSubmit() || !this.formValid) {
            this.submForm.sectionForm.markAsTouched();
            this.isSubmitting = false;

            //Stopping the click event from bubbling messes up change detection for features => forces it.
            this.changeRef.detectChanges();

            //Updates the pending fields counter
            this.submForm.sectionForm.controls(this.formControls);

            return;
        }

        //TODO: this could probably do with its own method
        this.submService.submitSubmission(this.wrap())
            .subscribe(
                resp => {

                    //Updates the acccession number of a temporary submission with the one assigned by the server.
                    if (this.subm.isTemp) {
                        this.accno = resp.mapping[0].assigned;
                        this.subm.accno = this.accno;
                    }

                    //Updates the view to reflect the "sent" state of the submission without knock-on effects on history
                    this.location.replaceState('/submissions/' + this.accno);
                    this.readonly = true;

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
        if (this.isSubmitting) {
            return false;
        } else {
            this.isSubmitting = true;
            return true;
        }
    }

    onViewLog(event: Event): void {
        const bsModalRef = this.modalService.show(SubmValidationErrorsComponent);
        bsModalRef.content.errors = this.errors;
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
        bsModalRef.content.accno = this.subm.accno;
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
}
