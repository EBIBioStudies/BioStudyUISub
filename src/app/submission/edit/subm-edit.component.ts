import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {BsModalService} from 'ngx-bootstrap';

import {
    AttributeData,
    findReleaseDate,
    pageTab2Submission,
    Section,
    Submission,
    submission2PageTab
} from '../shared/model';
import {PendingSubmission, SubmissionService} from '../shared/submission.service';
import {ServerError} from '../../http/server-error.handler';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {AppConfig} from '../../app.config';
import {UserData} from '../../auth/user-data';
import {SubmValidationErrorsComponent} from './subm-navbar/subm-validation-errors.component';
import {SubmSidebarComponent} from './subm-sidebar/subm-sidebar.component';
import {Subject} from 'rxjs/Subject';
import {Observable, of, Subscription} from 'rxjs';
import {SectionForm} from './section-form';
import {UserInfo} from '../../auth/model/user-info';
import {catchError, filter, map, switchMap, throttleTime} from 'rxjs/operators';

class EditState {
    private state: string;

    constructor() {
        this.state = EditState.Loading;
    }

    startLoading() {
        this.state = EditState.Loading;
    }

    stopLoading(error?: any) {
        this.backToEditing(error);
    }

    startReverting() {
        this.state = EditState.Reverting;
    }

    stopReverting(error?: any) {
        this.backToEditing(error);
    }

    startSaving() {
        this.state = EditState.Saving;
    }

    stopSaving(error?: any) {
        this.backToEditing(error);
    }

    startSubmitting() {
        this.state = EditState.Submitting;
    }

    stopSubmitting(error?: any) {
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

    private backToEditing(error: any) {
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

class ServerResponse<T> {
    constructor(readonly payload?: T, readonly error?: any) {
    }

    get isError(): boolean {
        return this.error !== undefined;
    }

    static NoError = <T>(payload: T) => new ServerResponse<T>(payload, undefined);
    static Error = (error: any) => new ServerResponse<any>(undefined, error);
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
    submWrap?: PendingSubmission;
    sectionForm?: SectionForm;

    sideBarCollapsed: boolean = false;

    accno: string = '';
    releaseDate: string = '';
    serverError?: ServerError;

    submitOperation: SubmitOperation = SubmitOperation.Unknown;

    private hasJustCreated: boolean = false;             //flag indicating submission has just been created through the UI
    private editState: EditState = new EditState();

    private unsubscribe: Subject<void> = new Subject<void>();
    private sectionFormSub?: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private submService: SubmissionService,
                private locService: Location,
                private modalService: BsModalService,
                private appConfig: AppConfig,
                private userData: UserData) {

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

        this.route.params.takeUntil(this.unsubscribe).pipe(
            switchMap(params => {
                this.editState.startLoading();
                return this.load(params.accno);
            })).subscribe(resp => {
            this.editState.stopLoading(resp.error);
            this.onLoadFinished(resp);
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onSectionClick(sectionForm: SectionForm): void {
        this.switchSection(sectionForm);
    }

    onRevertClick(event: Event) {
        this.revert();
    }

    onSubmitClick(event, isConfirm: boolean = false) {
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

    onEditBackClick(event: Event) {
        this.readonly = false;
        this.subm!.isRevised = false;
        this.router.navigate(['/submissions/edit/' + this.accno]);
    }

    onSectionDeleteClick(section: Section): void {
        let confirmMsg: string = `You are about to permanently delete the page named "${section.typeName}"`;

        if (section.accno) {
            confirmMsg += ` with accession number ${section.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.';

        this.confirmSectionDel!.confirm(confirmMsg).takeUntil(this.unsubscribe).subscribe(() => {
            // todo this.sectionForm!.removeSection(section);
        });
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
        return this.sectionForm !== undefined && this.sectionForm.form.valid;
    }

    private load(accno: string): Observable<ServerResponse<PendingSubmission>> {
        return this.submService.getSubmission(accno).pipe(
            switchMap(submWrap => {
                return of(ServerResponse.NoError(submWrap));
            }),
            catchError(error => {
                return of(ServerResponse.Error(error));
            }));
    }

    private onLoadFinished(resp: ServerResponse<PendingSubmission>) {
        if (resp.isError) {
            this.onErrorResponse(resp.error);
            return;
        }

        this.submWrap = resp.payload!;
        this.subm = pageTab2Submission(this.submWrap.data);
        this.switchSection(new SectionForm(this.subm.section));

        if (this.hasJustCreated) {
            this.setDefaults(this.subm.section);
        }
    }

    private onErrorResponse(error: any) {
        this.serverError = error;
    }

    private revert() {
        this.editState.startReverting();

        this.confirmRevert!.confirm().takeUntil(this.unsubscribe)
            .pipe(
                switchMap(() => this.submService.deleteSubmission(this.accno)), // delete pending submission
                switchMap(() => this.load(this.accno)) // and load original
            ).subscribe(resp => {
            this.editState.stopReverting(resp.error);
            this.onLoadFinished(resp);
        });
    }

    private save() {
        this.editState.startSaving();

        this.submService.saveSubmission(this.wrap()).takeUntil(this.unsubscribe)
            .pipe(
                map(resp => ServerResponse.NoError<any>(resp)),
                catchError(error => of(ServerResponse.Error(error))))
            .subscribe(resp => {
                this.editState.stopSaving(resp.error);
                this.onSaveFinished(resp);
            });
    }

    private onSaveFinished(resp: ServerResponse<any>) {
        if (resp.isError) {
            this.onErrorResponse(resp.error);
            return;
        }
        this.hasJustCreated && this.locService.replaceState('/submissions/edit/' + this.accno);

        //A sent submission has been backed up. It follows it's been revised.
        if (!this.subm!.isTemp && !this.subm!.isRevised) {
            this.subm!.isRevised = true;
        }
    }

    private submit() {
        const wrap = this.wrap(true);

        this.submService.submitSubmission(wrap).takeUntil(this.unsubscribe)
            .pipe(
                map(resp => ServerResponse.NoError<any>(resp)),
                catchError(error => of(ServerResponse.Error(error))))
            .subscribe(
            resp => {
                this.editState.stopSubmitting(resp.error);
                this.onSubmitFinished(resp, wrap);
            }
        );
    }

    // todo: add proper type for submit response
    private onSubmitFinished(resp:ServerResponse<any>, wrap: PendingSubmission) {
        if (resp.isError) {
            this.onErrorResponse(resp.error);
            return;
        }

        if (resp.payload.data.error) {
            this.showSubmitResults(resp.payload.data.error);
            return;
        }

        const isNewSubmission = this.subm!.isTemp;

        this.releaseDate = findReleaseDate(wrap.data) || '';

        if (this.subm!.isTemp) {
            this.accno = resp.payload.mapping[0].assigned;
            this.subm!.accno = this.accno;
        }

        this.locService.replaceState('/submissions/' + this.accno);
        this.readonly = true;

        this.submitOperation = isNewSubmission ? SubmitOperation.Create : SubmitOperation.Update;
        this.submitOperation.isCreate && this.showSubmitResults(resp);

        //Flushes all updates synchronously so that the scroll reset happens exactly after them.
        //this.changeRef.detectChanges();
        window.scrollTo(0, 0);
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

    private switchSection(sectionForm: SectionForm) {
        this.unsubscribe.next();

        if (this.sectionFormSub !== undefined) {
            this.sectionFormSub.unsubscribe();
            this.sectionFormSub = undefined;
        }
        this.sectionForm = sectionForm;
        this.sectionFormSub = this.sectionForm.form.valueChanges.pipe(throttleTime(900))
            .subscribe(() => this.onDataChange());
    }

    private wrap(isSubmit: boolean = false): any {
        const copy = Object.assign({}, this.submWrap);
        copy.data = submission2PageTab(this.subm!, isSubmit);
        return copy;
    }
}
