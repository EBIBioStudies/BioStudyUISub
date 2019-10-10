import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserData } from 'app/auth/shared';
import { pageTab2Submission, PageTab, submission2PageTab, SelectValueType } from 'app/submission/submission-shared/model';
import { Submission, AttributeData, Section, Feature, Attribute } from 'app/submission/submission-shared/model';
import { none, Option, some } from 'fp-ts/lib/Option';
import { BehaviorSubject, EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap, skip } from 'rxjs/operators';
import { UserInfo } from '../../../auth/shared/model';
import { SubmissionService, SubmitResponse } from '../../submission-shared/submission.service';
import { MyFormControl } from './form-validators';
import { SectionForm } from './section-form';
import { flatFeatures } from '../../utils';

class EditState {
    static Init = 'Init';
    static Loading = 'Loading';
    static Reverting = 'Reverting';
    static Editing = 'Editing';
    static Saving = 'Saving';
    static Submitting = 'Submitting';
    static Error = 'Error';

    private state: string;
    private editState: string;

    constructor() {
        this.state = EditState.Init;
        this.editState = EditState.Init;
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
        this.editState = EditState.Init;
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

    startEditing() {
        this.editState = EditState.Editing;
    }

    stopSubmitting(error?: any) {
        this.backToEditing(error);
        this.editState = EditState.Init;
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

    get isEditing(): boolean {
        return this.editState === EditState.Editing;
    }

    private backToEditing(error: any) {
        if (error === undefined) {
            this.state = EditState.Editing;
            return;
        }
        this.state = EditState.Error;
    }
}

export class ServerResponse<T> {
    static Error = (error: any) => {
        return new ServerResponse(none, some(error));
    }
    static Ok = <T>(payload: T) => new ServerResponse<T>(some(payload), none);

    private constructor(readonly payload: Option<T>, readonly error: Option<any>) {
    }

    get isError(): boolean {
        return this.error.isSome();
    }
}

@Injectable()
export class SubmEditService {
    private submModel?: Submission;
    private accno?: string;

    private editState: EditState = new EditState();
    private sectionFormSub?: Subscription;
    private sectionFormSubEdit?: Subscription;

    readonly sectionSwitch$: BehaviorSubject<Option<SectionForm>> = new BehaviorSubject<Option<SectionForm>>(none);
    readonly serverError$: Subject<any> = new Subject<any>();
    readonly scroll2Control$: Subject<FormControl> = new Subject<FormControl>();

    constructor(private userData: UserData,
                private submService: SubmissionService) {
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

    get isEditing(): boolean {
        return this.editState.isEditing;
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
            map(draftSubm => {
                this.editState.stopLoading();
                this.createForm(draftSubm, setDefaults);
                const projectAttribute =
                    draftSubm &&
                    draftSubm.attributes &&
                    draftSubm.attributes
                        .filter( att => att.name && att.name.toLowerCase() === 'attachto')
                        .shift();

                return ServerResponse.Ok(projectAttribute);
            }),
            catchError(error => {
                this.editState.stopLoading(error);

                return of(ServerResponse.Error(error));
            })
        );
    }

    revert(): Observable<ServerResponse<any>> {
        this.editState.startReverting();
        return this.submService.deleteSubmission(this.accno!).pipe(
            switchMap(() => this.submService.getSubmission(this.accno!)),
            map(draftSubm => {
                this.editState.stopReverting();
                this.createForm(draftSubm);
                return ServerResponse.Ok({});
            }),
            catchError(error => {
                this.editState.stopReverting(error);
                return of(ServerResponse.Error(error));
            }));
    }

    submit(): Observable<SubmitResponse> {
        this.editState.startSubmitting();
        const pageTab = this.asPageTab(true);

        return this.submService.submitSubmission(this.accno!, pageTab).pipe(
            map(resp => {
                this.editState.stopSubmitting();
                this.onSubmitFinished(resp);
                return resp;
            }),
            catchError(error => {
                this.editState.stopSubmitting(error);
                this.onErrorResponse(error);

                return EMPTY;
            }));
    }

    reset() {
        this.editState.reset();
        this.switchSection(undefined);
        this.submModel = undefined;
        this.accno = undefined;
    }

    switchSectionById(sectionId: string) {
        this.switchSection(this.sectionSwitch$.value.map(sf => sf.findSectionForm(sectionId)).toUndefined());
    }

    switchSection(sectionForm: SectionForm | undefined) {
        if (this.sectionSwitch$.value.toUndefined() === sectionForm) {
            return;
        }

        if (this.sectionFormSub) {
            this.sectionFormSub.unsubscribe();
            this.sectionFormSub = undefined;
        }

        if (this.sectionFormSubEdit) {
            this.sectionFormSubEdit.unsubscribe();
            this.sectionFormSubEdit = undefined;
        }

        if (sectionForm !== undefined) {
            this.sectionFormSubEdit = sectionForm.form.valueChanges
                .pipe(skip(1))
                .subscribe(() => {
                    this.editState.startEditing();
                });

            this.sectionFormSub = sectionForm.form.valueChanges
                .pipe(
                    skip(1),
                    debounceTime(900)
                )
                .subscribe(() => this.save());

            this.updateDependencyValues(sectionForm);

            this.sectionSwitch$.next(some(sectionForm));
        } else {
            this.sectionSwitch$.next(none);
        }
    }

    private updateDependencyValues(sectionForm: SectionForm) {
        const section: Section = this.submModel!.section;
        const features: Feature[] = flatFeatures(section);
        const featuresWithDependencies: Feature[] = features.filter((feature) => String.isDefinedAndNotEmpty(feature.dependency));

        featuresWithDependencies.forEach((featureWithDependency) => {
            const dependency = features.find((feature) => feature.type.typeName === featureWithDependency.dependency);
            const columnWithDependencies = featureWithDependency.columns
                .filter((column) => String.isDefinedAndNotEmpty(column.dependencyColumn));

            columnWithDependencies.forEach((columnWithDependency) => {
                const matchedColumn = dependency!.columns.find((column) => column.name === columnWithDependency.dependencyColumn);
                const attributeValues = dependency!.attributeValuesForColumn(matchedColumn!.id);
                const rawValues: string[] = attributeValues.map((attributeValue) => attributeValue!.value);
                const selectValueType = <SelectValueType>(columnWithDependency.valueType);

                selectValueType.setValues(rawValues);

                this.validateDependenciesForColumn(rawValues, featureWithDependency, sectionForm, columnWithDependency);
            });
        });
    }

    private validateDependenciesForColumn(values: string[], feature: Feature, sectionForm: SectionForm, column?: Attribute) {
        if (column) {
            const attributeValues = feature.attributeValuesForColumn(column.id);

            attributeValues.forEach((attribute, index) => {
                if (String.isDefinedAndNotEmpty(attribute!.value) && !values.includes(attribute!.value)) {
                    const formControl = sectionForm.getFeatureFormById(feature.id);

                    if (formControl) {
                        formControl.removeRow(index);
                    }
                }
            });
        }
    }

    private save() {
        this.editState.startSaving();
        this.submService.saveDraftSubmission(this.accno!!, this.asPageTab())
            .pipe(
                map(resp => ServerResponse.Ok(resp)),
                catchError(error => of(ServerResponse.Error(error))))
            .subscribe(resp => {
                this.editState.stopSaving(resp.error);
                this.onSaveFinished(resp);
            });
    }

    private createForm(draftSubm: PageTab, setDefaults: boolean = false) {
        this.accno = draftSubm.accno;
        this.submModel = pageTab2Submission(draftSubm);

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

            setTimeout(() => subscr.unsubscribe(), 10);

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
        // TODO: re-implement 'revised' feature
        // A sent submission has been backed up. It follows it's been revised.
        if (!this.submModel!.isTemp && !this.submModel!.isRevised) {
            this.submModel!.isRevised = true;
        }
    }

    private onSubmitFinished(resp: any) {
        if (this.submModel!.isTemp && ((resp.mapping || []).length > 0)) {
            this.accno = resp.mapping[0].assigned;
            this.submModel!.accno = this.accno!;
        }
    }

    private asPageTab(isSubmit: boolean = false): PageTab {
        return submission2PageTab(this.submModel!, isSubmit);
    }
}
