import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { TypeaheadDirective } from 'ngx-bootstrap/typeahead';
import { ColumnControl } from '../../shared/model/column-control.model';
import { RowForm } from '../../shared/model/row-form.model';
import { FeatureForm } from '../../shared/model/feature-form.model';
import { Options as SortableOption } from 'sortablejs';

@Component({
  selector: 'st-subm-feature-grid',
  templateUrl: './feature-grid.component.html',
  styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent {
  @ViewChildren('colEl') colEls?: QueryList<ElementRef>;
  @Input() featureForm?: FeatureForm;
  hoveredRowIndex: number = -1;
  @Input() readonly = false;
  @ViewChildren('rowEl') rowEls?: QueryList<ElementRef>;
  sortableJsOptions: SortableOption = {};
  @ViewChildren('ahead') typeaheads?: QueryList<TypeaheadDirective>;


  constructor(private rootEl: ElementRef, public userData: UserData) {
    this.sortableJsOptions.onUpdate = this.onRowOrderUpdate.bind(this);
    this.sortableJsOptions.filter = '.form-control';
    this.sortableJsOptions.preventOnFilter = false;
  }

  get rows(): RowForm[] {
    return this.featureForm!.rows;
  }

  get columns(): ColumnControl[] {
    return this.featureForm!.columns;
  }

  get isSortable(): boolean {
    return this.featureForm!.rows.length > 1;
  }

  /**
   * Handler for the change event. Only save an attribute when its associated cell changes.
   * @param {Object} attrObj - Object representative of the attribute.
   * @param {string} newValue - New value for the specified attribute.
   * @param {string} [attrName = 'value'] - Name of the attribute whose value is being saved.
  */
  onFieldChange(attrObj: any, newValue: string, attrName: string = 'value') {
    attrObj[attrName] = newValue;
  }

  /**
   * Changes the values of an existing feature's row fields to those of a given a set of grid attributes,
   * bubbling a single DOM change event for all of them. Attribute names are assumed to be in lower case.
   * @param {object} data - Grid attribute data retrieved asynchronously.
   * @param {number} rowIdx - Row whose field values are to be changed.
   */
  onInputValueSelect(data: { [key: string]: string }, rowIdx: number) {
    const attrNames = Object.keys(data);
    if (attrNames.length === 0) {
      return;
    }

    attrNames.forEach(attrName => {
      const rowForm = this.featureForm!.rows[rowIdx];
      const col = this.featureForm!.columns.find(c => c.name.toLowerCase() === attrName.toLowerCase());
      if (col !== undefined) {
        rowForm.cellControlAt(col.id)!.control.setValue(data[attrName]);
      }
    });
  }

  onMouseEnterRow(rowIndex: number) {
    this.hoveredRowIndex = rowIndex;
  }

  onMouseLeaveRow() {
    this.hoveredRowIndex = -1;
  }

  onRowOrderUpdate() {
    this.featureForm!.syncModelRows();
  }
}
