import { FormGroup } from '@angular/forms';
import { fromNullable } from 'fp-ts/lib/Option';
import { CellControl } from './cell-control.model';
import { ControlGroupRef } from '../control-reference';
import { ValueMap, Attribute } from '../../../submission-shared/model';

export class RowForm {
  readonly form: FormGroup;
  readonly row: ValueMap;
  private controls: Map<string, CellControl> = new Map();
  private parentRef: ControlGroupRef;

  constructor(row: ValueMap, columns: Attribute[], parentRef: ControlGroupRef) {
    this.row = row;
    this.parentRef = parentRef;
    this.form = new FormGroup({});
    columns.forEach((column) => this.addCellControl(column));
  }

  addCellControl(column: Attribute): void {
    const cellControl = new CellControl(
      this.row.valueFor(column.id),
      column,
      this.parentRef.rowValueRef(column, this.row.id)
    );
    this.form.addControl(column.id, cellControl.control);
    this.controls.set(column.id, cellControl);
  }

  cellControlAt(columnId: string): CellControl | undefined {
    return this.controls.get(columnId);
  }

  errorsAt(columnId: string): string[] {
    return fromNullable(this.cellControlAt(columnId))
      .map((c) => c.errors)
      .getOrElse([]);
  }

  hasErrorsAt(columnId: string): boolean {
    return fromNullable(this.cellControlAt(columnId))
      .map((c) => c.hasErrors)
      .getOrElse(false);
  }

  removeCellControl(columnId: string): void {
    this.form.removeControl(columnId);
    this.controls.delete(columnId);
  }
}
