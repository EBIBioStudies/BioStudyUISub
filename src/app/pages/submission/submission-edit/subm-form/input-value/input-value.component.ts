import { Component, EventEmitter, forwardRef, Input, Output, AfterViewChecked } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import {
    ValueType,
    ValueTypeFactory,
    ValueTypeName,
    SelectValueType, DateValueType
} from 'app/pages/submission/submission-shared/model/templates';
import { typeaheadSource } from '../../shared/typeahead.utils';


@Component({
    selector: 'st-input-value',
    templateUrl: './input-value.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputValueComponent),
        multi: true
    }]
})
export class InputValueComponent implements ControlValueAccessor, AfterViewChecked {
    @Input() autosuggest: boolean = true;
    @Input() formControl?: FormControl;
    @Input() isSmall: boolean = true;
    @Input() readonly: boolean = false;
    @Output() select = new EventEmitter<{ [key: string]: string }>();
    suggestLength: number;
    @Input() suggestThreshold: number = 0;
    @Input() valueType: ValueType = ValueTypeFactory.DEFAULT;
    readonly valueTypeNameEnum = ValueTypeName;

    private _value = '';
    private valueChanges$: Subject<string> = new BehaviorSubject<string>('');

    /*
        @Input() suggestLength: number;             //max number of suggested values to be displayed at once
        @Input() suggestThreshold: number = 0;      //number of typed characters before suggestions are displayed.
    */
    // a value of 0 makes typeahead behave like an auto-suggest box.
    constructor(private appConfig: AppConfig) {
        this.suggestLength = appConfig.maxSuggestLength;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.onChange(value);
    }

    get allowPast(): boolean {
        return (<DateValueType>this.valueType).allowPast;
    }

    @Input() autosuggestSource: () => string[] = () => [];

    /**
     * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
     * @returns {boolean} True if the text's length is greater than its container.
     */
    isOverflow(): boolean {
        // return (formEl && formEl.scrollWidth > formEl.clientWidth) === true;
        return false;
    }

    /**
     * Lifecycle hook for operations after all child views have been changed.
     * Used to update the pointer to the DOM element.
     */
    ngAfterViewChecked(): void {
        // this.formControl!.nativeElement = this.rootEl.nativeElement.querySelector('.form-control');
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

    onBlur() {
        this.onTouched();
    }

    onKeyDown() {
        this.valueChanges$.next(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * Bubbles up an event for any inbound event in turn triggered by data fetched asynchronously.
     * @param data - Data retrieved asynchronously.
     */
    selectData(data: { [key: string]: string }): void {
        this.select.emit(data);
    }

    typeahead(): Observable<string[]> {
        if (this.readonly || !this.autosuggest) {
            return of([]);
        }

        return typeaheadSource(() => {
            return this.autosuggestValues();
        }, this.valueChanges$);
    }

    /**
     * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when selecting
     * a value without any character being typed (typically in combination with typeaheadMinLength = 0).
     * The closest input element descendant will be the event's target.
     * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin. Duplicate events may occur due to the
     * repeated calling of "set value(value)" above (cannot keep track of the last value and, by extension, can't detect change).
     * @param {TypeaheadMatch} selection - Object for the currently selected value.
     */

    /* onSuggestSelect(selection: TypeaheadMatch) {
         // this.rootEl.nativeElement.getElementsByTagName('input')[0].dispatchEvent(new Event('change', {bubbles: true}));
     }*/

    writeValue(value: any): void {
        if (value !== undefined) {
            this.value = value;
        }
    }

    private autosuggestValues(): string[] {
        if (this.valueType.is(ValueTypeName.select)) {
            return (<SelectValueType>this.valueType).values;
        }
        return this.autosuggestSource();
    }

    private onChange: any = (_: any) => { };
    private onTouched: any = () => { };
}
