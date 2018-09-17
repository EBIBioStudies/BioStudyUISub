import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';


import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/switchMap';

import {BsModalService} from 'ngx-bootstrap';

import {Section, Submission} from '../shared/submission.model';
import {SubmissionService} from '../shared/submission.service';
import {SubmissionType} from '../shared/submission-type.model';

import {PageTab} from '../shared/pagetab.model';
import {SubmissionValidator, SubmValidationErrors} from '../shared/submission.validator';
import {ServerError} from '../../http/server-error.handler';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {SubmFormComponent} from './subm-form/subm-form.component';
import {AppConfig} from '../../app.config';
import {FieldControl} from './subm-form/subm-form.service';
import {UserData} from '../../auth/user-data';
import {SubmValidationErrorsComponent} from './subm-navbar/subm-validation-errors.component';
import * as _ from 'lodash';
import {SubmSideBarComponent} from './subm-sidebar/subm-sidebar.component';
import {Subject} from 'rxjs/Subject';
import {submission2PageTab} from '../shared/submission-to-pagetab.util';
import {pageTab2Submission} from '../shared/pagetab-to-submission.util';
import {findSubmissionTemplateName} from '../shared/submission.templates';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit {
    @Input() readonly: boolean = false;

    @ViewChild(SubmSideBarComponent) sideBar?: SubmSideBarComponent;
    @ViewChild('submForm') submForm?: SubmFormComponent;
    @ViewChild('confirmSectionDel') confirmSectionDel?: ConfirmDialogComponent;
    @ViewChild('confirmRevert') confirmRevert?: ConfirmDialogComponent;
    @ViewChild('confirmSubmit') confirmSubmit?: ConfirmDialogComponent;

    subm?: Submission;
    section?: Section;
    formControls: FieldControl[] = [];          //immutable list of controls making up the form's section (fields, features...)
    sideBarCollapsed: boolean = false;
    accno: string = '';
    releaseDate: string = '';
    wrappedSubm: any;
    serverError?: ServerError;
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;  //form validation errors

    public isLoading: boolean = false;                  //flag indicating the submission is being loaded
    public isReverting: boolean = false;        //flag indicating submission is being rolled back to its latest release
    public isUpdate: boolean = false;                   //flag indicating if updating an already existing submission
    private isSubmitting: boolean = false;      //flag indicating submission data is being sent
    private isSaving: boolean = false;          //flag indicating submission data is being backed up
    private isNew: boolean = false;             //flag indicating submission has just been created through the UI
    protected ngUnsubscribe: Subject<void>;     //stopper for all subscriptions to HTTP get operations

    //List of non-bubbling events to trigger auto-save
    //NOTE: 'section_add' has been omitted since adding sections is buggy at present
    static watchedUpdates = ['column_add', 'column_remove', 'row_add', 'row_remove', 'section_remove'];

    constructor(public route: ActivatedRoute,
                public router: Router,
                public submService: SubmissionService,
                private locService: Location,
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

        this.ngUnsubscribe = new Subject<void>();
    }

    get location() {
        return window.location;
    }

    /**
     * Builds the submission model from the server data, doing any necessary initial updates for brand new submissions.
     * @returns {Observable<any>} Combined event stream for the async retrieval of submission and user data.
     */
    ngOnInit(): Observable<any> {
        let eventStream;

        this.route.params.takeUntil(this.ngUnsubscribe).subscribe((params) => {
            this.isLoading = true;

            //Determines if the current submission has just been created
            this.isNew = this.route.snapshot.data.isNew || false;

            //Waits for the parallel fetching of both the user data and the submission data to proceed
            eventStream = forkJoin([
                this.submService.getSubmission(params.accno),
                this.userData.whenFetched
            ]);

            eventStream.subscribe(

                //Data retrieved successfully => converts pageTab submission data, makes changes detectable and sets defaults
                results => {
                    let page:PageTab, subm;

                    //Converts data coming from the server into the in-app submission format
                    //NOTE: Type definitions are determined based on the first occurrence of the AttachTo attribute.
                    //NOTE: Submissions created through the direct upload flow may be attached to multiple projects.
                    this.wrappedSubm = results[0];
                    this.accno = this.wrappedSubm.accno;
                    page = this.wrappedSubm.data;
                    subm = pageTab2Submission(SubmissionType.fromTemplate(findSubmissionTemplateName(page)), page);
                    this.subm = subm;

                    //Inspects the original event producing the cascade of subsequent ones and saves the submission if
                    //it was triggered by a non-text update.
                    //NOTE: Leaf nodes in the update event tree have no source.
                    this.subm!.updates().subscribe((event) => {
                        if (SubmEditComponent.watchedUpdates.indexOf(event.leafEvent!.name) > -1) {
                            this.onChange();
                        }
                    });

                    //Determines the current section (in case the user navigates down to a subsection)
                    this.changeSection(this.subm!.section.id);

                    //Newly created submission => sets default values
                    if (this.isNew) {
                        this.setDefaults(this.section!);
                    }

                    this.isLoading = false;
                    this.serverError = undefined;
                },

                //Failed to retrieve submission data
                error => {
                    this.serverError = error;
                    this.reset();
                }
            );
        });

        return eventStream;
    }

    /**
     * Removes all subscriptions whenever the user navigates away from this view.
     * Requires the takeUntil operator before every subscription.
     * @see {@link https://stackoverflow.com/a/41177163}
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Sets the form's main state properties to their initial values.
     */
    reset() {
        this.isLoading = false;
        this.isSubmitting = false;
        this.subm = undefined;
        this.section = undefined;
        this.formControls = [];
        this.errors = SubmValidationErrors.EMPTY
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
        const contactFeature = section.features.find('Contact', 'typeName');

        if (contactFeature) {
            contactFeature.add(attributes, 0);
        }
        this.onChange();
    }

    /**
     * As soon as there is a new form section created, validate it, traverse it and get all its controls.
     * NOTE: By design, the section form is generated after the form child view has been render.
     * @see {@link SubmFormComponent}
     */
    ngAfterViewChecked() {
        if (this.submForm) {

            //Refreshes the required status of all members of a validation group
            this.submForm!.sectionForm!.updateGroupForm();

            //Validates the submission immediately
            this.errors = SubmissionValidator.validate(this.subm!);

            //Retrieves all form controls as a flat array.
            this.submForm!.sectionForm!.controls(this.formControls);
            this.changeRef.detectChanges();
        }
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    /**
     * Checks that the form contains no errors. It does so with a double test to guarantee resilience:
     * dynamic count (coming from Angular) and a DOM-based count. The latter count is for cater for errors that don't
     * concern the form itself and therefore are not likely to be caught by the dynamic count, such as repeated columns.
     * TODO: This is temporary. There is already an array for row errors. Columns should have a similar one.
     * @see {@link SubmFormComponent}
     * @see {@link SubmissionValidator}
     * @returns {boolean} True is there are no errors.
     */
    get formValid(): boolean {
        return !FieldControl.numInvalid && !this.submForm!.hasError;
    }

    onSectionClick(section: Section): void {
        this.changeSection(section.id);
    }

    /**
     * Handler for revert action. It deletes the current revision and loads the latest released version by
     * fetching the same submission again (after deletion).
     * @param {Event} event - DOM event for the click action.
     * TODO: This produces an spurious GET request. ngOnInit needs to be split up.
     */
    onRevert(event: Event) {
        this.confirmRevert!.confirm().takeUntil(this.ngUnsubscribe).subscribe(() => {
            this.isReverting = true;
            this.submService.deleteSubmission(this.accno).subscribe(() => {
                this.ngOnInit().subscribe(() => {
                    this.isReverting = false;
                });
            });
        });
    }

    /**
     * Reverts the view back to its editing mode, making it consistent with the submission's status.
     * @param {Event} event - DOM event for the click action.
     */
    onEditBack(event: Event) {
        this.readonly = false;
        this.subm!.isRevised = false;
        this.router.navigate(['/submissions/edit/' + this.accno]);
    }

    /**
     * Builds the string of text to be displayed in a confirmation modal rendered before deleting a section.
     * @param {Section} section - Section to be deleted
     */
    onSectionDelete(section: Section): void {
        let confirmMsg: string = `You are about to permanently delete the page named "${section.typeName}"`;

        if (section.accno) {
            confirmMsg += ` with accession number ${section.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.'

        this.confirmSectionDel!.confirm(confirmMsg).takeUntil(this.ngUnsubscribe).subscribe(() => {
            this.section!.sections.remove(section);
        });
    }

    /**
     * Handler for field change events. Saves the current data to the server, flagging the request's progress,
     * and updates the state of the view if the submission was new (replacing whatever route already exists).
     * NOTE: Views may be detached from the DOM before destruction and, during that time, events can still bubble up.
     * @param {Event} [event = null] - DOM event for the bubbled change.
     */
    onChange(event?: Event) {

        //If the save operation was triggered interactively, it checks if the view is still attached to the DOM
        if (!this.readonly && (event === undefined || document.body.contains(event.target as Node))) {
            this.isSaving = true;

            //Prepares the view in case the user chooses to reload it after saving.
            this.submService.saveSubmission(this.wrap()).takeUntil(this.ngUnsubscribe).subscribe((result) => {
                this.isSaving = false;
                this.isNew && this.locService.replaceState('/submissions/edit/' + this.accno);

                //A sent submission has been backed up. It follows it's been revised.
                if (!this.subm!.isTemp && !this.subm!.isRevised) {
                    this.subm!.isRevised = true;
                }
            });
        }
    }

    /**
     * Handler for form submission events. Checks that the form is valid. If not, it highlights all fields
     * that are incorrect and updates the checklist on the sidebar. Additionally, user confirmation before
     * submission can be requested.
     * @param event - DOM event triggering the submission. It can be a keypress event.
     * @param {boolean} [isConfirm = false] - If true, a modal is rendered before actually submitting.
     */
    onSubmit(event, isConfirm: boolean = false) {
        let confirmShown = Observable.of(true);     //dummy observable in case modal not shown

        //TODO: Why is this needed?
        if (event) {
            event.preventDefault();
        }

        //Validates in bulk if form incomplete
        if (!this.canSubmit() || !this.formValid) {
            this.submForm!.sectionForm!.markAsTouched();
            this.isSubmitting = false;

            //Stopping the click event from bubbling messes up change detection for features => forces it.
            this.changeRef.detectChanges();

            //Updates the pending fields counter
            this.submForm!.sectionForm!.controls(this.formControls);

            //Switches to "Check" tab if not active already
            //TODO: check for validator errors needed to rule out column errors. Remove it.
            if (this.sideBar && !this.sideBar.isStatus && FieldControl.numInvalid) {
                this.sideBar.onTabClick(true);
            }

        //Form has been fully filled in and is valid => submits, requesting confirmation if applicable
        } else {
            if (isConfirm) {
                confirmShown = this.confirmSubmit!.confirm(this.confirmSubmit!.body, false);
            }
            confirmShown.takeUntil(this.ngUnsubscribe).subscribe((isOk: boolean) => {
                if (isOk) {
                    this.submitForm()
                } else {
                    this.isSubmitting = false;
                }
            });
        }
    }

    /**
     * Performs the actual request to save the submission, updating the view afterwards. In the event of a
     * submission error, it shows the error tree. If, instead, the error is an application exception, the error
     * banner is rendered.
     */
    submitForm() {
        const wrappedSubm = this.wrap(true);

        this.submService.submitSubmission(wrappedSubm).takeUntil(this.ngUnsubscribe).subscribe(
            resp => {

                //Extracts the release date if present
                const dateAttr = wrappedSubm.data.attributes.find(attribute => {
                    return attribute.name == 'ReleaseDate';
                });
                if (dateAttr) {
                    this.releaseDate = dateAttr.value;
                }

                //Updates the acccession number of a temporary submission with the one assigned by the server.
                if (this.subm!.isTemp) {
                    this.accno = resp.mapping[0].assigned;
                    this.subm!.accno = this.accno;
                }

                //Updates the view to reflect the "sent" state of the submission without knock-on effects on history
                this.locService.replaceState('/submissions/' + this.accno);
                this.readonly = true;

                //Flushes all updates synchronously so that the scroll reset happens exactly after them.
                this.changeRef.detectChanges();
                window.scrollTo(0,0);

                !this.isUpdate && this.showSubmitResults(resp);
                this.isSubmitting = false;
            },
            (error: ServerError) => {

                //Uses the original error object given by the server
                this.showSubmitResults(error.data.error);

                if (!error.isDataError) {
                    throw error;
                }
                this.isSubmitting = false;
            }
        );
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
        bsModalRef.content.modalRef = bsModalRef;
        bsModalRef.content.errors = this.errors;
    }

    showSubmitResults(resp: any) {
        let logObj = {level: 'error'};

        this.isSubmitting = false;

        //Normalises error to object
        if (typeof resp === 'string') {
            logObj['message'] = resp;
        } else if (resp.log) {
            logObj = resp.log;
        } else {
            logObj['message'] = 'Unknown error. No log available.';
        }

        const bsModalRef = this.modalService.show(SubmResultsModalComponent);
        bsModalRef.content.modalRef = bsModalRef;
        bsModalRef.content.log = resp.log;
        bsModalRef.content.mapping = resp.mapping || [];
        bsModalRef.content.status = resp.status;
        bsModalRef.content.accno = this.subm!.accno;
    }

    changeSection(sectionId: string) {
        const path: Section[] = this.subm!.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
    }

    /**
     * Produces a formatted version of the submission data compliant with requests.
     * @param {boolean} isSubmit - The submission is to cease being a temporary one.
     * @returns {any} Data to be sent in a request.
     */
    private wrap(isSubmit: boolean = false): any {
        const copy = Object.assign({}, this.wrappedSubm);

        copy.data = submission2PageTab(this.subm!, isSubmit);

        //NOTE: for creation, the accession number remains blank when creating the PageTab object above
        this.isUpdate = !_.isEmpty(copy.data.accno);

        return copy;
    }
}
