import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren} from '@angular/core';

import {Attribute, Feature} from '../../../shared/submission.model';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {AppConfig} from '../../../../app.config';
import {FeatureForm} from '../section-form';

@Component({
    selector: 'subm-feature-list',
    templateUrl: './feature-list.component.html',
    styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent implements AfterViewInit {
    @Input() featureForm?: FeatureForm;      //Reactive data structure for the form containing this feature
    @Input() readonly?: boolean = false;    //Flag for features that cannot be edited (e.g. sent state for submissions)
    @Input() colNames: string[] = [];       //List of allowed column names out of the list specified in the default template
    @ViewChildren('rowEl') rowEls?: QueryList<ElementRef>;

    public suggestLength: number;           //max number of suggested values to be displayed at once

    constructor(private rootEl: ElementRef, private appConfig: AppConfig) {
        this.suggestLength = appConfig.maxSuggestLength;
    }

    get columns(): Attribute[] {
        return [] //this.featureForm!.columns
    }

    get feature(): Feature {
        return this.featureForm!.feature;
    }

    //On DOM change, sets focus on first field of newly added row
    ngAfterViewInit(): void {
        this.rowEls!.changes.subscribe((rowEls) => {
            rowEls.last.nativeElement.querySelector('select, input').focus();
        });
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
     * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when
     * selecting a value without any character being typed (typically in combination with typeaheadMinLength = 0).
     * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin.
     * @param {TypeaheadMatch} selection - Object for the currently selected value.
     * @param {Attribute} column - Current column whose new key has been selected.
     */
    onSuggestSelect(selection: TypeaheadMatch, column: Attribute) {
        if (column.name != selection.value) {
            this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
            this.onFieldChange(column, selection.value, 'name');
        }
    }

    /**
     * Tests if a given column is required in terms of the UI. For example, a column may not be required
     * validation-wise but may still have to be rendered with the same styling applied to required fields.
     * @param {Attribute} attr - Attribute object corresponding to the column to be rendered.
     * @returns {boolean} True if the column has to be rendered as required.
     */
    isColUIReq(attr: Attribute) {
        return this.readonly || attr.isReadonly || attr.isRequired;
    }
}
