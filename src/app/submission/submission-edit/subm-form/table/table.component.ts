import { Component, ElementRef, Input, QueryList, ViewChildren, OnChanges } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { TypeaheadDirective } from 'ngx-bootstrap/typeahead';
import { TableForm } from '../../shared/model/table-form.model';
import { Options as SortableOption } from 'sortablejs';

@Component({
  selector: 'st-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @ViewChildren('colEl') colEls?: QueryList<ElementRef>;
  @Input() tableForm!: TableForm;
  hoveredRowIndex: number = -1;
  @Input() readonly = false;
  @ViewChildren('rowEl') rowEls?: QueryList<ElementRef>;
  sortableJsOptions: SortableOption = {};
  @ViewChildren('ahead') typeaheads?: QueryList<TypeaheadDirective>;

  constructor(public userData: UserData) {
    this.sortableJsOptions.onUpdate = this.onRowOrderUpdate.bind(this);
    this.sortableJsOptions.filter = '.form-control';
    this.sortableJsOptions.preventOnFilter = false;
  }

  get isSortable(): boolean {
    return !this.isReadOnly && this.tableForm!.rows.length > 1;
  }

  get isReadOnly(): boolean {
    return Boolean(this.readonly || this.tableForm?.isReadonly);
  }

  ngOnChanges(): void {
    this.sortableJsOptions = { ...this.sortableJsOptions, disabled: this.isReadOnly };
  }

  /**
   * Handler for the change event. Only save an attribute when its associated cell changes.
   * @param attrObj - Object representative of the attribute.
   * @param newValue - New value for the specified attribute.
   * @param [attrName = 'value'] - Name of the attribute whose value is being saved.
   */
  onFieldChange(attrObj: any, newValue: string, attrName: string = 'value'): void {
    attrObj[attrName] = newValue;
  }

  /**
   * Changes the values of an existing tables's row fields to those of a given a set of grid attributes,
   * bubbling a single DOM change event for all of them. Attribute names are assumed to be in lower case.
   * @param data - Grid attribute data retrieved asynchronously.
   * @param rowIdx - Row whose field values are to be changed.
   */
  onInputValueSelect(data: { [key: string]: string }, rowIdx: number): void {
    const attrNames = Object.keys(data);
    if (attrNames.length === 0) {
      return;
    }

    attrNames.forEach((attrName) => {
      const rowForm = this.tableForm.rows[rowIdx];
      const col = this.tableForm.columns.find((c) => c.name.toLowerCase() === attrName.toLowerCase());

      if (col !== undefined) {
        const cellControl = rowForm.cellControlAt(col.id);

        if (cellControl) {
          cellControl.control.setValue(data[attrName]);
        }
      }
    });
  }

  onMouseEnterRow(rowIndex: number): void {
    this.hoveredRowIndex = rowIndex;
  }

  onMouseLeaveRow(): void {
    this.hoveredRowIndex = -1;
  }

  onRowOrderUpdate(): void {
    this.tableForm.syncModelRows();
  }
}
