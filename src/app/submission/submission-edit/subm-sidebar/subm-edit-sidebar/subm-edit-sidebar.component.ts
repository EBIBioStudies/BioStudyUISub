import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserData } from 'app/auth/shared';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from 'app/shared/modal.service';
import { TypeBase, TableType, SectionType, DisplayType } from 'app/submission/submission-shared/model/templates';
import { scrollToFormControl } from 'app/utils/scroll.utils';
import { AddSubmTypeModalComponent } from '../add-subm-type-modal/add-subm-type-modal.component';
import { FormValidators } from '../../shared/form-validators';
import { SectionForm } from '../../shared/model/section-form.model';
import { SubmEditService } from '../../shared/subm-edit.service';

const SECTION_ID = '@SECTION@';

class DataTypeControl {
  readonly control: FormControl;
  deleted = false;
  readonly isReadonly: boolean;
  readonly isVisible: boolean;

  constructor(
    readonly type: TypeBase,
    readonly icon: string,
    readonly displayType: DisplayType,
    readonly description: string,
    readonly id: string
  ) {
    this.isReadonly = !type.canModify;
    this.isVisible = !this.displayType.isReadonly;
    this.control = new FormControl({ value: type.name, disabled: this.isReadonly }, [
      Validators.required,
      Validators.pattern('[a-zA-Z0-9_ ]*')
    ]);
  }

  static fromTableType(type: TableType, id: string): DataTypeControl {
    return new DataTypeControl(type, type.icon, type.displayType, type.description, id);
  }

  static fromSectionType(type: SectionType): DataTypeControl {
    return new DataTypeControl(type, 'fa-folder-plus', type.displayType, '', SECTION_ID);
  }

  get typeName(): string {
    return this.type.name;
  }

  get prettyName(): string {
    return this.type.title || this.type.name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  reset(): void {
    this.deleted = false;
    this.control.setValue(this.type.name);
  }

  update(): void {
    this.type.name = this.control.value;
  }
}

@Component({
  selector: 'st-subm-edit-sidebar',
  templateUrl: './subm-edit-sidebar.component.html'
})
export class SubmEditSidebarComponent implements OnDestroy {
  @Input() collapsed: boolean = false;
  form: FormGroup = new FormGroup({}, FormValidators.uniqueValues);
  isAdvancedOpen: boolean = false;
  @Input() isAdvancedVisible: boolean = true;
  isEditModeOn: boolean = false;
  items: DataTypeControl[] = [];
  sectionForm?: SectionForm;

  private formSubscription?: Subscription;
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public userData: UserData,
    private bsModalService: BsModalService,
    private modalService: ModalService,
    private submEditService: SubmEditService
  ) {
    this.submEditService.sectionSwitch$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((sectionForm) => this.switchSection(sectionForm));
  }

  get isEditModeOff(): boolean {
    return !this.isEditModeOn;
  }

  get isAdvancedClosed(): boolean {
    return !this.isAdvancedOpen;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onAdvancedToggle(): void {
    this.isAdvancedOpen = !this.isAdvancedOpen;
  }

  onApplyChanges(): void {
    if (this.form.invalid) {
      return;
    }

    const deleted = this.items.filter((item) => item.deleted);

    if (deleted.length > 0) {
      const isPlural = deleted.length > 1;

      const message = `The submission
          ${isPlural ? `items` : `item`} with type
          ${deleted.map(({ typeName }) => `"${typeName}"`).join(', ')}
          ${isPlural ? `have` : `has`} been deleted. If you proceed,
          ${isPlural ? `they` : `it`} will be removed from the
          list of items and any related tables or sections will be permanently deleted.`;
      this.modalService.confirm(message, 'Delete items', 'Delete').subscribe((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.applyChanges();
        } else {
          this.onCancelChanges();
        }
      });
    } else {
      this.applyChanges();
    }
  }

  onCancelChanges(event?: Event): void {
    this.items.forEach((item) => item.reset());
    this.onEditModeToggle(event);
  }

  onEditModeToggle(event?: Event): void {
    // tslint:disable-next-line: no-unused-expression
    event && event.preventDefault();
    this.isEditModeOn = !this.isEditModeOn;
  }

  onItemClick(item: DataTypeControl): void {
    if (item.id === SECTION_ID) {
      const sf = this.sectionForm!.addSection(item.type as SectionType);
      this.submEditService.switchSection(sf);
      return;
    }

    this.sectionForm!.addTableEntry(item.id);
    const control = this.sectionForm!.getTableControl(item.id);

    if (control === undefined) {
      return;
    }

    setTimeout(() => scrollToFormControl(control), 50);
  }

  onItemDelete(item: DataTypeControl): void {
    item.deleted = true;
    this.form.removeControl(item.id);
  }

  onNewTypeClick(event?: Event): void {
    // tslint:disable-next-line: no-unused-expression
    event && event.preventDefault();
    const bsModalRef = this.bsModalService.show(AddSubmTypeModalComponent, {
      initialState: { sectionForm: this.sectionForm }
    });
    bsModalRef.content.closeBtnName = 'Close';
  }

  private applyChanges(): void {
    const deleted = this.items!.filter((item) => item.deleted);
    deleted.forEach(({ id }) => {
      this.sectionForm!.removeTableType(id);
    });

    this.items!.filter((item) => !item.deleted).forEach((item) => item.update());
    this.onEditModeToggle();
  }

  private switchSection(sectionFormOp: SectionForm | null): void {
    if (sectionFormOp) {
      this.sectionForm = sectionFormOp;

      if (this.formSubscription) {
        this.formSubscription.unsubscribe();
      }

      if (this.sectionForm) {
        this.formSubscription = this.sectionForm.structureChanges$.subscribe(() => this.updateItems());
      }
    }
  }

  private updateItems(): void {
    this.items = [
      ...this.sectionForm!.tableForms.map((ff) => DataTypeControl.fromTableType(ff.tableType, ff.id)),
      ...this.sectionForm!.type.sectionTypes.map((st) => DataTypeControl.fromSectionType(st))
    ].filter((item) => item.isVisible);

    const form = new FormGroup({}, FormValidators.uniqueValues);
    this.items.forEach((item) => form.addControl(item.id, item.control));

    this.form = form;
  }
}
