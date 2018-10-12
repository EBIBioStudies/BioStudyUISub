import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {BsModalService} from 'ngx-bootstrap';

import {AttributeData, Section, Submission} from '../shared/submission.model';
import {SubmissionService} from '../shared/submission.service';
import {SubmValidationErrors} from '../shared/submission.validator';
import {ServerError} from '../../http/server-error.handler';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {AppConfig} from '../../app.config';
import {UserData} from '../../auth/user-data';
import {SubmValidationErrorsComponent} from './subm-navbar/subm-validation-errors.component';
import * as _ from 'lodash';
import {SubmSideBarComponent} from './subm-sidebar/subm-sidebar.component';
import {Subject} from 'rxjs/Subject';
import {submission2PageTab} from '../shared/submission-to-pagetab.utils';
import {pageTab2Submission} from '../shared/pagetab-to-submission.utils';
import {forkJoin, Observable, of} from 'rxjs';
import {SectionForm} from './subm-form/section-form';
import {UserInfo} from '../../auth/model/user-info';
import {switchMap, switchMap} from 'rxjs/operators';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit {
    @Input() readonly: boolean = false;

    @ViewChild(SubmSideBarComponent) sideBar?: SubmSideBarComponent;
    @ViewChild('confirmSectionDel') confirmSectionDel?: ConfirmDialogComponent;
    @ViewChild('confirmRevert') confirmRevert?: ConfirmDialogComponent;
    @ViewChild('confirmSubmit') confirmSubmit?: ConfirmDialogComponent;

    subm?: Submission;
    section?: Section;
    sectionForm?: SectionForm;
    sideBarCollapsed: boolean = false;
    accno: string = '';
    releaseDate: string = '';
    wrappedSubm: any;
    serverError?: ServerError;
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;  //form validation errors

    private isSubmitting: boolean = false;      //flag indicating submission data is being sent
    private isSaving: boolean = false;          //flag indicating submission data is being backed up

    private isNew: boolean = false;             //flag indicating submission has just been created through the UI

    private unsubscribe: Subject<void> = new Subject<void>();     //stopper for all subscriptions to HTTP get operations

    private editState: EditState = EditState.Default;

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

        this.onChange = _.throttle(this.onChange, 500, {'leading': false});
    }

    get location() {
        return window.location;
    }

    ngOnInit(): void {
        this.isNew = this.route.snapshot.data.isNew || false;

        this.route.params.takeUntil(this.unsubscribe).subscribe(params => {
            this.accno = params.accno;
            this.startLoading();
            this.load().subscribe( (error) => this.stopLoading(error));
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private load(): Observable<LoadError> {

        const loadFinished$ = new Subject<LoadError>();

        this.submService.getSubmission(this.accno).subscribe(
            wrappedSubm => {
                this.wrappedSubm = wrappedSubm;
                this.subm = pageTab2Submission(this.wrappedSubm.data);
                this.updateCurrentSection(this.subm.section.id);

                if (this.isNew) {
                    this.setDefaults(this.subm.section);
                }
                loadFinished$.next(LoadError.NoError);
            },

            error => {
                loadFinished$.next(LoadError.from(error));
                this.reset();
            }
        );
        return loadFinished$;
    }

    private startLoading() {
        this.editState = EditState.Loading;
    }

    private stopLoading(error:Loaderror) {
        if (error.isEmpty) {
            this.editState = EditState.Editting;
            return;
        }
        this.editState = EditState.Error;
        this.serverError = error;
        this.reset();
    }

    private startReverting() {
        this.editState = EditState.Reverting;
    }

    private stopReverting(error:LoadError) {
        this.editState = EditState.Editting;
    }

    private reset() {
        this.subm = undefined;
        this.section = undefined;
        this.errors = SubmValidationErrors.EMPTY
    }

    setDefaults(section: Section): void {
        this.userData.info$.subscribe(info => {
            const contactFeature = section.features.find('Contact', 'typeName');

            if (contactFeature) {
                contactFeature.add(this.asContactAttributes(info), 0);
            }
            this.onChange();
        });
    }

    private asContactAttributes(userInfo: UserInfo): AttributeData[] {
        return [
            {name: 'Name', value: userInfo.username},
            {name: 'E-mail', value: userInfo.email},
            {name: 'ORCID', value: userInfo.aux.orcid}
        ];
    }

    /* ngAfterViewChecked() {
         if (this.submForm) {

             //Refreshes the required status of all members of a validation group
             this.submForm!.sectionForm!.updateGroupForm();

             //Validates the submission immediately
             this.errors = SubmissionValidator.validate(this.subm!);

             //Retrieves all form controls as a flat array.
             this.submForm!.sectionForm!.controls(this.formControls);
             this.changeRef.detectChanges();
         }
     }*/

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    get formValid(): boolean {
        return this.sectionForm === undefined || this.sectionForm.form.valid;
    }

    onSectionClick(section: Section): void {
        this.updateCurrentSection(section.id);
    }

    onRevert(event: Event) {
        this.startReverting();

        this.confirmRevert!.confirm().takeUntil(this.unsubscribe)
            .pipe(
                switchMap(() => this.submService.deleteSubmission(this.accno)),
                switchMap(() => this.load())
            ).subscribe(error => this.stopReverting(error));



        subscribe(() => {
            this.startReverting();
            this.submService.deleteSubmission(this.accno).subscribe(() => {
                this.load();
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
        let confirmShown = of(true);     //dummy observable in case modal not shown

        //TODO: Why is this needed?
        if (event) {
            event.preventDefault();
        }

        //Validates in bulk if form incomplete
        if (!this.canSubmit() || !this.formValid) {
            // this.submForm!.sectionForm!.markAsTouched();
            this.isSubmitting = false;

            //Stopping the click event from bubbling messes up change detection for features => forces it.
            this.changeRef.detectChanges();

            //Updates the pending fields counter
            // this.submForm!.sectionForm!.controls(this.formControls);

            //Switches to "Check" tab if not active already
            //TODO: check for validator errors needed to rule out column errors. Remove it.
            //if (this.sideBar && !this.sideBar.isStatus && FieldControl.numInvalid) {
            //    this.sideBar.onTabClick(true);
            //}

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
                window.scrollTo(0, 0);

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

    updateCurrentSection(sectionId: string) {
        const path: Section[] = this.subm!.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
        this.sectionForm = new SectionForm(this.section);
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
