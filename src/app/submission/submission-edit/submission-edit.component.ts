import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { AppConfig } from 'app/app.config';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ErrorService } from 'app/core/errors/error.service';
import { Location } from '@angular/common';
import { ModalService } from 'app/shared/modal/modal.service';
import { BannerType, DisplayType, PageTabSubmission } from 'app/submission/submission-shared/model';
import { SectionForm } from './shared/model/section-form.model';
import { SubmEditService } from './shared/subm-edit.service';
import { SubmErrorModalComponent } from '../submission-results/subm-error-modal.component';
import { SubmSidebarComponent } from './subm-sidebar/subm-sidebar.component';
import { SubmValidationErrors } from '../submission-shared/model';
import { scrollTop } from 'app/utils/scroll.utils';

class SubmitOperation {
  static CREATE = new SubmitOperation();
  static UNKNOWN = new SubmitOperation();
  static UPDATE = new SubmitOperation();

  get isUnknown(): boolean {
    return this === SubmitOperation.UNKNOWN;
  }

  get isCreate(): boolean {
    return this === SubmitOperation.CREATE;
  }

  get isUpdate(): boolean {
    return this === SubmitOperation.UPDATE;
  }
}

@Component({
  selector: 'st-app-subm-edit',
  templateUrl: './submission-edit.component.html',
  styleUrls: ['./submission-edit.component.scss']
})
export class SubmissionEditComponent implements OnInit, OnDestroy {
  @Input() readonly = false;
  sectionForm!: SectionForm;
  rootSection!: SectionForm;
  @ViewChild(SubmSidebarComponent) sideBar?: SubmSidebarComponent;
  submitOperation: SubmitOperation = SubmitOperation.UNKNOWN;
  isSidebarCollapsed: boolean = false;
  method?: string;
  submissionErrors: SubmValidationErrors = SubmValidationErrors.EMPTY;
  showError: boolean = false;
  templForbiddenMessage: string = '';
  submNotFoundMessage: string = '';

  private accno?: string;
  private unsubscribe: Subject<void> = new Subject<void>();
  private collection?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locService: Location,
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private submEditService: SubmEditService,
    private errorService: ErrorService,
    private appConfig: AppConfig
  ) {
    this.submEditService.sectionSwitch$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((sectionForm) => this.switchSection(sectionForm));

    this.submEditService.validationError$
      .asObservable()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((errors) => {
        this.submissionErrors = errors;
      });
  }

  get isSubmitting(): boolean {
    return this.submEditService.isSubmitting;
  }

  get isLoading(): boolean {
    return this.submEditService.isLoading;
  }

  get isSaving(): boolean {
    return this.submEditService.isSaving;
  }

  get isReverting(): boolean {
    return this.submEditService.isReverting;
  }

  get isEditing(): boolean {
    return this.submEditService.isEditing;
  }

  get isTemp(): boolean {
    return this.accno!.startsWith('TMP_');
  }

  get frontendUrl(): string {
    return this.appConfig.frontendURL;
  }

  get banner(): BannerType | undefined {
    return this.rootSection.section.type.banner;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.submEditService.reset();
  }

  ngOnInit(): void {
    this.showError = false;

    const isNewSubmission = this.route.snapshot.data.isNew || false;
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(({ accno, method, template }) => {
      this.method = method;
      this.accno = accno;

      if (accno === undefined) {
        this.createEmptySubmission(template);
      } else {
        this.loadSubmission(accno, isNewSubmission);
      }
    });
  }

  onEditBackClick(): void {
    this.readonly = false;
    this.router.navigate([`/edit/${this.accno}`]);
  }

  onRevertClick(): void {
    this.confirmRevert()
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap(() => this.submEditService.revert())
      )
      .subscribe(() => {});
  }

  onSectionClick(sectionForm: SectionForm): void {
    scrollTop();
    this.submEditService.switchSection(sectionForm);
  }

  onSectionDeleteClick(sectionForm: SectionForm): void {
    let confirmMsg = `You are about to permanently delete the page named "${sectionForm.typeName}"`;

    if (sectionForm.accno) {
      confirmMsg += ` with accession number ${sectionForm.accno}`;
    }
    confirmMsg += '. This operation cannot be undone.';

    this.confirmSectionDelete(confirmMsg)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.sectionForm!.removeSection(sectionForm.id);
      });
  }

  onSubmitClick(onlyMetadataUpdate: boolean): void {
    scrollTop();

    if (this.isSubmitting) {
      return;
    }

    this.submEditService.validateForm();
    if (!this.isValid) {
      this.sideBar!.onCheckTabClick();
      this.submEditService.switchSection(this.rootSection);
      return;
    }

    this.submEditService.switchSection(this.rootSection);

    of(true)
      .pipe(
        switchMap(() => this.submEditService.submit(onlyMetadataUpdate)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => this.onSubmitSuccess(),
        (resp) => this.showSubmitLog(resp.log)
      );
  }

  onSidebarToggle(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  private createEmptySubmission(template: string): void {
    this.submEditService.createEmptySubmission(template).subscribe(
      (accno) => {
        this.accno = accno;
        this.loadSubmission(this.accno, true);
      },
      (error: Observable<string>) => {
        error.subscribe({
          error: (msg) => {
            this.showError = true;
            this.templForbiddenMessage = msg;
          }
        });
      }
    );
  }

  private loadSubmission(accno: string, isNewSubmission: boolean): void {
    this.submEditService
      .loadSubmission(accno, isNewSubmission)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (ptSubmission: PageTabSubmission) => {
          if (isNewSubmission) {
            this.locService.replaceState('/edit/' + this.accno);
            this.readonly = false;
          }

          if (this.sideBar) {
            const attachToAttr = ptSubmission.findAttributeByName('attachto');

            if (attachToAttr) {
              this.collection = attachToAttr.value as string;
              // TODO: handle this through template
              this.sideBar.showAdvanced = !(this.collection.toLowerCase() === 'arrayexpress');
            }
          }

          const releaseDateCtrl = this.sectionForm!.findFieldControl('ReleaseDate');

          if (releaseDateCtrl) {
            const [year, month, date] = releaseDateCtrl.control.value.split('-').map((s) => parseInt(s, 10));
            if (Date.UTC(year, month - 1, date) <= new Date().valueOf() && !this.isTemp) {
              releaseDateCtrl.type.displayType = DisplayType.READONLY;
            }
          }
        },
        (error) => {
          if (!this.errorService.isNotFoundError(error)) {
            this.router.navigate(['/']);
            throw error;
          }

          this.showError = true;
          this.submNotFoundMessage = this.errorService.getServerErrorMessage(error);
        }
      );
  }

  private confirmSectionDelete(message: string): Observable<boolean> {
    return this.modalService.whenConfirmed(message, 'Delete section', 'Delete');
  }

  private confirmRevert(): Observable<boolean> {
    return this.modalService.whenConfirmed(
      'You are about to discard all changes made to this submission since it was last released. This operation cannot be undone.',
      'Revert to released version',
      'Revert'
    );
  }

  private onSubmitSuccess(): void {
    this.locService.replaceState('/' + this.accno);
    this.readonly = true;
    this.submitOperation = this.isTemp ? SubmitOperation.CREATE : SubmitOperation.UPDATE;

    scrollTop();
  }

  private get isValid(): boolean {
    const hasErrors: boolean = this.submissionErrors.errorsRecursive.length > 0;

    return this.sectionForm !== undefined && this.sectionForm.form.valid && !hasErrors;
  }

  private showSubmitLog(log?: LogDetail): void {
    this.bsModalService.show(SubmErrorModalComponent, {
      initialState: { log }
    });
  }

  private switchSection(sectionForm: SectionForm | null): void {
    if (sectionForm) {
      this.sectionForm = sectionForm;

      if (sectionForm.isRootSection) {
        this.rootSection = sectionForm;
      }
    }
  }
}
