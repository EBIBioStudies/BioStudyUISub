import { Location } from '@angular/common';
import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'app/app.config';
import { Option } from 'fp-ts/lib/Option';
import { BsModalService } from 'ngx-bootstrap';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SubmResultsModalComponent } from '../submission-results/subm-results-modal.component';
import { SubmitResponse, SubmitLog } from '../submission-shared/submission.service';
import { SectionForm } from './shared/section-form';
import { SubmEditService } from './shared/subm-edit.service';
import { SubmSidebarComponent } from './subm-sidebar/subm-sidebar.component';
import { ModalService } from '../../shared/modal.service';

class SubmitOperation {
    get isUnknown(): boolean {
        return this === SubmitOperation.UNKNOWN;
    }

    get isCreate(): boolean {
        return this === SubmitOperation.CREATE;
    }

    get isUpdate(): boolean {
        return this === SubmitOperation.UPDATE;
    }

    static UNKNOWN = new SubmitOperation();
    static CREATE = new SubmitOperation();
    static UPDATE = new SubmitOperation();
}

@Component({
    selector: 'st-app-subm-edit',
    templateUrl: './submission-edit.component.html'
})
export class SubmissionEditComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Input() readonly = false;
    @ViewChild(SubmSidebarComponent) sideBar?: SubmSidebarComponent;

    private accno?: string;
    private hasJustCreated = false;
    private releaseDate: Date = new Date();
    private scrollToCtrl?: FormControl;
    private unsubscribe: Subject<void> = new Subject<void>();

    sideBarCollapsed = false;
    submitOperation: SubmitOperation = SubmitOperation.UNKNOWN;
    sectionForm?: SectionForm;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private locService: Location,
        private bsModalService: BsModalService,
        private modalService: ModalService,
        private appConfig: AppConfig,
        private submEditService: SubmEditService
    ) {
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        submEditService.sectionSwitch$.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(sectionForm => this.switchSection(sectionForm));

        submEditService.scroll2Control$.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(ctrl => {
            this.scrollToCtrl = ctrl;
        });
    }

    get location() {
        return window.location;
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

    // TODO: a temporary workaround
    get isTemp(): boolean {
        return this.accno!.startsWith('TMP_');
    }

    ngOnInit(): void {
        this.hasJustCreated = this.route.snapshot.data.isNew || false;
        this.route.params
            .pipe(
                switchMap(({ accno }) => {
                    this.accno = accno;

                    return this.submEditService.load(accno, this.hasJustCreated);
                })
            ).subscribe((resp) => {
                if (this.hasJustCreated) {
                    this.locService.replaceState('/submissions/edit/' + this.accno);
                }
                if (this.sideBar && resp.payload.isSome ) {
                    const att = resp.payload.getOrElse({'name': 'AttachTo', value: '' }) || { value: '' };
                    this.sideBar.showAdvanced = !(att.value.toLowerCase() === 'arrayexpress' );
                }
                if (resp.error.isSome() ) {
                    this.modalService.alert(
                        'Submission could not be retrieved. ' +
                        'Please make sure the URL is correct and contact us in case the problem persists.', 'Error', 'Ok'
                    ).subscribe(() => {
                        this.router.navigate(['/submissions/']);
                    });

                    // TODO: log this error using the new service
                } else {
                    const releaseDateCtrl = this.sectionForm!.findFieldControl('ReleaseDate');

                    if (releaseDateCtrl) {
                        this.releaseDate = new Date(Date.parse(releaseDateCtrl.control.value));

                        releaseDateCtrl.control.valueChanges.subscribe((value) => {
                            this.releaseDate = new Date(Date.parse(value));
                        });
                    } else {
                        this.releaseDate = new Date();
                    }

                    this.releaseDate.setHours(0, 0, 0);
                }
            });
    }

    ngAfterViewChecked(): void {
        if (this.scrollToCtrl !== undefined) {
            setTimeout(() => {
                this.scroll();
            }, 500);
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.submEditService.reset();
    }

    onRevertClick() {
        this.confirmRevert()
            .pipe(
                takeUntil(this.unsubscribe),
                switchMap(() => this.submEditService.revert())
            ).subscribe(() => {});
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

        const confirmObservable: Observable<boolean> = isConfirm ? this.confirmSubmit() : of(true);

        confirmObservable
            .pipe(
                switchMap(() => this.confirmReleaseDateOverride()),
                switchMap(() => this.submEditService.submit()),
                takeUntil(this.unsubscribe)
            )
            .subscribe(
                (resp) => this.onSubmitFinished(resp),
                (resp) => this.showSubmitLog(false, resp.log)
            );
    }

    onEditBackClick() {
        this.readonly = false;
        this.router.navigate([`/submissions/edit/${this.accno}`]);
    }

    onSectionClick(sectionForm: SectionForm): void {
        this.submEditService.switchSection(sectionForm);
    }

    onSectionDeleteClick(sectionForm: SectionForm): void {
        let confirmMsg = `You are about to permanently delete the page named "${sectionForm.typeName}"`;

        if (sectionForm.accno) {
            confirmMsg += ` with accession number ${sectionForm.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.';

        this.confirmPageDelete(confirmMsg)
            .subscribe(() => {
                this.sectionForm!.removeSection(sectionForm.id);
            });
    }

    private scroll() {
        if (this.scrollToCtrl === undefined) {
            return;
        }
        const el = (<any>this.scrollToCtrl).nativeElement;
        if (el !== undefined) {
            const rect = el.getBoundingClientRect();
            if (!this.isInViewPort(rect)) {
                window.scrollBy(0, rect.top - 120); // TODO: header height
            }
            el.querySelectorAll('input, select, textarea')[0].focus();
        }
        this.scrollToCtrl = undefined;
    }

    private isInViewPort(rect: { top: number, left: number, bottom: number, right: number }) {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement!.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement!.clientWidth)
        );
    }

    private get isValid(): boolean {
        return this.sectionForm !== undefined && this.sectionForm.form.valid;
    }

    // todo: add proper type for submit response
    private onSubmitFinished(resp: SubmitResponse) {
        this.locService.replaceState('/submissions/' + this.accno);
        this.readonly = true;

        this.submitOperation = SubmitOperation.Update;

        if (resp.accno) {
            this.accno = resp.accno;
            this.submitOperation = SubmitOperation.Create;
            this.showSubmitLog(true);
        }

        window.scrollTo(0, 0);
    }

    private showSubmitLog(isSuccess: boolean, log?: SubmitLog) {
        this.bsModalService.show(SubmResultsModalComponent, {
            initialState: { isSuccess, log }
        });
    }

    private switchSection(sectionForm: Option<SectionForm>) {
        this.sectionForm = sectionForm.toUndefined();
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
            'Submit',
        );
    }

    private confirmReleaseDateOverride(): Observable<boolean> {
        const releaseDateCtrl = this.sectionForm!.findFieldControl('ReleaseDate');
        const newReleaseDate = releaseDateCtrl ? new Date (Date.parse(releaseDateCtrl.control.value)) : new Date();
        newReleaseDate.setHours(0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0);
        return (this.releaseDate <= today && newReleaseDate > today) ? this.modalService.whenConfirmed(
            'This study has already been released and resetting the release date may make it ' +
            'unavailable to the public. Are you sure you want to continue?',
            'Submit the study',
            'OK',
        ) : of(true);
    }

    private confirmPageDelete(message: string): Observable<boolean> {
        return this.modalService.whenConfirmed(
            message,
            'Delete page',
            'Delete'
        );
    }
}
