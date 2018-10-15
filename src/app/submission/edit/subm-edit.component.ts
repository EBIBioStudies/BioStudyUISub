import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {BsModalService} from 'ngx-bootstrap';

import {AttributeData, Section, Submission} from '../shared/submission.model';
import {SubmissionService} from '../shared/submission.service';
import {SubmissionValidator, SubmValidationErrors} from '../shared/submission.validator';
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
import {Observable, of} from 'rxjs';
import {SectionForm} from './subm-form/section-form';
import {UserInfo} from '../../auth/model/user-info';
import {switchMap, throttleTime} from 'rxjs/operators';
import {throttle} from 'rxjs-compat/operator/throttle';

class EditState {
    private state: string;

    constructor() {
        this.state = EditState.Loading;
    }

    startLoading() {
        this.state = EditState.Loading;
    }

    stopLoading(error: ServerErrorResponse = ServerErrorResponse.NoError) {
        this.backToEditing(error);
    }

    startReverting() {
        this.state = EditState.Reverting;
    }

    stopReverting(error: ServerErrorResponse = ServerErrorResponse.NoError) {
        this.backToEditing(error);
    }

    startSaving() {
        this.state = EditState.Saving;
    }

    stopSaving(error: ServerErrorResponse = ServerErrorResponse.NoError) {
        this.backToEditing(error);
    }

    startSubmitting() {
        this.state = EditState.Submitting;
    }

    stopSubmitting(error: ServerErrorResponse = ServerErrorResponse.NoError) {
        this.backToEditing(error);
    }

    get isSubmitting(): boolean {
        return this.state === EditState.Submitting;
    }

    get isLoading(): boolean {
        return this.state === EditState.Loading;
    }

    get isSaving(): boolean {
        return this.state === EditState.Saving;
    }

    get isReverting(): boolean {
        return this.state === EditState.Reverting;
    }

    private backToEditing(error: ServerErrorResponse) {
        if (error.error === undefined) {
            this.state = EditState.Editing;
            return;
        }
        this.state = EditState.Error;
    }

    static Loading = 'Loading';
    static Reverting = 'Reverting';
    static Editing = 'Editing';
    static Saving = 'Saving';
    static Submitting = 'Submitting';
    static Error = 'Error';
}

class ServerErrorResponse {
    constructor(readonly error?: any) {
    }

    static NoError = new ServerErrorResponse();
}

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

    private isFirstTimeHere: boolean = false;             //flag indicating submission has just been created through the UI
    private editState: EditState = new EditState();
    private unsubscribe: Subject<void> = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private submService: SubmissionService,
                private locService: Location,
                private modalService: BsModalService,
                private appConfig: AppConfig,
                private userData: UserData,
                private changeRef: ChangeDetectorRef) {

        //Initally collapses the sidebar for tablet-sized screens if applicable
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;
    }

    get location() {
        return window.location;
    }

    get isSubmitting(): boolean {
        return this.editState.isSubmitting;
    }

    get isLoading(): boolean {
        return this.editState.isLoading;
    }

    get isSaving(): boolean {
        return this.editState.isSaving;
    }

    get isReverting(): boolean {
        return this.editState.isReverting;
    }

    ngOnInit(): void {
        this.isFirstTimeHere = this.route.snapshot.data.isNew || false;

        this.route.params.takeUntil(this.unsubscribe).subscribe(params => {
            this.accno = params.accno;
            this.editState.startLoading();
            this.load().subscribe((error) => {
                this.editState.stopLoading(error.error);
            });
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private load(): Observable<ServerErrorResponse> {

        const loadFinished$ = new Subject<ServerErrorResponse>();

        this.submService.getSubmission(this.accno).subscribe(
            wrappedSubm => {
                this.wrappedSubm = wrappedSubm;
                this.subm = pageTab2Submission(this.wrappedSubm.data);
                this.updateCurrentSection(this.subm.section.id);

                if (this.isFirstTimeHere) {
                    this.setDefaults(this.subm.section);
                }
                loadFinished$.next(ServerErrorResponse.NoError);
            },

            error => {
                loadFinished$.next(new ServerErrorResponse(error));
                this.serverError = error;
                this.reset();
            }
        );
        return loadFinished$;
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
            this.onDataChange();
        });
    }

    private asContactAttributes(userInfo: UserInfo): AttributeData[] {
        return [
            {name: 'Name', value: userInfo.username},
            {name: 'E-mail', value: userInfo.email},
            {name: 'ORCID', value: userInfo.aux.orcid}
        ];
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    get isFormValid(): boolean {
        return this.sectionForm === undefined || this.sectionForm.form.valid;
    }

    onSectionClick(section: Section): void {
        this.updateCurrentSection(section.id);
    }

    onRevert(event: Event) {
        this.editState.startReverting();

        this.confirmRevert!.confirm().takeUntil(this.unsubscribe)
            .pipe(
                switchMap(() => this.submService.deleteSubmission(this.accno)),
                switchMap(() => this.load())
            ).subscribe(error => this.editState.stopReverting(error.error));
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
        confirmMsg += '. This operation cannot be undone.';

        this.confirmSectionDel!.confirm(confirmMsg).takeUntil(this.unsubscribe).subscribe(() => {
            this.section!.sections.remove(section);
        });
    }

    onDataChange(event?: Event) {
        if (this.readonly) {
            return;
        }

        this.editState.startSaving();
        this.submService.saveSubmission(this.wrap()).takeUntil(this.unsubscribe).subscribe(
            () => {
                this.editState.stopSaving();

                this.isFirstTimeHere && this.locService.replaceState('/submissions/edit/' + this.accno);

                //A sent submission has been backed up. It follows it's been revised.
                if (!this.subm!.isTemp && !this.subm!.isRevised) {
                    this.subm!.isRevised = true;
                }
            },
            (error) => this.editState.stopSaving(new ServerErrorResponse(error)));

        this.validate();
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
        if (!this.canSubmit() || !this.isFormValid) {
            // this.submForm!.sectionForm!.markAsTouched();
            this.editState.stopSubmitting();

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
            confirmShown.takeUntil(this.unsubscribe).subscribe((isOk: boolean) => {
                if (isOk) {
                    this.submitForm()
                } else {
                    this.editState.stopSubmitting();
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

        this.submService.submitSubmission(wrappedSubm).takeUntil(this.unsubscribe).subscribe(
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

                //TODO !this.isUpdate && this.showSubmitResults(resp);
                this.editState.stopSubmitting()
            },
            (error: ServerError) => {

                //Uses the original error object given by the server
                this.showSubmitResults(error.data.error);

                if (!error.isDataError) {
                    throw error;
                }
                this.editState.stopSubmitting();
            }
        );
    }

    canSubmit() {
        if (this.editState.isSubmitting) {
            return false;
        }
        this.editState.startSubmitting();
        return true;
    }

    onViewLog(event: Event): void {
        const bsModalRef = this.modalService.show(SubmValidationErrorsComponent);
        bsModalRef.content.modalRef = bsModalRef;
        bsModalRef.content.errors = this.errors;
    }

    showSubmitResults(resp: any) {
        let logObj = {level: 'error'};

        this.editState.stopSubmitting();

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
        this.sectionForm.form.valueChanges.pipe(
            throttleTime(500)
        ).subscribe(() => this.onDataChange());
    }

    private validate() {
        setTimeout(() => {
            this.errors = SubmissionValidator.validate(this.subm!);
        }, 10);
    }

    private wrap(isSubmit: boolean = false): any {
        const copy = Object.assign({}, this.wrappedSubm);
        copy.data = submission2PageTab(this.subm!, isSubmit);

        //NOTE: for creation, the accession number remains blank when creating the PageTab object above
        // TODO this.isUpdate = !_.isEmpty(copy.data.accno);
        return copy;
    }
}
