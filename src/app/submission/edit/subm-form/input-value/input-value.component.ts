import {Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';

import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgModel, Validators} from '@angular/forms';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {AppConfig} from '../../../../app.config';


@Component({
    selector: 'input-value',
    templateUrl: './input-value.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputValueComponent),
        multi: true
    }]
})
export class InputValueComponent implements ControlValueAccessor {
    private onChange: any = (_: any) => {
    };      //placeholder for handler propagating changes outside the custom control
    private onTouched: any = () => {
    };          //placeholder for handler after the control has been "touched"

    private _value = '';                        //internal data model for the field's value

    @Input() type?: string;                      //type of field: text, date, pubmedid, orcid...
    @Input() readonly: boolean = false;                 //if true, the field will be rendered but its value cannot be changed
    @Input() required: boolean = false;                 //if true, the field must not be left blank
    @Input() allowPast: boolean = false;                //if true, allows past dates for calendar fields
    @Input() formControl?: FormControl;         //reactive control associated with this field
    @Input() isSmall: boolean = true;           //flag for making the input area the same size as grid fields
    @Input() autosuggest: any[] = [];           //typeahead list of suggested values
    @Input() suggestLength: number;             //max number of suggested values to be displayed at once
    @Input() suggestThreshold: number = 0;      //number of typed characters before suggestions are displayed.
                                                //a value of 0 makes typeahead behave like an auto-suggest box.

    @Output() async: EventEmitter<any> = new EventEmitter<any>();  //signals availability of asynchronous attributes

    @ViewChild(NgModel) private inputModel?: NgModel;

    /**
     * Sets the max number of suggestions shown at any given time.
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     * @param {ElementRef} rootEl - Reference to the component's wrapping element.
     */
    constructor(private rootEl: ElementRef, private appConfig: AppConfig) {
        this.suggestLength = appConfig.maxSuggestLength;
    }

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
     * Handler for blur events. Normalises the behaviour of the "touched" flag.
     */
    onBlur() {
        this.onTouched();
    }

    /**
     * Lifecycle hook for operations after all child views have been initialised. It merges all validators of
     * the actual input and the wrapping component.
     */
    ngAfterViewInit() {
        const control = this.formControl;

        control!.setValidators(Validators.compose([control!.validator, this.inputModel!.control.validator]));
        control!.setAsyncValidators(Validators.composeAsync([control!.asyncValidator, this.inputModel!.control.asyncValidator]));
    }

    /**
     * Lifecycle hook for operations after all child views have been changed.
     * Used to update the pointer to the DOM element.
     */
    ngAfterViewChecked(): void {
        this.formControl!.nativeElement = this.rootEl.nativeElement.querySelector('.form-control');
    }

    /**
     * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
     * @param {HTMLElement} formEl - DOM element for the field control.
     * @returns {boolean} True if the text's length is greater than its container.
     */
    isOverflow(formEl: HTMLElement | undefined = this.formControl!.nativeElement): boolean {
        return (formEl && formEl.scrollWidth > formEl.clientWidth) === true;
    }

    /**
     * Bubbles up an event for any inbound event in turn triggered by data fetched asynchronously.
     * @param data - Data retrieved asynchronously.
     */
    asyncData(data: any): void {
        this.async.emit(data);
    }

    /**
     * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when selecting
     * a value without any character being typed (typically in combination with typeaheadMinLength = 0).
     * The closest input element descendant will be the event's target.
     * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin. Duplicate events may occur due to the repeated calling of "set value(value)" above (cannot keep track of the last value and, by extension, can't detect change).
     * @param {TypeaheadMatch} selection - Object for the currently selected value.
     */
    onSuggestSelect(selection: TypeaheadMatch) {
        this.rootEl.nativeElement.getElementsByTagName('input')[0].dispatchEvent(new Event('change', {bubbles: true}));
    }

    /**
     * Convenience method for the equivalen date n years into the future.
     * @param {number} years - Number of years the date is incremented in.
     * @returns {Date} - Resulting date object.
     */
    nowInNyears(years: number = this.appConfig.maxDateYears): Date {
        const currDate = new Date();
        return new Date(currDate.setFullYear(currDate.getFullYear() + years));
    }
}