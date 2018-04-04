import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild, ChangeDetectorRef
} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';

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
import {SubmSideBarComponent} from "./subm-sidebar/subm-sidebar.component";

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {

    //List of non-bubbling events to trigger auto-save
    //NOTE: 'section_add' has been omitted since adding sections is buggy at present
    static watchedUpdates = ['column_add', 'column_remove', 'row_add', 'row_remove', 'section_remove'];

    subm: Submission;
    section: Section;
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    formControls: FieldControl[] = [];       //immutable list of controls making up the form's section (fields, features...)
    sideBarCollapsed: boolean = false;
    readonly: boolean = false;
    accno: string = '';
    releaseDate: string = '';
    wrappedSubm: any;

    public isReverting: boolean = false;        //flag indicating submission is being rolled back to its latest release
    public isUpdate: boolean;                   //flag indicating if updating an already existing submission
    private subscr: Subscription;
    private isSubmitting: boolean = false;      //flag indicating submission data is being sent
    private isSaving: boolean = false;          //flag indicating submission data is being backed up
    private isNew: boolean = false;             //flag indicating submission has just been created through the UI

    @ViewChild(SubmSideBarComponent) sideBar: SubmSideBarComponent;
    @ViewChild('submForm') submForm: SubmFormComponent;
    @ViewChild('confirmSectionDel') confirmSectionDel: ConfirmDialogComponent;
    @ViewChild('confirmRevert') confirmRevert: ConfirmDialogComponent;
    @ViewChild('confirmSubmit') confirmSubmit: ConfirmDialogComponent;

    constructor(public route: ActivatedRoute,
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
    }

    get location() {
        return window.location;
    }


    ngOnInit(): Observable<any> {
        let eventStream;

        this.route.params.subscribe((params) => {

            //Determines if the current submission has just been created
            this.isNew = this.route.snapshot.data.isNew || false;

            //Waits for the parallel fetching of both the user data and the submission data to proceed
            eventStream = forkJoin([
                this.submService.getSubmission(params.accno),
                this.userData.whenFetched
            ]);

            eventStream.subscribe(results => {
                let page, subm;

                //Converts data coming from the server into the in-app submission format
                this.wrappedSubm = results[0];
                this.accno = this.wrappedSubm.accno;
                page = new PageTab(this.wrappedSubm.data);
                subm = page.toSubmission(SubmissionType.fromTemplate(page.firstAttachTo));
                this.subm = subm;

                //Inspects the original event producing the cascade of subsequent ones and saves the submission if it was triggered by a non-text update.
                //NOTE: Leaf nodes in the update event tree have no source.
                this.subm.updates().subscribe((event) => {
                    if (SubmEditComponent.watchedUpdates.indexOf(event.leafEvent.name) > -1) {
                        this.onChange();
                    }
                });

                //Determines the current section (in case the user navigates down to a subsection)
                this.changeSection(this.subm.root.id);

                //Newly created submission => sets default values
                if (this.isNew) {
                    this.setDefaults(this.section);
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
     * As soon as there is a new form section created, validate it, traverse it and get all its controls.
     * NOTE: By design, the section –and effectively the whole form– is rebuilt every time there
     * is a change in the form.
     * @see {@link SubmFormComponent}
     */
    ngAfterViewChecked() {
        if (this.submForm) {

            //Refreshes the required status of all members of a validation group
            this.submForm.sectionForm.updateGroupForm();

            //Validates the submission immediately
            this.errors = SubmissionValidator.validate(this.subm);

            //Retrieves all form controls as a flat array.
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

    /**
     * Checks that the form contains no errors. It does so with a double test to guarantee resilience:
     * batch validator's count and a DOM-based count. The latter for errors that don't concern the form itself
     * and therefore are not likely to be caught by the batch validator, such as repeated columns.
     * TODO: This is temporary. There is already an array for row errors. Columns should have a similar one.
     * @see {@link SubmFormComponent}
     * @see {@link SubmissionValidator}
     * @returns {boolean} True is there are no errors.
     */
    get formValid(): boolean {
        return this.errors.empty() && !this.submForm.hasError;
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
        let confirmMsg: string = `You are about to permanently delete the page named "${section.typeName}"`;

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
            this.isNew && this.locService.replaceState('/submissions/edit/' + this.accno);

            //A sent submission has been backed up. It follows it's been revised.
            if (!this.subm.isTemp && !this.subm.isRevised) {
                this.subm.isRevised = true;
            }
        });
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
            this.submForm.sectionForm.markAsTouched();
            this.isSubmitting = false;

            //Stopping the click event from bubbling messes up change detection for features => forces it.
            this.changeRef.detectChanges();

            //Updates the pending fields counter
            this.submForm.sectionForm.controls(this.formControls);

            //Switches to "Check" tab if not active already
            //TODO: check for validator errors needed to rule out column errors. Remove it.
            if (this.sideBar && !this.sideBar.isStatus && !this.errors.empty()) {
                this.sideBar.onTabClick(true);
            }

        //Form has been fully filled in and is valid => submits, requesting confirmation if applicable
        } else {
            if (isConfirm) {
                confirmShown = this.confirmSubmit.confirm(this.confirmSubmit.body, false);
            }
            confirmShown.subscribe((isOk: boolean) => {
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

        this.submService.submitSubmission(wrappedSubm).subscribe(
            resp => {

                //Extracts the release date if present
                const dateAttr = wrappedSubm.data.attributes.find(attribute => {
                    return attribute.name == 'ReleaseDate';
                });
                if (dateAttr) {
                    this.releaseDate = dateAttr.value;
                }

                //Updates the acccession number of a temporary submission with the one assigned by the server.
                if (this.subm.isTemp) {
                    this.accno = resp.mapping[0].assigned;
                    this.subm.accno = this.accno;
                }

                //Updates the view to reflect the "sent" state of the submission without knock-on effects on history
                this.locService.replaceState('/submissions/' + this.accno);
                this.readonly = true;

                //Flushes all updates synchronously so that the scroll reset happens exactly after them.
                this.changeRef.detectChanges();
                window.scrollTo(0,0);

                this.showSubmitResults(resp);
            },
            (error: ServerError) => {

                //Uses the original error object given by the server
                this.showSubmitResults(error.data.error);

                if (!error.isDataError) {
                    throw error;
                }
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
        bsModalRef.content.errors = this.errors;
    }

    showSubmitResults(resp: any) {
        this.isSubmitting = false;

        const bsModalRef = this.modalService.show(SubmResultsModalComponent).content;
        bsModalRef.isUpdate = this.isUpdate;
        bsModalRef.log = resp.log || {};
        bsModalRef.mapping = resp.mapping || [];
        bsModalRef.status = resp.status;
        bsModalRef.accno = this.subm.accno;
    }

    changeSection(sectionId: string) {
        const path: Section[] = this.subm.sectionPath(sectionId);
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

        copy.data = PageTab.fromSubmission(this.subm, isSubmit);

        //NOTE: for creation, the accession number remains blank when creating the PageTab object above
        this.isUpdate = !_.isEmpty(copy.data.accno);

        return copy;
    }
}
