import {AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

import {BsModalService} from 'ngx-bootstrap';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {AppConfig} from '../../app.config';
import {SubmSidebarComponent} from './subm-sidebar/subm-sidebar.component';
import {Subject} from 'rxjs/Subject';
import {of} from 'rxjs';
import {SectionForm} from './section-form';
import {filter, switchMap} from 'rxjs/operators';
import {SubmEditService} from './subm-edit.service';
import {Option} from 'fp-ts/lib/Option';
import {FormControl} from '@angular/forms';
import {SubmitResponse} from '../shared/submission.service';

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
    @Input() readonly: boolean = false;

    @ViewChild(SubmSidebarComponent) sideBar?: SubmSidebarComponent;
    @ViewChild('confirmSectionDel') confirmSectionDel?: ConfirmDialogComponent;
    @ViewChild('confirmRevert') confirmRevert?: ConfirmDialogComponent;
    @ViewChild('confirmSubmit') confirmSubmit?: ConfirmDialogComponent;

    accno?: string;
    releaseDate: string = ''; //???

    sectionForm?: SectionForm;
    sideBarCollapsed: boolean = false;

    hasJustCreated: boolean = false;
    submitOperation: SubmitOperation = SubmitOperation.Unknown;

    private unsubscribe: Subject<void> = new Subject<void>();
    private scrollToCtrl?: FormControl;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private locService: Location,
                private modalService: BsModalService,
                private appConfig: AppConfig,
                private submEditService: SubmEditService) {

        //Initally collapses the sidebar for tablet-sized screens if applicable
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        submEditService.sectionSwitch$
            .takeUntil(this.unsubscribe)
            .subscribe(sectionForm => this.switchSection(sectionForm));

        submEditService.scroll2Control$
            .takeUntil(this.unsubscribe)
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

    //TODO: a temporary workaround
    get isTemp(): boolean {
        return this.accno!.startsWith('TMP_');
    }

    ngOnInit(): void {
        this.hasJustCreated = this.route.snapshot.data.isNew || false;

        this.route.params.takeUntil(this.unsubscribe)
            .pipe(
                switchMap(params => {
                    this.accno = params.accno;
                    return this.submEditService.load(params.accno, this.hasJustCreated)
                })
            ).subscribe(() => {
            if (this.hasJustCreated) {
                this.locService.replaceState('/submissions/edit/' + this.accno);
            }
        });
    }

    ngAfterViewChecked(): void {
        if (this.scrollToCtrl !== undefined) {
            setTimeout(() => {
                this.scroll()
            }, 500);
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.submEditService.reset();
    }

    onSectionClick(sectionForm: SectionForm): void {
        this.submEditService.switchSection(sectionForm);
    }

    onRevertClick(event: Event) {
        this.confirmRevert!.confirm().takeUntil(this.unsubscribe)
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

        let confirmShown = of(true);
        if (isConfirm) {
            confirmShown = this.confirmSubmit!.confirm(this.confirmSubmit!.body, false);
        }
        //TODO switchmap
        confirmShown.takeUntil(this.unsubscribe).pipe(filter(v => v)).subscribe(() => this.submit());
    }

    onEditBackClick(event: Event) {
        this.readonly = false;
        this.router.navigate(['/submissions/edit/' + this.accno]);
    }

    onSectionDeleteClick(sectionForm: SectionForm): void {
        let confirmMsg: string = `You are about to permanently delete the page named "${sectionForm.typeName}"`;

        if (sectionForm.accno) {
            confirmMsg += ` with accession number ${sectionForm.accno}`;
        }
        confirmMsg += '. This operation cannot be undone.';

        this.confirmSectionDel!.confirm(confirmMsg).takeUntil(this.unsubscribe).subscribe(() => {
            this.sectionForm!.removeSection(sectionForm.id);
        });
    }

    private scroll() {
        if (this.scrollToCtrl === undefined) {
            return;
        }
        const el = (<any>this.scrollToCtrl).nativeElement;
        if (el !== undefined) {
            let rect = el.getBoundingClientRect();
            if (!this.isInViewPort(rect)) {
                window.scrollBy(0, rect.top - 120); //TODO: header height
            }
            el.querySelectorAll('input, select, textarea')[0].focus();
        }
        this.scrollToCtrl = undefined;
    }

    private isInViewPort(rect: { top: number, left: number, bottom: number, right: number }) {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    private get isValid(): boolean {
        return this.sectionForm !== undefined && this.sectionForm.form.valid;
    }

    private submit() {
        this.submEditService.submit().takeUntil(this.unsubscribe)
            .subscribe(resp => this.onSubmitFinished(resp));
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
        this.modalService.show(SubmResultsModalComponent, {
            initialState: {
                log: resp.log,
                status: resp.status
            }
        });
    }

    private switchSection(sectionForm: Option<SectionForm>) {
        this.sectionForm = sectionForm.toUndefined();
    }
}
