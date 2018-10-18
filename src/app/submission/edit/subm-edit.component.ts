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
import {SubmSidebarComponent} from './subm-sidebar/subm-sidebar.component';
import {Subject} from 'rxjs/Subject';
import {submission2PageTab} from '../shared/submission-to-pagetab.utils';
import {pageTab2Submission} from '../shared/pagetab-to-submission.utils';
import {Observable, of} from 'rxjs';
import {SectionForm} from './subm-form/section-form';
import {UserInfo} from '../../auth/model/user-info';
import {filter, switchMap} from 'rxjs/operators';
import {findReleaseDate} from '../shared/pagetab.model';

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

class SubmitOperation {
    get isUnknown(): boolean {
        return this === SubmitOperation.Unknown;
    }

    get isCreate(): boolean {
        return this === SubmitOperation.Create;
    }

    get isUpdate(): boolean {
        return this === SubmitOperation.Update;
    }

    static Unknown = new SubmitOperation();
    static Create = new SubmitOperation();
    static Update = new SubmitOperation();
}

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit {
    @Input() readonly: boolean = false;

    @ViewChild(SubmSidebarComponent) sideBar?: SubmSidebarComponent;
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

    errors: SubmValidationErrors = SubmValidationErrors.Empty;
    submitOperation: SubmitOperation = SubmitOperation.Unknown;

    private hasJustCreated: boolean = false;             //flag indicating submission has just been created through the UI
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
        this.hasJustCreated = this.route.snapshot.data.isNew || false;

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

    onSectionClick(section: Section): void {
        this.updateCurrentSection(section.id);
    }

    onRevert(event: Event) {
        this.revert();
    }

    onSubmit(event, isConfirm: boolean = false) {
        if (event) {
            event.preventDefault();
        }

        if (this.isSubmitting) {
            return;
        }

        if (!this.isValid) {
            this.sideBar!.onCheckTabClick();
            return;
        }

        let confirmShown = of(true);
        if (isConfirm) {
            confirmShown = this.confirmSubmit!.confirm(this.confirmSubmit!.body, false);
        }
        confirmShown.takeUntil(this.unsubscribe).pipe(filter(v => v)).subscribe(() => this.submit());
    }

    onEditBack(event: Event) {
        this.readonly = false;
        this.subm!.isRevised = false;
        this.router.navigate(['/submissions/edit/' + this.accno]);
    }

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

    onViewLog(event: Event): void {
        const bsModalRef = this.modalService.show(SubmValidationErrorsComponent);
        bsModalRef.content.modalRef = bsModalRef;
        bsModalRef.content.errors = this.errors;
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
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

    private get isValid(): boolean {
        return this.sectionForm !== undefined && this.sectionForm.form.valid && this.errors.empty();
    }

    private load(): Observable<ServerErrorResponse> {
        const loadFinished$ = new Subject<ServerErrorResponse>();

        this.submService.getSubmission(this.accno).subscribe(
            wrappedSubm => {
                this.wrappedSubm = wrappedSubm;
                this.subm = pageTab2Submission(this.wrappedSubm.data);
                this.updateCurrentSection(this.subm.section.id);

                if (this.hasJustCreated) {
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

    private revert() {
        this.editState.startReverting();

        this.confirmRevert!.confirm().takeUntil(this.unsubscribe)
            .pipe(
                switchMap(() => this.submService.deleteSubmission(this.accno)),
                switchMap(() => this.load())
            ).subscribe(error => this.editState.stopReverting(error.error));
    }

    private save() {
        this.editState.startSaving();
        this.submService.saveSubmission(this.wrap()).takeUntil(this.unsubscribe).subscribe(
            () => {
                this.editState.stopSaving();

                this.hasJustCreated && this.locService.replaceState('/submissions/edit/' + this.accno);

                //A sent submission has been backed up. It follows it's been revised.
                if (!this.subm!.isTemp && !this.subm!.isRevised) {
                    this.subm!.isRevised = true;
                }
            },
            (error) => this.editState.stopSaving(new ServerErrorResponse(error)));

        this.validate();
    }

    private submit() {
        const wrappedSubm = this.wrap(true);
        const isNewSubmission = this.subm!.isTemp;

        this.submService.submitSubmission(wrappedSubm).takeUntil(this.unsubscribe).subscribe(
            resp => {
                this.editState.stopSubmitting();

                this.releaseDate = findReleaseDate(wrappedSubm.data) || '';

                if (this.subm!.isTemp) {
                    this.accno = resp.mapping[0].assigned;
                    this.subm!.accno = this.accno;
                }

                this.locService.replaceState('/submissions/' + this.accno);
                this.readonly = true;

                this.submitOperation = isNewSubmission ? SubmitOperation.Create : SubmitOperation.Update;
                this.submitOperation.isCreate && this.showSubmitResults(resp);

                //Flushes all updates synchronously so that the scroll reset happens exactly after them.
                //this.changeRef.detectChanges();
                window.scrollTo(0, 0);

            },
            (error: ServerError) => {
                this.editState.stopSubmitting(new ServerErrorResponse(error));

                this.showSubmitResults(error.data.error);

                if (!error.isDataError) {
                    throw error;
                }
            }
        );
    }

    private reset() {
        this.subm = undefined;
        this.section = undefined;
        this.errors = SubmValidationErrors.Empty
    }

    /* TODO: set defaults when submission object is created and not yet sent to the server (NOT HERE!!!)*/
    private setDefaults(section: Section): void {
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

    private onDataChange(event?: Event) {
        if (this.readonly) {
            return;
        }
        this.save();
    }

    private updateCurrentSection(sectionId: string) {
        const path: Section[] = this.subm!.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
        this.sectionForm = new SectionForm(this.section);
        this.sectionForm.valueChanges$.subscribe(() => this.onDataChange());
    }

    private validate() {
        setTimeout(() => {
            this.errors = SubmissionValidator.validate(this.subm!);
        }, 10);
    }

    private wrap(isSubmit: boolean = false): any {
        const copy = Object.assign({}, this.wrappedSubm);
        copy.data = submission2PageTab(this.subm!, isSubmit);
        return copy;
    }
}
