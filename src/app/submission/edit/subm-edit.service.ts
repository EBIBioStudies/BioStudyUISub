import {Injectable} from '@angular/core';
import {AttributeData, Section, Submission} from '../shared/model/submission';
import {PendingSubmission, SubmissionService} from '../shared/submission.service';
import {SectionForm} from './section-form';
import {catchError, map, switchMap, throttleTime} from 'rxjs/operators';
import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {pageTab2Submission, submission2PageTab} from '../shared/model';
import {UserInfo} from '../../auth/model/user-info';
import {none, Option, some} from 'fp-ts/lib/Option';
import {UserData} from '../../auth';
import {FormControl} from '@angular/forms';
import {MyFormControl} from './form-validators';


class EditState {
    private state: string;

    constructor() {
        this.state = EditState.Init;
    }

    reset() {
        this.state = EditState.Init;
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
        if (error === undefined) {
            this.state = EditState.Editing;
            return;
        }
        this.state = EditState.Error;
    }

    static Init = 'Init';
    static Loading = 'Loading';
    static Reverting = 'Reverting';
    static Editing = 'Editing';
    static Saving = 'Saving';
    static Submitting = 'Submitting';
    static Error = 'Error';
}

class ServerResponse<T> {
    private constructor(readonly payload: T, readonly error?: any) {
    }

    get isError(): boolean {
        return this.error !== undefined;
    }

    static Error = (error: any) => {
        return new ServerResponse(undefined, error)
    };
    static Ok = <T>(payload: T) => new ServerResponse<T>(payload, undefined);
}

@Injectable()
export class SubmEditService {
    private submModel?: Submission;
    private submWrap?: PendingSubmission;
    private accno?: string;

    private editState: EditState = new EditState();
    private sectionFormSub?: Subscription;

    sectionSwitch$: BehaviorSubject<Option<SectionForm>> = new BehaviorSubject<Option<SectionForm>>(none);
    serverError$: Subject<any> = new Subject<any>();
    scroll2Control$: Subject<FormControl> = new Subject<FormControl>();

    constructor(private userData: UserData,
                private submService: SubmissionService) {
    };

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

    get isTemp() {
        return this.submModel!.isTemp;
    }

    get isRevised() {
        return this.submModel!.isRevised;
    }

    scrollToControl(ctrl: MyFormControl) {
        this.switchSectionById(ctrl.ref.sectionId);
        this.scroll2Control$.next(ctrl);
    }

    load(accno: string, setDefaults?: boolean): Observable<ServerResponse<any>> {
        this.editState.startLoading();
        return this.submService.getSubmission(accno).pipe(
            map(pendingSubm => {
                this.editState.stopLoading();
                this.createForm(pendingSubm, setDefaults);
                return ServerResponse.Ok({});
            }),
            catchError(error => {
                this.editState.stopLoading(error);
                return of(ServerResponse.Error(error));
            }));
    }

    revert(): Observable<ServerResponse<any>> {
        this.editState.startReverting();
        return this.submService.deleteSubmission(this.accno).pipe(
            switchMap(() => this.submService.getSubmission(this.accno!)),
            map(pendingSubm => {
                this.editState.stopReverting();
                this.createForm(pendingSubm);
                return ServerResponse.Ok({});
            }),
            catchError(error => {
                this.editState.stopReverting(error);
                return of(ServerResponse.Error(error));
            }));
    }

    submit(): Observable<ServerResponse<any>> {
        this.editState.startSubmitting();
        const wrap = this.wrap(true);
        return this.submService.submitSubmission(wrap).pipe(
            map(resp => {
                this.editState.stopSubmitting();
                this.onSubmitFinished(resp);
                return ServerResponse.Ok(resp);
            }),
            catchError(error => {
                this.editState.stopSubmitting(error);
                this.onErrorResponse(error);
                return of(ServerResponse.Error(error))
            }));
    }

    reset() {
        this.editState.reset();
        this.switchSection(undefined);
        this.submModel = undefined;
        this.submWrap = undefined;
        this.accno = undefined;
    }

    switchSectionById(sectionId: string) {
        this.switchSection(
            this.sectionSwitch$.value.map(sf =>
                sf.findSectionForm(sectionId)
            ).toUndefined());
    }

    switchSection(sectionForm: SectionForm | undefined) {
        if (this.sectionSwitch$.value.toUndefined() === sectionForm) {
            return;
        }

        if (this.sectionFormSub) {
            this.sectionFormSub.unsubscribe();
            this.sectionFormSub = undefined;
        }

        if (sectionForm !== undefined) {
            this.sectionFormSub = sectionForm.form.valueChanges.pipe(throttleTime(900))
                .subscribe(() => this.save());
            this.sectionSwitch$.next(some(sectionForm));
        } else {
            this.sectionSwitch$.next(none);
        }
    }

    private save() {
        this.editState.startSaving();
        this.submService.saveSubmission(this.wrap())
            .pipe(
                map(resp => ServerResponse.Ok(resp)),
                catchError(error => of(ServerResponse.Error(error))))
            .subscribe(resp => {
                this.editState.stopSaving(resp.error);
                this.onSaveFinished(resp);
            });
    }

    private createForm(pendingSubm: PendingSubmission, setDefaults: boolean = false) {
        this.submWrap = pendingSubm;
        this.accno = this.submWrap.accno;
        this.submModel = pageTab2Submission(this.submWrap.data);

        if (setDefaults) {
            this.setDefaults(this.submModel.section);
        }

        this.switchSection(new SectionForm(this.submModel.section));
    }

    /* TODO: set defaults when submission object is created and not yet sent to the server (NOT HERE!!!)*/
    private setDefaults(section: Section): void {
        const subscr = this.userData.info$.subscribe(info => {
            const contactFeature = section.features.find('Contact', 'typeName');
            if (contactFeature) {
                contactFeature.add(this.asContactAttributes(info), 0);
            }
            setTimeout(() => {
                subscr.unsubscribe()
            }, 10);
            this.save();
        });
    }

    private asContactAttributes(userInfo: UserInfo): AttributeData[] {
        return [
            {name: 'Name', value: userInfo.username},
            {name: 'E-mail', value: userInfo.email},
            {name: 'ORCID', value: userInfo.aux.orcid}
        ];
    }

    private onErrorResponse(error: any) {
        if (error !== undefined) {
            this.serverError$.next(error);
        }
    }

    private onSaveFinished(resp: ServerResponse<any>) {
        if (resp.isError) {
            return;
        }
        if (this.submModel === undefined) {
            return;
        }
        //TODO: re-implement 'revised' feature
        //A sent submission has been backed up. It follows it's been revised.
        if (!this.submModel!.isTemp && !this.submModel!.isRevised) {
            this.submModel!.isRevised = true;
        }
    }

    private onSubmitFinished(resp: any) {
        if (this.submModel!.isTemp) {
            this.accno = resp.mapping[0].assigned;
            this.submModel!.accno = this.accno!;
        }
    }

    private wrap(isSubmit: boolean = false): any {
        const copy = Object.assign({}, this.submWrap);
        copy.data = submission2PageTab(this.submModel!, isSubmit);
        return copy;
    }
}