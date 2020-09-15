import { Subject, Observable } from 'rxjs';
import pluralize from 'pluralize';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  Attribute,
  ColumnType,
  Feature,
  FeatureType,
  ValueMap
} from 'app/pages/submission/submission-shared/model';
import { isArrayEmpty, arrayUniqueValues, isStringEmpty } from 'app/utils';
import { FormBase } from './form-base.model';
import { ColumnControl } from './column-control.model';
import { RowForm } from './row-form.model';
import { ControlGroupRef } from '../control-reference';
import { MyFormGroup, SubmFormValidators } from '../form-validators';
import { CellControl } from './cell-control.model';
import { StructureChangeEvent } from '../structure-change-event';

export class FeatureForm extends FormBase {
  columnNamesAvailableCached: string[] = [];
  structureChanges$: Subject<StructureChangeEvent> = new Subject<StructureChangeEvent>();

  private cellValueTypeahead: Map<string, () => string[]> = new Map();
  private columnControls: ColumnControl[] = [];
  private rowForms: RowForm[] = [];

  constructor(private feature: Feature, private featureRef: ControlGroupRef) {
    super(new FormGroup({
      columns: new MyFormGroup({}, SubmFormValidators.forFeatureColumns(feature)).withRef(featureRef),
      rows: new FormArray([])
    }));

    feature.columns.forEach(column => this.addColumnControl(column));

    feature.rows.forEach(row => {
      this.addRowForm(row, feature.columns);
    });

    this.columnsForm.valueChanges.subscribe(() => {
      this.columnNamesAvailableCached = this.columnNamesAvailable();
    });

    this.columnNamesAvailableCached = this.columnNamesAvailable();
  }

  private get columnsForm(): FormGroup {
    return this.form.get('columns') as FormGroup;
  }

  private get rowFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get isEmpty(): boolean {
    return this.feature.isEmpty;
  }

  get canHaveMultipleRows(): boolean {
    return !this.feature.singleRow;
  }

  get hasUniqueColumns(): boolean {
    return this.feature.type.uniqueCols;
  }

  get columnTypes(): ColumnType[] {
    return this.feature.type.columnTypes;
  }

  get columnNames(): string[] {
    return this.feature.colNames;
  }

  get featureType(): FeatureType {
    return this.feature.type;
  }

  get id(): string {
    return this.feature.id;
  }

  get prettyName(): string {
    const isSingleElementFeature =
      this.feature.singleRow &&
      this.feature.colSize() === 1 &&
      !this.canHaveMoreColumns();

    const name = this.feature.typeName.replace(/([A-Z])/g, ' $1');
    return (isSingleElementFeature ? name : pluralize(name));
  }

  get featureTypeName(): string {
    return this.feature.typeName;
  }

  get isRequired(): boolean {
    return this.feature.type.displayType.isRequired;
  }

  get isRemovable(): boolean {
    return this.feature.type.displayType.isRemovable;
  }

  get isReadonly(): boolean {
    return this.feature.type.displayType.isReadonly;
  }

  get icon(): string {
    return this.feature.type.icon;
  }

  get description(): string {
    return this.feature.type.description;
  }

  get rows(): RowForm[] {
    return this.rowForms;
  }

  get columns(): ColumnControl[] {
    return this.columnControls;
  }

  get colTypeNames(): string[] {
    return this.columnTypes
      .filter(type => !type.displayType.isReadonly)
      .map(type => type.name);
  }

  get requiredGroups(): string[] {
    return this.feature.groups.length > 0 ? this.feature.groups[0].map(f => f.typeName) : [];
  }

  get hasRequiredGroups(): boolean {
    return this.requiredGroups.length > 0;
  }

  get scrollToTheLastControl(): FormControl | undefined {
    if (isArrayEmpty(this.rowForms) || isArrayEmpty(this.columnControls)) {
      return undefined;
    }

    const rowForm = this.rowForms[this.rowForms.length - 1];
    const firstColumn = this.columnControls[0].id;
    const lastColumn = this.columnControls[this.columnControls.length - 1].id;

    if (this.canHaveMultipleRows) {
      const firstColumnCell = rowForm.cellControlAt(firstColumn);

      return firstColumnCell ? firstColumnCell.control : undefined;
    }

    const lastColumnCell = rowForm.cellControlAt(lastColumn);

    return lastColumnCell ? lastColumnCell.control : undefined;
  }

  addColumn(): void {
    if (this.canAddColumn()) {
      const column = this.feature.addColumn();
      this.addColumnControl(column);
      this.rowForms.forEach(rf => rf.addCellControl(column));
      this.notifiyChanges(StructureChangeEvent.featureColumnAdd);
    }
  }

  addEntry(): void {
    this.addRow();

    if (!this.canHaveMultipleRows) {
      this.addColumn();
    }
  }

  addRow(): void {
    const row = this.feature.addRow();

    if (this.canAddRow() && row) {
      this.addRowForm(row, this.feature.columns);
      this.notifiyChanges(StructureChangeEvent.featureRowAdd);
    }
  }

  canAddColumn(): boolean {
    return !this.isReadonly && this.canHaveMoreColumns();
  }

  canAddRow(): boolean {
    return !this.isReadonly && this.feature.canAddRow();
  }

  canHaveMoreColumns(): boolean {
    return this.featureType.allowCustomCols
      || !this.featureType.uniqueCols
      || this.feature.colSize() < this.featureType.columnTypes.length;
  }

  canRemoveColumn(columnCtrl: ColumnControl): boolean {
    return !this.isReadonly && columnCtrl.isRemovable;
  }

  canRemoveRow(): boolean {
    return !this.isReadonly && (!this.featureType.displayType.isShownByDefault || this.feature.rowSize() > 1);
  }

  cellControlAt(rowIndex: number, columnId: string): CellControl | undefined {
    return this.rowForms[rowIndex].cellControlAt(columnId);
  }

  /* returns list of current values for a column, excludes value in the current row */
  cellValues(rowIndex: number, columnId: string): string[] {
    const skipRow = this.rowForms[rowIndex];
    const allCellValues =  this.rowForms
      .filter(row => row !== skipRow)
      .map(row => row.cellControlAt(columnId))
      .filter(c => c !== undefined)
      .map(c => c!.control.value)
      .filter((v: string) => !isStringEmpty(v));

    return arrayUniqueValues(allCellValues);
  }

  cellValuesTypeaheadFunc(rowIndex: number, columnId: string): (() => string[]) | undefined {
    const key = `${rowIndex}_${columnId}`;
    if (!this.cellValueTypeahead.has(key)) {
      this.cellValueTypeahead.set(key, () => {
        return this.cellValues(rowIndex, columnId);
      });
    }

    const cellValue = this.cellValueTypeahead.get(key);

    return cellValue ? cellValue : undefined;
  }

  /* returns a list of column names available for a new column to add */
  columnNamesAvailable = () => {
    if (this.hasUniqueColumns) {
      const colNames = this.columnNames;
      return this.colTypeNames.filter(name => !colNames.includes(name));
    }
    return this.colTypeNames;
  }

  columnNamesTypeahead(column: ColumnControl): Observable<string[]> {
    return column.typeaheadSource(this.columnNamesAvailable);
  }

  notifiyChanges(event: StructureChangeEvent): void {
    this.structureChanges$.next(event);
  }

  removeColumn(columnCtrl: ColumnControl): void {
    if (this.canRemoveColumn(columnCtrl)) {
      this.feature.removeColumn(columnCtrl.id);
      this.removeColumnControl(columnCtrl.id);
      this.rowForms.forEach(rf => rf.removeCellControl(columnCtrl.id));
      this.notifiyChanges(StructureChangeEvent.featureColumnRemove);
    }
  }

  removeRow(rowIndex: number): void {
    if (this.canRemoveRow()) {
      this.feature.removeRowAt(rowIndex);
      this.removeRowForm(rowIndex);
      this.notifiyChanges(StructureChangeEvent.featureRowRemove);
    }
  }

  syncModelRows(): void {
    const fromRows = this.rowForms.map((rowForm) => rowForm.row);
    this.feature.patchRows(fromRows);
    this.notifiyChanges(StructureChangeEvent.featureRowOrderUpdate);
  }

  private addColumnControl(column: Attribute): void {
    const colControl = new ColumnControl(column, this.featureRef.columnRef(column));
    this.columnControls.push(colControl);
    this.columnsForm.addControl(column.id, colControl.control);
  }

  private addRowForm(row: ValueMap, columns: Attribute[]): void {
    const rowForm = new RowForm(row, columns, this.featureRef);
    this.rowForms.push(rowForm);
    this.rowFormArray.push(rowForm.form);
  }

  private removeColumnControl(columnId: string): void {
    const index = this.columnControls.findIndex(c => c.id === columnId);
    this.columnControls.splice(index, 1);
    this.columnsForm.removeControl(columnId);
  }

  private removeRowForm(rowIndex: number): void {
    this.rowForms.splice(rowIndex, 1);
    this.rowFormArray.removeAt(rowIndex);
  }
}
