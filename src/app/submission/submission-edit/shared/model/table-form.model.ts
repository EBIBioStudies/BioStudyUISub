import { CustomFormControl } from './custom-form-control.model';
import { Subject, Observable } from 'rxjs';
import pluralize from 'pluralize';
import { FormGroup, FormArray } from '@angular/forms';
import { Attribute, ColumnType, Table, TableType, ValueMap } from 'app/submission/submission-shared/model';
import { isStringEmpty } from 'app/utils/validation.utils';
import { arrayUniqueValues } from 'app/utils/array.utils';
import { isArrayEmpty } from 'app/utils/validation.utils';
import { FormBase } from './form-base.model';
import { ColumnControl } from './column-control.model';
import { RowForm } from './row-form.model';
import { ControlGroupRef } from '../control-reference';
import { MyFormGroup, SubmFormValidators } from '../form-validators';
import { CellControl } from './cell-control.model';
import { StructureChangeEvent } from '../structure-change-event';

export class TableForm extends FormBase {
  columnNamesAvailableCached: string[] = [];
  structureChanges$: Subject<StructureChangeEvent> = new Subject<StructureChangeEvent>();

  private cellValueTypeahead: Map<string, () => string[]> = new Map();
  private columnControls: ColumnControl[] = [];
  private rowForms: RowForm[] = [];

  constructor(private table: Table, private tableRef: ControlGroupRef) {
    super(
      new FormGroup({
        columns: new MyFormGroup({}, SubmFormValidators.forTableColumns(table)).withRef(tableRef),
        rows: new FormArray([])
      })
    );

    table.columns.forEach((column) => this.addColumnControl(column));

    table.rows.forEach((row) => {
      this.addRowForm(row, table.columns);
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

  get allowImport(): boolean {
    return this.table.type.allowImport;
  }

  get isEmpty(): boolean {
    return this.table.isEmpty;
  }

  get canHaveMultipleRows(): boolean {
    return !this.table.singleRow;
  }

  get hasUniqueColumns(): boolean {
    return this.table.type.uniqueCols;
  }

  get columnTypes(): ColumnType[] {
    return this.table.type.columnTypes;
  }

  get columnNames(): string[] {
    return this.table.colNames;
  }

  get tableType(): TableType {
    return this.table.type;
  }

  get id(): string {
    return this.table.id;
  }

  get prettyName(): string {
    const isSingleElementTable = this.table.singleRow && this.table.colSize() === 1 && !this.canHaveMoreColumns();

    const name = this.table.typeName.replace(/([A-Z])/g, ' $1');
    return isSingleElementTable ? name : pluralize(name);
  }

  get tableTypeName(): string {
    return this.table.typeName;
  }

  get isRequired(): boolean {
    return this.table.type.displayType.isRequired;
  }

  get isRemovable(): boolean {
    return this.table.type.displayType.isRemovable;
  }

  get isReadonly(): boolean {
    return this.table.readonly;
  }

  get icon(): string {
    return this.table.type.icon;
  }

  get description(): string {
    return this.table.type.description;
  }

  get rows(): RowForm[] {
    return this.rowForms;
  }

  get columns(): ColumnControl[] {
    return this.columnControls;
  }

  get colTypeNames(): string[] {
    return this.columnTypes.filter((type) => !type.displayType.isReadonly).map((type) => type.name);
  }

  get requiredGroups(): string[] {
    return this.table.groups.length > 0 ? this.table.groups[0].map((f) => f.typeName) : [];
  }

  get hasRequiredGroups(): boolean {
    return this.requiredGroups.length > 0;
  }

  get scrollToTheLastControl(): CustomFormControl | undefined {
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

  addColumn(name?: string): void {
    if (this.canAddColumn()) {
      const column = this.table.addColumn(name);
      this.addColumnControl(column);
      this.rowForms.forEach((rf) => rf.addCellControl(column));
      this.notifyChanges(StructureChangeEvent.tableColumnAdd);
    }
  }

  addEntry(): void {
    this.addRow();

    if (!this.canHaveMultipleRows) {
      this.addColumn();
    }
  }

  addRow(): void {
    if (this.canAddRow()) {
      const row = this.table.addRow();

      this.addRowForm(row, this.table.columns);
      this.notifyChanges(StructureChangeEvent.tableRowAdd);
    }
  }

  addRowWithData(rowCells: string[], header: string[]): void {
    if (this.canAddRow()) {
      const row = this.table.addRow();

      if (header.length > 0) {
        header.forEach((column, index) => {
          const cellData = rowCells[index];
          const col = this.table.findColumnByName(column);
          const colId = col?.id || '';

          row.update(colId, cellData);
        });
      } else {
        rowCells.forEach((cellData, index) => {
          const col = this.table.columns[index];
          const colId = col?.id || '';

          row.update(colId, cellData);
        });
      }

      this.addRowForm(row, this.table.columns);
      this.notifyChanges(StructureChangeEvent.tableRowAdd);
    }
  }

  canAddColumn(): boolean {
    return !this.isReadonly && this.canHaveMoreColumns();
  }

  canAddRow(): boolean {
    return !this.isReadonly && this.table.canAddRow();
  }

  canHaveMoreColumns(): boolean {
    return (
      this.tableType.allowCustomCols ||
      !this.tableType.uniqueCols ||
      this.table.colSize() < this.tableType.columnTypes.length
    );
  }

  canRemoveColumn(columnCtrl: ColumnControl): boolean {
    return !this.isReadonly && columnCtrl.isRemovable;
  }

  canRemoveRow(): boolean {
    return !this.isReadonly && (!this.tableType.displayType.isRequired || this.table.rowSize() > 1);
  }

  cellControlAt(rowIndex: number, columnId: string): CellControl | undefined {
    return this.rowForms[rowIndex].cellControlAt(columnId);
  }

  /* returns list of current values for a column, excludes value in the current row */
  cellValues(rowIndex: number, columnId: string): string[] {
    const skipRow = this.rowForms[rowIndex];
    const allCellValues = this.rowForms
      .filter((row) => row !== skipRow)
      .map((row) => row.cellControlAt(columnId))
      .filter((c) => c !== undefined)
      .map((c) => c!.control.value)
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
      return this.colTypeNames.filter((name) => !colNames.includes(name));
    }
    return this.colTypeNames;
  };

  columnNamesTypeahead(column: ColumnControl): Observable<string[]> {
    return column.typeaheadSource(this.columnNamesAvailable);
  }

  reset(): void {
    this.table.patchRows([]);
    this.rowForms = [];
    this.form.controls.rows = new FormArray([]);

    this.notifyChanges(StructureChangeEvent.tableReset);
  }

  notifyChanges(event: StructureChangeEvent): void {
    this.structureChanges$.next(event);
  }

  hasColumn(name: string): boolean {
    return this.table.columns.some((column) => column.name.toLowerCase() === name.toLowerCase());
  }

  removeColumn(columnCtrl: ColumnControl): void {
    if (this.canRemoveColumn(columnCtrl)) {
      this.table.removeColumn(columnCtrl.id);
      this.removeColumnControl(columnCtrl.id);
      this.rowForms.forEach((rf) => rf.removeCellControl(columnCtrl.id));
      this.notifyChanges(StructureChangeEvent.tableColumnRemove);
    }
  }

  removeRow(rowIndex: number): void {
    if (this.canRemoveRow()) {
      this.table.removeRowAt(rowIndex);
      this.removeRowForm(rowIndex);
      this.notifyChanges(StructureChangeEvent.tableRowRemove);
    }
  }

  syncModelRows(): void {
    const fromRows = this.rowForms.map((rowForm) => rowForm.row);
    this.table.patchRows(fromRows);
    this.notifyChanges(StructureChangeEvent.tableRowOrderUpdate);
  }

  private addColumnControl(column: Attribute): void {
    const colControl = new ColumnControl(column, this.tableRef.columnRef(column));
    this.columnControls.push(colControl);
    this.columnsForm.addControl(column.id, colControl.control);
  }

  private addRowForm(row: ValueMap, columns: Attribute[]): void {
    const rowForm = new RowForm(row, columns, this.tableRef);
    this.rowForms = [...this.rowForms, rowForm];
    this.rowFormArray.push(rowForm.form);
  }

  private removeColumnControl(columnId: string): void {
    const index = this.columnControls.findIndex((c) => c.id === columnId);
    this.columnControls.splice(index, 1);
    this.columnsForm.removeControl(columnId);
  }

  private removeRowForm(rowIndex: number): void {
    const tempArray = this.rowForms.slice();
    tempArray.splice(rowIndex, 1);

    this.rowForms = tempArray;
    this.rowFormArray.removeAt(rowIndex);
  }
}
