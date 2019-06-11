import { Location } from '@angular/common';
import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from 'app/app.config';
import { Option } from 'fp-ts/lib/Option';
import { BsModalService } from 'ngx-bootstrap';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SubmResultsModalComponent } from '../submission-results/subm-results-modal.component';
import { SubmitResponse } from '../submission-shared/submission.service';
import { SectionForm } from './shared/section-form';
import { SubmEditService } from './shared/subm-edit.service';
import { SubmSidebarComponent } from './subm-sidebar/subm-sidebar.component';
import { ModalService } from '../../shared/modal.service';

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
export class SubmEditComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Input() readonly = false;

    @ViewChild(SubmSidebarComponent) sideBar?: SubmSidebarComponent;

    accno?: string;
    releaseDate = '';

    sectionForm?: SectionForm;
    sideBarCollapsed = false;

    hasJustCreated = false;
    submitOperation: SubmitOperation = SubmitOperation.Unknown;

    private unsubscribe: Subject<void> = new Subject<void>();
    private scrollToCtrl?: FormControl;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private locService: Location,
                private bsModalService: BsModalService,
                private modalService: ModalService,
                private appConfig: AppConfig,
                private submEditService: SubmEditService) {

        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        submEditService.sectionSwitch$.takeUntil(this.unsubscribe)
            .subscribe(sectionForm => this.switchSection(sectionForm));

        submEditService.scroll2Control$.takeUntil(this.unsubscribe)
            .subscribe(ctrl => {
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

    // TODO: a temporary workaround
    get isTemp(): boolean {
        return this.accno!.startsWith('TMP_');
    }

    ngOnInit(): void {
        this.hasJustCreated = this.route.snapshot.data.isNew || false;

        this.route.params.takeUntil(this.unsubscribe)
            .pipe(
                switchMap(params => {
                    this.accno = params.accno;

                    return this.submEditService.load(params.accno, this.hasJustCreated);
                })
            ).subscribe((resp) => {
                if (this.hasJustCreated) {
                    this.locService.replaceState('/submissions/edit/' + this.accno);
                }

                if (resp.error.isSome() ) {
                    this.modalService.alert(
                        'Submission could not be retrieved. ' +
                        'Please make sure the URL is correct and contact us in case the problem persists.', 'Error', 'Ok'
                    ).subscribe(() => {
                        this.router.navigate(['/submissions/']);
                    });
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

    onRevertClick(event: Event) {
        this.confirmRevert().takeUntil(this.unsubscribe)
            .pipe(switchMap(() => this.submEditService.revert())
            ).subscribe(() => {
        });
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

        (isConfirm ? this.confirmSubmit() : of(true))
            .pipe(
                filter(v => v),
                switchMap(() => this.submEditService.submit())
            ).takeUntil(this.unsubscribe)
            .subscribe(resp => this.onSubmitFinished(resp));
    }

    onEditBackClick(event: Event) {
        this.readonly = false;
        this.router.navigate(['/submissions/edit/' + this.accno]);
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
        if (resp.status !== 'OK') {
            this.showSubmitLog(resp);
            return;
        }
        this.locService.replaceState('/submissions/' + this.accno);
        this.readonly = true;

        this.submitOperation = SubmitOperation.Update;

        if (resp.mapping[0].assigned) {
            this.accno = resp.mapping[0].assigned;
            this.submitOperation = SubmitOperation.Create;
            this.showSubmitLog(resp);
        }

        window.scrollTo(0, 0);
    }

    private showSubmitLog(resp: SubmitResponse) {
        this.bsModalService.show(SubmResultsModalComponent, {
            initialState: {
                log: resp.log,
                status: resp.status
            }
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

    private confirmPageDelete(message: string): Observable<boolean> {
        return this.modalService.whenConfirmed(
            message,
            'Delete page',
            'Delete'
        );
    }
}
