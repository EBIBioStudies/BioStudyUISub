import {
  AttributeData,
  Section,
  SubmValidationErrors,
  Submission,
  SubmissionValidator,
  DependencyTypeTable,
  DependencyTypeSection,
  getTemplatesForCollections
} from 'app/submission/submission-shared/model';
import { BehaviorSubject, Observable, Subject, Subscription, throwError } from 'rxjs';
import { PageTab, SelectValueType } from 'app/submission/submission-shared/model';
import { SubmissionService, SubmitResponse } from '../../submission-shared/submission.service';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PageTabSubmission } from 'app/submission/submission-shared/model/pagetab/pagetab.model';
import { PageTabToSubmissionService } from 'app/submission/submission-shared/pagetab-to-submission.service';
import { SectionForm } from './model/section-form.model';
import { StructureChangeEvent } from './structure-change-event';
import { SubmissionToPageTabService } from 'app/submission/submission-shared/submission-to-pagetab.service';
import { SubmissionType } from 'app/submission/submission-shared/model/templates/submission-type.model';
import { UserData } from 'app/auth/shared';
import { UserInfo } from 'app/auth/shared/model';
import { flatTables } from 'app/submission/submission-shared/utils/table.utils';

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
  readonly validationError$: Subject<SubmValidationErrors> = new Subject<SubmValidationErrors>();

  private accno: string = '';
  private editState: EditState = new EditState();
  private sectionFormSub?: Subscription;
  private sectionFormSubEdit?: Subscription;
  private submModel: Submission = new Submission(SubmissionType.defaultType());

  constructor(
    private userData: UserData,
    private submService: SubmissionService,
    private submToPageTabService: SubmissionToPageTabService,
    private pageTabToSubmService: PageTabToSubmissionService
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

  get isRevised(): boolean {
    return this.submModel ? this.submModel.isRevised : false;
  }

  createEmptySubmission(templateName?: string): Observable<string> {
    return this.userData.collections$.pipe(
      switchMap((projectNames) => {
        const templates = getTemplatesForCollections(projectNames);
        const templateInfo = templates.find(
          ({ collection }) => collection?.toLowerCase() === templateName?.toLowerCase()
        );
        if (templateInfo !== undefined) {
          const { name, collection } = templateInfo;
          return this.submService.createDraftSubmission(collection, name);
        }

        throw throwError(
          `Looks like you don't have permissions to see "${templateName}" collection or the study template doesn't exist`
        );
      })
    );
  }

  loadSubmission(accno: string, setDefaults?: boolean): Observable<PageTabSubmission> {
    this.editState.startLoading();

    return this.submService.getSubmission(accno).pipe(
      map((draftSubm) => {
        this.editState.stopLoading();
        this.createForm(draftSubm, accno, setDefaults);

        return new PageTabSubmission(draftSubm);
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

  revert(): Observable<PageTab> {
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

  submit(onlyMetadataUpdate: boolean): Observable<SubmitResponse> {
    this.editState.startSubmitting();

    return this.submService.submitDraft(this.accno, onlyMetadataUpdate).pipe(
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
    this.updateDependencyValues();
    this.sectionSwitch$.next(nextSectionForm);
  }

  validateForm(): void {
    const errors = SubmissionValidator.validate(this.submModel);

    this.validationError$.next(errors);
  }

  private asContactAttributes(userInfo: UserInfo): AttributeData[] {
    return [
      { name: 'Name', value: userInfo.fullname || userInfo.username || '' },
      { name: 'E-mail', value: userInfo.email },
      { name: 'ORCID', value: userInfo.orcid }
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
    this.submService.updateDraft(this.accno, this.asPageTab()).subscribe(
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

    section.fields.list().forEach((field) => {
      if(field.type.defaultValue) {
        field.value = field.type.defaultValue;
      }
    })
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

  private updateDependencyValues(): void {
    const section: Section = this.submModel.section;
    const tables = flatTables(section);

    tables.map((tableWithDependency) => {
      tableWithDependency.type.columnTypes.map((columnType) => {
        if (columnType.dependency) {
          const columnWithDependency = tableWithDependency.findColumnByName(columnType.name)!;
          const columnWithDependencySelect = columnWithDependency.valueType as SelectValueType;
          const rawValues: string[] = [];

          if (columnType.dependency.type === 'table') {
            const dependency = columnType.dependency as DependencyTypeTable;

            const dependencyTable = tables.find((table) => table.type.typeName === dependency.table_name)!;
            const dependencyColumn = dependencyTable.columns.find((column) => column.name === dependency.column_name)!;

            dependencyTable
              .attributeValuesForColumn(dependencyColumn.id)
              .map((attributeValue) => rawValues.push(attributeValue!.value));
          } else if (columnType.dependency.type === 'section') {
            const dependency = columnType.dependency as DependencyTypeSection;

            const dependencySections = this.submModel.section.sections.byType(dependency.section_type);
            dependencySections.map((dependencySection) =>
              dependencySection.fields.findAllByTypeName(dependency.field_name).map((field) => {
                if (field.value) {
                  rawValues.push(field.value);
                }
              })
            );
          } else {
            throw Error('Invalid dependency specification');
          }

          columnWithDependencySelect.setValues(rawValues);
        }
      });
    });
  }
}
