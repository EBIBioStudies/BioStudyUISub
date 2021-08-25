import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import {
  Attribute,
  AttributeData,
  Table,
  Section,
  SubmValidationErrors,
  Submission,
  SubmissionValidator,
  SubmissionType,
  SelectValueType
} from 'app/submission/submission-shared/model';
import { UserData } from 'app/auth/shared';
import { UserInfo } from 'app/auth/shared/model';
import { isDefinedAndNotEmpty } from 'app/utils';
import { SubmissionToExtSubmissionService } from 'app/submission/submission-transform/submission-to-ext-submission.service';
import { ExtSubmissionToSubmissionService } from 'app/submission/submission-transform/ext-submission-to-submission.service';
import { flatTables } from 'app/submission/submission-transform/utils/table.utils';
import { ExtSubmission } from 'app/submission/submission-transform/model/ext-submission-types';
import { SubmissionService, SubmitResponse } from '../../submission-shared/submission.service';
import { SectionForm } from './model/section-form.model';
import { StructureChangeEvent } from './structure-change-event';

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
    private submissionToExtSubmissionService: SubmissionToExtSubmissionService,
    private extSubmissionToSubmissionService: ExtSubmissionToSubmissionService
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

  loadSubmission(accno: string, setDefaults?: boolean): Observable<ExtSubmission> {
    this.editState.startLoading();

    return this.submService.getSubmission(accno).pipe(
      map((draftSubm) => {
        this.editState.stopLoading();
        this.createForm(draftSubm, accno, setDefaults);

        return draftSubm;
      }),
      catchError((error) => {
        this.editState.stopLoading(error);

        throw error;
      })
    );
  }

  reset(): void {
    this.accno = '';
    this.editState.reset();
    this.sectionSwitch$.next(null);
    this.submModel = new Submission(SubmissionType.defaultType());
  }

  revert(): Observable<ExtSubmission> {
    this.editState.startReverting();

    return this.submService.deleteDraft(this.accno).pipe(
      switchMap(() => this.submService.getSubmission(this.accno)),
      map((draftSubm) => {
        this.editState.stopReverting();
        this.createForm(draftSubm, this.accno);

        return draftSubm;
      }),
      catchError((error) => {
        this.editState.stopReverting(error);

        throw error;
      })
    );
  }

  submit(): Observable<SubmitResponse> {
    this.editState.startSubmitting();

    return this.submService.submitDraft(this.accno).pipe(
      map((resp) => {
        this.editState.stopSubmitting();
        this.onSubmitFinished(resp);
        return resp;
      }),
      catchError((error) => {
        this.editState.stopSubmitting(error);
        this.onErrorResponse(error);

        throw error;
      })
    );
  }

  switchSection(sectionForm: SectionForm): void {
    const nextSectionForm: SectionForm = new SectionForm(
      this.submService,
      this.accno,
      sectionForm.section,
      sectionForm.parent
    );

    if (this.sectionFormSub) {
      this.sectionFormSub.unsubscribe();
      this.sectionFormSub = undefined;
    }

    if (this.sectionFormSubEdit) {
      this.sectionFormSubEdit.unsubscribe();
      this.sectionFormSubEdit = undefined;
    }

    this.subscribeToFormChanges(nextSectionForm);
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

  private toExtended(isSubmit: boolean = false): ExtSubmission {
    return this.submissionToExtSubmissionService.submissionToExtSubmission(this.submModel, isSubmit);
  }

  private createForm(draftSubm: ExtSubmission, accno: string = '', setDefaults: boolean = false): void {
    this.submModel = this.extSubmissionToSubmissionService.extSubmissionToSubmission(draftSubm);

    if (accno.length !== 0) {
      this.accno = accno;
    } else {
      this.accno = draftSubm.accNo!;
    }

    if (setDefaults) {
      this.setDefaults(this.submModel.section);
    }

    this.switchSection(new SectionForm(this.submService, this.accno, this.submModel.section));
  }

  private onErrorResponse(error: any): void {
    if (error !== undefined) {
      this.serverError$.next(error);
    }
  }

  private onSaveFinished(): void {
    if (this.submModel === undefined) {
      return;
    }

    // TODO: re-implement 'revised' table
    // A sent submission has been backed up. It follows it's been revised.
    if (!this.submModel.isTemp && !this.submModel.isRevised) {
      this.submModel.isRevised = true;
    }
  }

  private onSubmitFinished(resp: any): void {
    if (this.submModel.isTemp && (resp.mapping || []).length > 0) {
      this.accno = resp.mapping[0].assigned;
      this.submModel.accno = this.accno;
    }
  }

  private save(): void {
    this.editState.startSaving();
    this.submService.saveDraftSubmission(this.accno, this.toExtended()).subscribe(
      () => {
        this.onSaveFinished();
        this.editState.stopSaving();
      },
      (error) => {
        this.editState.stopSaving(error);

        throw error;
      }
    );
  }

  /* TODO: set defaults when submission object is created and not yet sent to the server (NOT HERE!!!)*/
  private setDefaults(section: Section): void {
    const subscr = this.userData.info$.subscribe((info) => {
      const contactTable = section.tables.find('Contact', 'typeName');

      if (contactTable) {
        contactTable.add(this.asContactAttributes(info), 0);
      }

      setTimeout(() => subscr.unsubscribe(), 10);

      this.save();
    });
  }

  private subscribeToFormChanges(sectionForm: SectionForm): void {
    const updateDelayInMilliseconds = 500;

    sectionForm.structureChanges$.pipe(debounceTime(updateDelayInMilliseconds)).subscribe((value) => {
      if (value !== StructureChangeEvent.init) {
        this.editState.startEditing();
        this.save();
      }
    });

    sectionForm.form.statusChanges.pipe(debounceTime(updateDelayInMilliseconds)).subscribe(() => {
      if (sectionForm.form.dirty) {
        this.editState.startEditing();
        this.save();
      }
    });
  }

  private updateDependencyValues(sectionForm: SectionForm): void {
    const section: Section = this.submModel.section;
    const tables: Table[] = flatTables(section);
    const tablesWithDependencies: Table[] = tables.filter((table) => isDefinedAndNotEmpty(table.dependency));

    tablesWithDependencies.forEach((tableWithDependency) => {
      const dependency = tables.find((table) => table.type.typeName === tableWithDependency.dependency);
      const columnWithDependencies = tableWithDependency.columns.filter((column) =>
        isDefinedAndNotEmpty(column.dependencyColumn)
      );

      columnWithDependencies.forEach((columnWithDependency) => {
        // tslint:disable-next-line: no-non-null-assertion
        const matchedColumn = dependency!.columns.find(
          (column) => column.name === columnWithDependency.dependencyColumn
        );
        // tslint:disable-next-line: no-non-null-assertion
        const attributeValues = dependency!.attributeValuesForColumn(matchedColumn!.id);
        // tslint:disable-next-line: no-non-null-assertion
        const rawValues: string[] = attributeValues.map((attributeValue) => attributeValue!.value);
        const selectValueType = columnWithDependency.valueType as SelectValueType;

        selectValueType.setValues(rawValues);

        this.validateDependenciesForColumn(rawValues, tableWithDependency, sectionForm, columnWithDependency);
      });
    });
  }

  private validateDependenciesForColumn(
    values: string[],
    table: Table,
    sectionForm: SectionForm,
    column?: Attribute
  ): void {
    if (column) {
      const attributeValues = table.attributeValuesForColumn(column.id);

      attributeValues.forEach((attribute, index) => {
        if (isDefinedAndNotEmpty(attribute!.value) && !values.includes(attribute!.value)) {
          const formControl = sectionForm.getTableFormById(table.id);

          if (formControl) {
            formControl.removeRow(index);
          }
        }
      });
    }
  }
}
