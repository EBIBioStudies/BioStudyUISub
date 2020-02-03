import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { none, Option, some } from 'fp-ts/lib/Option';
import { Submission, AttributeData, Section, Feature, Attribute } from 'app/pages/submission/submission-shared/model';
import { UserData } from 'app/auth/shared';
import { UserInfo } from 'app/auth/shared/model';
import { pageTab2Submission, PageTab, submission2PageTab, SelectValueType } from 'app/pages/submission/submission-shared/model';
import { SubmissionService, SubmitResponse } from '../../submission-shared/submission.service';
import { SectionForm } from './model/section-form.model';
import { CustomFormControl } from './model/custom-form-control.model';
import { flatFeatures } from '../../utils';

class EditState {
  static EDITING = 'Editing';
  static ERROR = 'Error';
  static INIT = 'Init';
  static LOADING = 'Loading';
  static REVERTING = 'Reverting';
  static SAVING = 'Saving';
  static SUBMITTING = 'Submitting';

  private editState: string;
  private state: string;

  constructor() {
    this.state = EditState.INIT;
    this.editState = EditState.INIT;
  }

  reset() {
    this.state = EditState.INIT;
  }

  startEditing() {
    this.editState = EditState.EDITING;
  }

  startLoading() {
    this.state = EditState.LOADING;
  }

  startReverting() {
    this.state = EditState.REVERTING;
  }

  startSaving() {
    this.state = EditState.SAVING;
  }

  startSubmitting() {
    this.state = EditState.SUBMITTING;
  }

  stopLoading(error?: any) {
    this.backToEditing(error);
  }

  stopReverting(error?: any) {
    this.backToEditing(error);
    this.editState = EditState.INIT;
  }

  stopSaving(error?: any) {
    this.backToEditing(error);
  }

  stopSubmitting(error?: any) {
    this.backToEditing(error);
    this.editState = EditState.INIT;
  }

  get isSubmitting(): boolean {
    return this.state === EditState.SUBMITTING;
  }

  get isLoading(): boolean {
    return this.state === EditState.LOADING;
  }

  get isSaving(): boolean {
    return this.state === EditState.SAVING;
  }

  get isReverting(): boolean {
    return this.state === EditState.REVERTING;
  }

  get isEditing(): boolean {
    return this.editState === EditState.EDITING;
  }

  private backToEditing(error: any) {
    if (error === undefined) {
      this.state = EditState.EDITING;
      return;
    }
    this.state = EditState.ERROR;
  }
}

export class ServerResponse<T> {
  private constructor(readonly payload: Option<T>, readonly error: Option<any>) {}

  static ERROR = (error: any) => {
    return new ServerResponse(none, some(error));
  }

  static OK = <T>(payload: T) => new ServerResponse<T>(some(payload), none);

  get isError(): boolean {
    return this.error.isSome();
  }
}

@Injectable()
export class SubmEditService {
  readonly scroll2Control$: Subject<FormControl> = new Subject<FormControl>();
  readonly sectionSwitch$: BehaviorSubject<Option<SectionForm>> = new BehaviorSubject<Option<SectionForm>>(none);
  readonly serverError$: Subject<any> = new Subject<any>();

  private accno?: string;
  private editState: EditState = new EditState();
  private sectionFormSub?: Subscription;
  private sectionFormSubEdit?: Subscription;
  private submModel?: Submission;

  constructor(
    private userData: UserData,
    private submService: SubmissionService
  ) {}

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

  load(accno: string, setDefaults?: boolean): Observable<ServerResponse<any>> {
    this.editState.startLoading();

    return this.submService.getSubmission(accno).pipe(
      map(draftSubm => {
        this.editState.stopLoading();
        this.createForm(draftSubm, accno, setDefaults);
        const projectAttribute =
          draftSubm &&
          draftSubm.attributes &&
          draftSubm.attributes
            .filter(att => att.name && att.name.toLowerCase() === 'attachto')
            .shift();

        return ServerResponse.OK(projectAttribute);
      }),
      catchError(error => {
        this.editState.stopLoading(error);

        return of(ServerResponse.ERROR(error));
      })
    );
  }

  reset() {
    this.editState.reset();
    this.switchSection(undefined);
    this.submModel = undefined;
    this.accno = undefined;
  }

  revert(): Observable<ServerResponse<any>> {
    this.editState.startReverting();

    return this.submService.deleteDraft(this.accno!).pipe(
      switchMap(() => this.submService.getSubmission(this.accno!)),
      map((draftSubm) => {
        this.editState.stopReverting();
        this.createForm(draftSubm, this.accno);
        return ServerResponse.OK({});
      }),
      catchError(error => {
        this.editState.stopReverting(error);
        return of(ServerResponse.ERROR(error));
      }));
  }

  scrollToControl(ctrl: CustomFormControl) {
    this.switchSectionById(ctrl.ref.sectionId);
    this.scroll2Control$.next(ctrl);
  }

  submit(): Observable<SubmitResponse> {
    this.editState.startSubmitting();
    const pageTab = this.asPageTab(true);

    return this.submService.submitSubmission(pageTab).pipe(
      map((resp) => {
        this.editState.stopSubmitting();
        this.onSubmitFinished(resp);
        return resp;
      }),
      catchError((error) => {
        this.editState.stopSubmitting(error);
        this.onErrorResponse(error);

        throw error;
      }));
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
      sectionForm.form.valueChanges
        .pipe(debounceTime(500))
        .subscribe(() => {
          const dirty: boolean = sectionForm.form.dirty;

          if (dirty) {
            this.editState.startEditing();
            this.save();
          }
        });

      this.updateDependencyValues(sectionForm);
      this.sectionSwitch$.next(some(sectionForm));
    } else {
      this.sectionSwitch$.next(none);
    }
  }

  switchSectionById(sectionId: string) {
    this.switchSection(this.sectionSwitch$.value.map(sf => sf.findSectionForm(sectionId)).toUndefined());
  }

  private asContactAttributes(userInfo: UserInfo): AttributeData[] {
    return [
      { name: 'Name', value: userInfo.username },
      { name: 'E-mail', value: userInfo.email },
      { name: 'ORCID', value: userInfo.aux.orcid }
    ];
  }

  private asPageTab(isSubmit: boolean = false): PageTab {
    return submission2PageTab(this.submModel!, isSubmit);
  }

  private createForm(draftSubm: PageTab, accno: string = '', setDefaults: boolean = false) {
    this.submModel = pageTab2Submission(draftSubm);

    if (accno.length !== 0) {
      this.accno = accno;
    } else {
      this.accno = draftSubm.accno;
    }

    if (setDefaults) {
      this.setDefaults(this.submModel.section);
    }

    this.switchSection(new SectionForm(this.submModel.section));
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

  private save() {
    this.editState.startSaving();
    this.submService.saveDraftSubmission(this.accno!!, this.asPageTab())
      .pipe(
        map(resp => ServerResponse.OK(resp)),
        catchError(error => of(ServerResponse.ERROR(error))))
      .subscribe(resp => {
        this.editState.stopSaving(resp.error);
        this.onSaveFinished(resp);
      });
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
}
