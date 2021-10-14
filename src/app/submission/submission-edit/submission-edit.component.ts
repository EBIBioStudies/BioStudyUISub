import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { AppConfig } from 'app/app.config';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ErrorService } from 'app/core/errors/error.service';
import { Location } from '@angular/common';
import { ModalService } from 'app/shared/modal/modal.service';
import { PageTabSubmission } from 'app/submission/submission-shared/model';
import { SectionForm } from './shared/model/section-form.model';
import { SubmEditService } from './shared/subm-edit.service';
import { SubmErrorModalComponent } from '../submission-results/subm-error-modal.component';
import { SubmSidebarComponent } from './subm-sidebar/subm-sidebar.component';
import { SubmValidationErrors } from '../submission-shared/model';
import { SubmitLog } from '../submission-shared/submission.service';
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
  submNotFound: boolean = false;
  submNotFoundMessage: string = '';

  private accno?: string;
  private hasJustCreated = false;
  private newReleaseDate: Date = new Date();
  private oldReleaseDate: Date = new Date();
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
    submEditService.sectionSwitch$
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.submEditService.reset();
  }

  ngOnInit(): void {
    this.hasJustCreated = this.route.snapshot.data.isNew || false;
    this.route.params
      .pipe(
        switchMap(({ accno, method }) => {
          this.accno = accno;
          this.method = method;

          return this.submEditService.loadSubmission(accno, this.hasJustCreated);
        })
      )
      .subscribe(
        (ptSubmission: PageTabSubmission) => {
          if (this.hasJustCreated) {
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
            const currentControlDate: string = releaseDateCtrl.control.value;
            const currentDate: Date = currentControlDate ? new Date(Date.parse(currentControlDate)) : new Date();
            this.oldReleaseDate = currentDate;
            this.newReleaseDate = currentDate;
            this.oldReleaseDate.setHours(0, 0, 0, 0);
            this.newReleaseDate.setHours(0, 0, 0, 0);

            releaseDateCtrl.control.valueChanges.subscribe((value) => {
              this.newReleaseDate = new Date(Date.parse(value));
              this.newReleaseDate.setHours(0, 0, 0, 0);
            });
          }
        },
        (error) => {
          if (!this.errorService.isNotFoundError(error)) {
            this.router.navigate(['/']);
            throw error;
          }

          this.submNotFound = true;
          this.submNotFoundMessage = this.errorService.getServerErrorMessage(error);
        }
      );
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

    this.confirmPageDelete(confirmMsg).subscribe(() => {
      this.sectionForm!.removeSection(sectionForm.id);
    });
  }

  onSubmitClick(event, isConfirm: boolean = false): void {
    this.submEditService.switchSection(this.rootSection);

    scrollTop();

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

    const confirmObservable: Observable<boolean> = isConfirm ? this.confirmSubmit() : of(true);

    confirmObservable
      .pipe(
        switchMap(() => this.confirmReleaseDateOverride()),
        switchMap(() => this.submEditService.submit()),
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

  private confirmPageDelete(message: string): Observable<boolean> {
    return this.modalService.whenConfirmed(message, 'Delete page', 'Delete');
  }

  private confirmReleaseDateOverride(): Observable<boolean> {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    const isDateOverride: boolean = this.oldReleaseDate < today && this.newReleaseDate >= today;

    return isDateOverride
      ? this.modalService.whenConfirmed(
          'This study has already been released and resetting the release date may make it ' +
            'unavailable to the public. Are you sure you want to continue?',
          'Submit the study',
          'OK'
        )
      : of(true);
  }

  private confirmRevert(): Observable<boolean> {
    return this.modalService.whenConfirmed(
      'You are about to discard all changes made to this submission since it was last released. This operation cannot be undone.',
      'Revert to released version',
      'Revert'
    );
  }

  private confirmSubmit(): Observable<boolean> {
    return this.modalService.confirm(
      'You have hit the enter key while filling in the form. If you continue, the study data will be submitted',
      'Submit the study',
      'Submit'
    );
  }

  private onSubmitSuccess(): void {
    this.locService.replaceState('/' + this.accno);
    this.readonly = true;
    this.submitOperation = this.isTemp ? SubmitOperation.CREATE : SubmitOperation.UPDATE;

    scrollTop();
  }

  private get isValid(): boolean {
    const hasErrors: boolean = this.submissionErrors.errors.length > 0;

    return this.sectionForm !== undefined && this.sectionForm.form.valid && !hasErrors;
  }

  private showSubmitLog(log?: SubmitLog): void {
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
