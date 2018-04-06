import {
    Component,
    Input,
    forwardRef,
    ElementRef, ViewChild, Output, EventEmitter
} from '@angular/core';

import {
    AsyncValidator,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR, NgModel, Validators,
} from '@angular/forms';
import {FieldControl} from "../subm-form.service";
import {TypeaheadMatch} from "ngx-bootstrap";


@Component({
    selector: 'subm-field',
    templateUrl: './subm-field.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SubmFieldComponent),
        multi: true
    }]
})
export class SubmFieldComponent implements ControlValueAccessor {
    private onChange: any = (_:any) => {};      //placeholder for handler propagating changes outside the custom control
    private onTouched: any = () => {};          //placeholder for handler after the control has been "touched"

    private _value = '';                        //internal data model for the field's value

    @Input() type: string;                      //type of field: text, date, pubmedid, orcid...
    @Input() readonly: boolean;                 //if true, the field will be rendered but its value cannot be changed
    @Input() required: boolean;                 //if true, the field must not be left blank
    @Input() formControl: FieldControl;         //reactive control associated with this field
    @Input() isSmall: boolean = true;           //flag for making the input area the same size as grid fields
    @Input() autosuggest: any[] = [];           //typeahead list of suggested values
    @Input() suggestLength: number = 30;        //max number of suggested values to be displayed at once
    @Input() suggestThreshold: number = 0;      //number of typed characters before suggestions are displayed.
                                                //a value of 0 makes typeahead behave like an auto-suggest box.

    @Output() async: EventEmitter<any> = new EventEmitter<any>();  //signals availability of asynchronous attributes

    constructor(private rootEl: ElementRef) {}

    get value() {
        return this._value;
    }

    //TODO: this is being called twice. Why?
    set value(value) {
        this._value = value;
        this.onChange(value);
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property.
     * @see {@link ControlValueAccessor}
     * @param value - Value to be stored
     */
    writeValue(value: any): void {
        if (typeof value !== 'undefined') {
            this.value = value;
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers a handler specifically for when a control receives a touch event.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler for touch events.
     */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * Handler for blur events. Removes spurious whitespaces and normalises the behaviour of the "touched" flag.
     */
    onBlur() {
        this.value = this.value.trim();
        this.onTouched();
    }

    /**
     * Lifecycle hook for operations after all child views have been changed.
     * Used to update the pointer to the DOM element.
     */
    ngAfterViewChecked(): void {
        this.formControl.nativeElement = this.rootEl.nativeElement.querySelector('.form-control');
    }

    /**
     * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
     * @param {Element} element - DOM element for the field.
     * @returns {boolean} True if the text's length is greater than its container.
     */
    private isOverflow(element: HTMLInputElement): boolean {
        return element.scrollWidth > element.clientWidth;
    }

    /**
     * Bubbles up an event for any inbound event in turn triggered by data fetched asynchronously.
     * @param data - Data retrieved asynchronously.
     */
    asyncData(data: any): void {
        this.async.emit(data);
    }

    /**
     * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when
     * selecting a value without any character being typed (typically in combination with typeaheadMinLength = 0).
     * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin. Duplicate events may occur due to the repeated calling of set value() above (cannot keep track of the last value and, by extension, can't detect change).
     * @param {TypeaheadMatch} selection - Object for the currently selected value.
     */
    onSuggestSelect(selection: TypeaheadMatch) {
        this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
    }

    /**
     * Convenience method for the equivalen date n years into the future.
     * @param {number} years - Number of years the date is incremented in.
     * @returns {Date} - Resulting date object.
     */
    nowInNyears(years: number = 0): Date {
        const currDate = new Date();
        return new Date(currDate.setFullYear(currDate.getFullYear() + years));
    }
}
