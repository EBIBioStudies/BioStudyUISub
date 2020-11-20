import { Observable, of, Subject, Subscription, merge, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { none, Option, some } from 'fp-ts/lib/Option';
import {
  Attribute,
  AttributeData,
  Feature,
  Section,
  SubmValidationErrors,
  Submission,
  SubmissionValidator
} from 'app/pages/submission/submission-shared/model';
import { SubmissionType } from 'app/pages/submission/submission-shared/model/templates/submission-type.model';
import { UserData } from 'app/auth/shared';
import { UserInfo } from 'app/auth/shared/model';
import { PageTab, SelectValueType } from 'app/pages/submission/submission-shared/model';
import { PageTabToSubmissionService } from 'app/pages/submission/submission-shared/pagetab-to-submission.service';
import { SubmissionToPageTabService } from 'app/pages/submission/submission-shared/submission-to-pagetab.service';
import { isDefinedAndNotEmpty } from 'app/utils';
import { SubmissionService, SubmitResponse } from '../../submission-shared/submission.service';
import { SectionForm } from './model/section-form.model';
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

  reset(): void {
    this.state = EditState.INIT;
  }

  startEditing(): void {
    this.editState = EditState.EDITING;
  }

  startLoading(): void {
    this.state = EditState.LOADING;
  }

  startReverting(): void {
    this.state = EditState.REVERTING;
  }

  startSaving(): void {
    this.state = EditState.SAVING;
  }

  startSubmitting(): void {
    this.state = EditState.SUBMITTING;
  }

  stopLoading(error?: any): void {
    this.backToEditing(error);
  }

  stopReverting(error?: any): void {
    this.backToEditing(error);
    this.editState = EditState.INIT;
  }

  stopSaving(error?: any): void {
    this.backToEditing(error);
  }

  stopSubmitting(error?: any): void {
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

  private backToEditing(error: any): void {
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
  readonly sectionSwitch$: BehaviorSubject<SectionForm | null> = new BehaviorSubject<SectionForm | null>(null);
  readonly serverError$: Subject<any> = new Subject<any>();

  private accno: string = '';
  private editState: EditState = new EditState();
  private sectionFormSub?: Subscription;
  private sectionFormSubEdit?: Subscription;
  private submModel: Submission = new Submission(SubmissionType.defaultType());

  constructor(
    private userData: UserData,
    private submService: SubmissionService,
    private submToPageTabService: SubmissionToPageTabService,
    private pageTabToSubmService: PageTabToSubmissionService,
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

  get isTemp(): boolean {
    return this.submModel ? this.submModel.isTemp : false;
  }

  get isRevised(): boolean {
    return this.submModel ? this.submModel.isRevised : false;
  }

  loadSubmission(accno: string, setDefaults?: boolean): Observable<ServerResponse<any>> {
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

  reset(): void {
    this.accno = '';
    this.editState.reset();
    this.sectionSwitch$.next(null);
    this.submModel = new Submission(SubmissionType.defaultType());
  }

  revert(): Observable<ServerResponse<any>> {
    this.editState.startReverting();

    return this.submService.deleteDraft(this.accno).pipe(
      switchMap(() => this.submService.getSubmission(this.accno)),
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

  switchSection(sectionForm: SectionForm): void {
    const nextSectionForm: SectionForm = new SectionForm(sectionForm.section, sectionForm.parent);

    if (this.sectionFormSub) {
      this.sectionFormSub.unsubscribe();
      this.sectionFormSub = undefined;
    }

    if (this.sectionFormSubEdit) {
      this.sectionFormSubEdit.unsubscribe();
      this.sectionFormSubEdit = undefined;
    }

    merge(
      nextSectionForm.structureChanges$,
      nextSectionForm.form.statusChanges
    )
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.editState.startEditing();
        this.save();
      });

    this.updateDependencyValues(nextSectionForm);
    this.sectionSwitch$.next(nextSectionForm);
  }

  validateSubmission(): SubmValidationErrors {
    return SubmissionValidator.validate(this.submModel);
  }

  private asContactAttributes(userInfo: UserInfo): AttributeData[] {
    return [
      { name: 'Name', value: userInfo.username },
      { name: 'E-mail', value: userInfo.email },
      { name: 'ORCID', value: userInfo.aux.orcid }
    ];
  }

  private asPageTab(isSubmit: boolean = false): PageTab {
    return this.submToPageTabService.submissionToPageTab(this.submModel, isSubmit);
  }

  private createForm(draftSubm: PageTab, accno: string = '', setDefaults: boolean = false): void {
    this.submModel = this.pageTabToSubmService.pageTab2Submission(draftSubm);

    if (accno.length !== 0) {
      this.accno = accno;
    } else {
      this.accno = draftSubm.accno!;
    }

    if (setDefaults) {
      this.setDefaults(this.submModel.section);
    }

    this.switchSection(new SectionForm(this.submModel.section));
  }

  private onErrorResponse(error: any): void {
    if (error !== undefined) {
      this.serverError$.next(error);
    }
  }

  private onSaveFinished(resp: ServerResponse<any>): void {
    if (resp.isError) {
      return;
    }
    if (this.submModel === undefined) {
      return;
    }
    // TODO: re-implement 'revised' feature
    // A sent submission has been backed up. It follows it's been revised.
    if (!this.submModel.isTemp && !this.submModel.isRevised) {
      this.submModel.isRevised = true;
    }
  }

  private onSubmitFinished(resp: any): void {
    if (this.submModel.isTemp && ((resp.mapping || []).length > 0)) {
      this.accno = resp.mapping[0].assigned;
      this.submModel.accno = this.accno;
    }
  }

  private save(): void {
    this.editState.startSaving();
    this.submService.saveDraftSubmission(this.accno, this.asPageTab())
      .pipe(
        map((resp) => ServerResponse.OK(resp)),
        catchError((error) => of(ServerResponse.ERROR(error))))
      .subscribe((resp) => {
        this.onSaveFinished(resp);
        this.editState.stopSaving();
      }, (error) => {
        this.editState.stopSaving(error);
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

  private updateDependencyValues(sectionForm: SectionForm): void {
    const section: Section = this.submModel.section;
    const features: Feature[] = flatFeatures(section);
    const featuresWithDependencies: Feature[] = features.filter((feature) => isDefinedAndNotEmpty(feature.dependency));

    featuresWithDependencies.forEach((featureWithDependency) => {
      const dependency = features.find((feature) => feature.type.typeName === featureWithDependency.dependency);
      const columnWithDependencies = featureWithDependency.columns
        .filter((column) => isDefinedAndNotEmpty(column.dependencyColumn));

      columnWithDependencies.forEach((columnWithDependency) => {
        // tslint:disable-next-line: no-non-null-assertion
        const matchedColumn = dependency!.columns.find((column) => column.name === columnWithDependency.dependencyColumn);
        // tslint:disable-next-line: no-non-null-assertion
        const attributeValues = dependency!.attributeValuesForColumn(matchedColumn!.id);
        // tslint:disable-next-line: no-non-null-assertion
        const rawValues: string[] = attributeValues.map((attributeValue) => attributeValue!.value);
        const selectValueType = (columnWithDependency.valueType) as SelectValueType;

        selectValueType.setValues(rawValues);

        this.validateDependenciesForColumn(rawValues, featureWithDependency, sectionForm, columnWithDependency);
      });
    });
  }

  private validateDependenciesForColumn(values: string[], feature: Feature, sectionForm: SectionForm, column?: Attribute): void {
    if (column) {
      const attributeValues = feature.attributeValuesForColumn(column.id);

      attributeValues.forEach((attribute, index) => {
        if (isDefinedAndNotEmpty(attribute!.value) && !values.includes(attribute!.value)) {
          const formControl = sectionForm.getFeatureFormById(feature.id);

          if (formControl) {
            formControl.removeRow(index);
          }
        }
      });
    }
  }
}
