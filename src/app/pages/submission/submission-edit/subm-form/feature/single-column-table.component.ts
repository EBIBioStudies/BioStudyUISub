import { Component, Input } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { ColumnControl } from '../../shared/model/column-control.model';
import { FeatureForm } from '../../shared/model/feature-form.model';

@Component({
  selector: 'st-single-column-table',
  templateUrl: './single-column-table.component.html',
  styleUrls: ['./single-column-table.component.css']
})
export class SingleColumnTableComponent {
  @Input() tableForm!: FeatureForm; // Reactive data structure for the form containing this feature
  @Input() readonly?: boolean = false; // Flag for features that cannot be edited (e.g. sent state for submissions)

  suggestLength: number; // max number of suggested values to be displayed at once

  constructor(private appConfig: AppConfig) {
    this.suggestLength = this.appConfig.maxSuggestLength;
  }

  get columns(): ColumnControl[] {
    return this.tableForm.columns;
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
   * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when
   * selecting a value without any character being typed (typically in combination with typeaheadMinLength = 0).
   * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin.
   * @param {TypeaheadMatch} selection - Object for the currently selected value.
   * @param {Attribute} column - Current column whose new key has been selected.
   */
  /*onSuggestSelect(selection: TypeaheadMatch, column: Attribute) {
    if (column.name != selection.value) {
      this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
      this.onFieldChange(column, selection.value, 'name');
    }
  }*/
}
