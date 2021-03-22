import { CustomFormControl } from './custom-form-control.model';
import { DisplayType, Table, TableType, Field, Section, SectionType } from 'app/submission/submission-shared/model';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBase } from '../model/form-base.model';
import { ControlGroupRef } from '../control-reference';
import { FieldControl } from './field-control.model';
import { TableForm } from './table-form.model';
import { StructureChangeEvent } from '../structure-change-event';

export class SectionForm extends FormBase {
  readonly tableForms: TableForm[] = [];
  readonly fieldControls: FieldControl[] = [];
  readonly sectionPath: string[];
  // Can use form's valueChanges, but then the operations like add/remove column will not be atomic,
  // as it requires to apply multiple changes at once
  readonly structureChanges$ = new BehaviorSubject<StructureChangeEvent>(StructureChangeEvent.init);
  readonly subsectionForms: SectionForm[] = [];

  private sb: Map<string, Subscription> = new Map<string, Subscription>();
  private sectionRef: ControlGroupRef;

  constructor(readonly section: Section, readonly parent?: SectionForm) {
    super(
      new FormGroup({
        fields: new FormGroup({}),
        tables: new FormGroup({}),
        sections: new FormGroup({})
      })
    );

    const parentSectionPath = this.parent ? this.parent.sectionPath : [];
    this.sectionPath = this.isRootSection ? [] : [...parentSectionPath, this.id];
    this.sectionRef = ControlGroupRef.sectionRef(section, this.isRootSection);

    this.buildElements(section.displayAnnotations);
  }

  addTable(type: TableType): Table | undefined {
    const table = this.section.tables.add(type);
    if (table) {
      this.addTableForm(table);
      this.structureChanges$.next(StructureChangeEvent.tableAdd);
    }
    return table;
  }

  addTableEntry(tableId: string): void {
    const tableForm = this.tableForms.find((f) => f.id === tableId);
    if (tableForm !== undefined) {
      tableForm.addEntry();
    }
  }

  addSection(type: SectionType): SectionForm {
    const form = this.addSubsectionForm(this.section.sections.add(type));
    this.structureChanges$.next(StructureChangeEvent.sectionAdd);
    return form;
  }

  findFieldControl(fieldName: string): FieldControl | undefined {
    return this.fieldControls.find((fieldControl) => fieldControl.name === fieldName);
  }

  findSectionForm(sectionId: string): SectionForm | undefined {
    return this.findRoot().lookupSectionForm(sectionId);
  }

  getTableControl(tableId: string): CustomFormControl | undefined {
    const tableForm = this.tableForms.find((f) => f.id === tableId);
    if (tableForm !== undefined) {
      return tableForm.scrollToTheLastControl;
    }
  }

  getTableFormById(tableId: string): TableForm | undefined {
    return this.tableForms.find((table) => table.id === tableId);
  }

  isSectionRemovable(sectionForm: SectionForm): boolean {
    const min = sectionForm.typeMinRequired;
    return sectionForm.isTypeRemovable || this.section.sections.byType(sectionForm.typeName).length > min;
  }

  removeTableType(tableId: string): void {
    const index = this.tableForms.findIndex((f) => f.id === tableId);
    if (index < 0) {
      return;
    }

    if (this.section.tables.removeById(tableId)) {
      this.unsubscribe(tableId);
      this.tableForms.splice(index, 1);
      this.tableFormGroups.removeControl(tableId);
      this.structureChanges$.next(StructureChangeEvent.tableRemove);
    }
  }

  removeSection(sectionId: string): void {
    const index = this.subsectionForms.findIndex((s) => s.id === sectionId);
    if (index < 0) {
      return;
    }

    if (this.section.sections.removeById(sectionId)) {
      this.subsectionForms.splice(index, 1);
      this.subsectionFormGroups.removeControl(sectionId);
      this.structureChanges$.next(StructureChangeEvent.sectionRemove);
    }
  }

  get type(): SectionType {
    return this.section.type;
  }

  get isTypeReadonly(): boolean {
    return this.section.type.displayType === DisplayType.READONLY;
  }

  get typeName(): string {
    return this.section.typeName;
  }

  get id(): string {
    return this.section.id;
  }

  get accno(): string {
    return this.section.accno;
  }

  get isTypeRemovable(): boolean {
    return this.section.type.displayType.isRemovable;
  }

  get typeMinRequired(): number {
    return this.section.type.minRequired;
  }

  get isRootSection(): boolean {
    return this.parent === undefined;
  }

  get sectionTypes(): Array<SectionType> {
    return [...this.section.type.sectionTypes, ...this.subsectionForms.map((sf) => sf.type)].reduce(
      (rv, v) => {
        if (rv[0][v.name] === undefined) {
          rv[0][v.name] = 1;
          rv[1].push(v);
        }
        return rv;
      },
      [{} as { [key: string]: any }, [] as Array<SectionType>]
    )[1] as SectionType[];
  }

  private get fieldFormGroup(): FormGroup {
    return this.form.get('fields') as FormGroup;
  }

  private get tableFormGroups(): FormGroup {
    return this.form.get('tables') as FormGroup;
  }

  private get subsectionFormGroups(): FormGroup {
    return this.form.get('sections') as FormGroup;
  }

  private addTableForm(table: Table): TableForm {
    const tableForm = new TableForm(table, this.sectionRef.tableRef(table));
    this.tableForms.push(tableForm);
    this.tableFormGroups.addControl(table.id, tableForm.form);
    this.subscribe(tableForm);
    return tableForm;
  }

  private addFieldControl(field: Field): void {
    const fieldControl = new FieldControl(field, this.sectionRef.fieldRef(field));
    this.fieldControls.push(fieldControl);
    this.fieldFormGroup.addControl(field.id, fieldControl.control);
  }

  private addSubsectionForm(section: Section): SectionForm {
    const sectionForm = new SectionForm(section, this);
    this.subsectionForms.push(sectionForm);
    this.subsectionFormGroups.addControl(section.id, sectionForm.form);
    return sectionForm;
  }

  private buildElements(displayAnnotations: boolean): void {
    const section = this.section;

    section.fields.list().forEach((field) => this.addFieldControl(field));

    const tables = displayAnnotations ? [section.annotations, ...section.tables.list()] : section.tables.list();
    tables.forEach((table) => this.addTableForm(table));

    section.sections.list().forEach((sectionItem) => this.addSubsectionForm(sectionItem));
  }

  private findRoot(): SectionForm {
    if (this.parent === undefined) {
      return this;
    }
    return this.parent.findRoot();
  }

  private lookupSectionForm(sectionId: string): SectionForm | undefined {
    if (this.section.id === sectionId) {
      return this;
    }
    return this.subsectionForms.find((sf) => sf.lookupSectionForm(sectionId) !== undefined);
  }

  private subscribe(tableForm: TableForm): void {
    this.sb.set(
      tableForm.id,
      tableForm.structureChanges$.subscribe((event) => {
        this.form.markAsTouched();

        this.structureChanges$.next(event);
      })
    );
  }

  private unsubscribe(tableId: string): void {
    const suscription = this.sb.get(tableId);
    if (suscription) {
      suscription.unsubscribe();
    }

    this.sb.delete(tableId);
  }
}
