import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import {
  ValueType,
  ValueTypeFactory,
  ValueTypeName,
  SelectValueType, DateValueType
} from 'app/pages/submission/submission-shared/model/templates';
import { typeaheadSource } from '../shared/typeahead.utils';

@Component({
  selector: 'st-input-value',
  templateUrl: './input-value.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputValueComponent,
    multi: true
  }]
})
export class InputValueComponent implements ControlValueAccessor {
  @Input() autosuggest: boolean = true;
  @Input() formControl?: FormControl;
  @Input() inputId: string = '';
  @Input() isSmall: boolean = true;
  @Input() readonly: boolean = false;
  @Input() suggestThreshold: number = 0;
  @Input() valueType: ValueType = ValueTypeFactory.DEFAULT;
  @Output() inputValueSelect = new EventEmitter<{ [key: string]: string }>();
  suggestLength: number;
  readonly valueTypeNameEnum = ValueTypeName;

  private inputValue = '';
  private valueChanges$: Subject<string> = new BehaviorSubject<string>('');

  /*
    @Input() suggestLength: number;             //max number of suggested values to be displayed at once
    @Input() suggestThreshold: number = 0;      //number of typed characters before suggestions are displayed.
  */
  // a value of 0 makes typeahead behave like an auto-suggest box.
  constructor(private appConfig: AppConfig) {
    this.suggestLength = appConfig.maxSuggestLength;
  }

  get value(): string {
    return this.inputValue;
  }

  set value(value) {
    this.inputValue = value;
    this.onChange(value);
  }

  get allowPast(): boolean {
    return (this.valueType as DateValueType).allowPast;
  }

  @Input() autosuggestSource: () => string[] = () => [];

  /**
   * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
   * @returns True if the text's length is greater than its container.
   */
  isOverflow(): boolean {
    // return (formEl && formEl.scrollWidth > formEl.clientWidth) === true;
    return false;
  }

  /**
   * Convenience method for the equivalen date n years into the future.
   * @param years - Number of years the date is incremented in.
   * @returns Resulting date object.
   */
  nowInNyears(years: number = this.appConfig.maxDateYears): Date {
    const currDate = new Date();
    return new Date(currDate.setFullYear(currDate.getFullYear() + years));
  }

  onBlur(): void {
    this.onTouched();
  }

  onChange: any = (_: any) => {};

  onKeyDown(): void {
    this.valueChanges$.next(this.value);
  }

  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Bubbles up an event for any inbound event in turn triggered by data fetched asynchronously.
   * @param data - Data retrieved asynchronously.
   */
  selectData(data: { [key: string]: string }): void {
    this.inputValueSelect.emit(data);
  }

  typeahead(): Observable<string[]> {
    if (this.readonly || !this.autosuggest) {
      return of([]);
    }

    return typeaheadSource(() => {
      return this.autosuggestValues();
    }, this.valueChanges$);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  private autosuggestValues(): string[] {
    if (this.valueType.is(ValueTypeName.select)) {
      return (this.valueType as SelectValueType).values;
    }
    return this.autosuggestSource();
  }
}
