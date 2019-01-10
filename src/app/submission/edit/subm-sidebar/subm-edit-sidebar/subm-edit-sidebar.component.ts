import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {SectionForm} from 'app/submission/edit/shared/section-form';
import {ConfirmDialogComponent} from 'app/shared';
import {UserData} from 'app/auth';
import {FeatureType, SectionType, TypeBase} from 'app/submission/shared/model';
import {BsModalService} from 'ngx-bootstrap';
import {AddSubmTypeModalComponent} from 'app/submission/edit/subm-sidebar/add-subm-type-modal/add-subm-type-modal.component';
import {FormValidators} from 'app/submission/edit/shared/form-validators';
import {SubmEditService} from 'app/submission/edit/shared/subm-edit.service';
import {Option} from 'fp-ts/lib/Option';

const SECTION_ID = '@SECTION@';

class DataTypeControl {
    deleted = false;

    readonly control: FormControl;
    readonly isReadonly: boolean;

    constructor(readonly type: TypeBase,
                readonly icon: string,
                readonly description: string,
                readonly id: string) {
        this.isReadonly = !type.canModify;
        this.control = new FormControl({value: type.name, disabled: this.isReadonly},
            [Validators.required, Validators.pattern('[a-zA-Z0-9_ ]*')]);
    }

    static fromFeatureType(type: FeatureType, id: string): DataTypeControl {
        return new DataTypeControl(type, type.icon, type.description, id);
    }

    static fromSectionType(type: SectionType) {
        return new DataTypeControl(type, 'fa-folder-plus', '', SECTION_ID);
    }

    reset(): void {
        this.deleted = false;
        this.control.setValue(this.type.name);
    }

    update(): void {
        this.type.name = this.control.value;
    }

    get typeName(): string {
        return this.type.name;
    }

    get prettyName(): string {
        return this.type.name.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
}

@Component({
    selector: 'subm-edit-sidebar',
    templateUrl: './subm-edit-sidebar.component.html',
    styleUrls: ['./subm-edit-sidebar.component.css']
})
export class SubmEditSidebarComponent implements OnInit, OnDestroy {
    isEditModeOn: boolean = false;
    isAdvancedOpen: boolean = false;
    items: DataTypeControl[] = [];

    form?: FormGroup;
    sectionForm?: SectionForm;

    private unsubscribe: Subject<void> = new Subject<void>();
    private formSubscription?: Subscription;

    constructor(public userData: UserData,
                private modalService: BsModalService,
                private submEditService: SubmEditService) {
        this.submEditService.sectionSwitch$.takeUntil(this.unsubscribe)
            .subscribe(sectionForm => this.switchSection(sectionForm));
    }

    get isEditModeOff(): boolean {
        return !this.isEditModeOn;
    }

    get isAdvancedClosed(): boolean {
        return !this.isAdvancedOpen;
    }

    ngOnInit(): void {
        this.updateItems();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onNewTypeClick(event?: Event): void {
        event && event.preventDefault();
        const bsModalRef = this.modalService.show(AddSubmTypeModalComponent, {initialState: {sectionForm: this.sectionForm}});
        bsModalRef.content.closeBtnName = 'Close';
    }

    onItemClick(item: DataTypeControl): void {
        if (item.id === SECTION_ID) {
            const sf = this.sectionForm!.addSection(item.type as SectionType);
            this.submEditService.switchSection(sf);
            return;
        }

        this.sectionForm!.addFeatureEntry(item.id);
        const control = this.sectionForm!.getFeatureControl(item.id);
        if (control === undefined) {
            return;
        }

        setTimeout(() => {
            let controlEl = (<any>control).nativeElement;
            if (controlEl !== undefined) {
                controlEl = controlEl.querySelectorAll('input, select, textarea')[0];
                const scrollTop = controlEl.top;
                window.scrollBy(0, scrollTop);
                controlEl.focus();
            }
        }, 50);

    }

    onItemDelete(item: DataTypeControl): void {
        item.deleted = true;
        this.form!.removeControl(item.id);
    }

    onCancelChanges(event?: Event): void {
        this.items.forEach(item => item.reset());
        this.onEditModeToggle(event);
    }

    onEditModeToggle(event?: Event): void {
        event && event.preventDefault();
        this.isEditModeOn = !this.isEditModeOn;
    }

    onAdvancedToggle() {
        this.isAdvancedOpen = !this.isAdvancedOpen;
    }

    onApplyChanges(): void {
        if (this.form!.invalid) {
            return;
        }

        const deleted = this.items!.filter(item => item.deleted);

        if (deleted.length > 0) {
            const isPlural = deleted.length > 1;

            this.confirm(`The submission
                    ${isPlural ? `items` : `item`} with type
                    ${deleted.map(({typeName}) => `"${typeName}"`).join(', ')}
                    ${isPlural ? `have` : `has`} been deleted. If you proceed,
                    ${isPlural ? `they` : `it`} will be removed from the
                    list of items and any related features or sections will be permanently deleted.`,
                (isConfirmed: boolean) => {
                    console.log(isConfirmed);
                    if (isConfirmed) {
                        this.applyChanges();
                    } else {
                        this.onCancelChanges();
                    }
                });
        } else {
            this.applyChanges()
        }
    }

    private switchSection(sectionFormOp: Option<SectionForm>) {
        this.unsubscribe.next();

        if (sectionFormOp.isSome()) {
            this.sectionForm = sectionFormOp.toUndefined();
            if (this.formSubscription) {
                this.formSubscription.unsubscribe();
            }
            if (this.sectionForm) {
                this.formSubscription = this.sectionForm.structureChanges$.subscribe(it => this.updateItems())
            }
        }
    }

    private confirm(message: string, callback: (v: boolean) => any) {
        this.modalService.show(ConfirmDialogComponent,
            {
                initialState: {
                    headerTitle: 'Delete items',
                    confirmLabel: 'Delete',
                    body: message,
                    isDiscardCancel: false,
                    callback: callback
                }
            });
    }

    private applyChanges() {
        const deleted = this.items!.filter(item => item.deleted);
        deleted.forEach(({id}) => {
            this.sectionForm!.removeFeatureType(id);
        });

        this.items!.filter(item => !item.deleted).forEach(item => item.update());
        this.onEditModeToggle();
    }

    private updateItems(): void {
        this.items =
            [...this.sectionForm!.featureForms.map(ff => DataTypeControl.fromFeatureType(ff.featureType, ff.id)),
                ...this.sectionForm!.type.sectionTypes.map(st => DataTypeControl.fromSectionType(st))];

        const form = new FormGroup({}, FormValidators.uniqueValues);
        this.items.forEach(item => form.addControl(item.id, item.control));

        this.form = form;
    }
}
