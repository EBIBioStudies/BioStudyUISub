import { Component, forwardRef, Input, ViewEncapsulation } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { isNotDefinedOrEmpty } from 'app/utils';

@Component({
  selector: 'st-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectInputComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() values: string[] = [];
  @Input() multiple: boolean = false;
  @Input() isInputGroup: boolean = false;
  @Input() formControl!: FormControl;
  @Input() readonly: boolean = false;
  @Input() inputId: string = '';
  selectedValue: string | string[] = '';

  addValue(value: string): string {
    return value;
  }

  onSelectChange(value: string | string[]): void {
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string | string[]): void {
    const filterEmptyValues = (collection) => collection.filter((item) => !isNotDefinedOrEmpty(item));
    const formattedValue = Array.isArray(value) ? filterEmptyValues(value) : value;

    if (!this.multiple && !Array.isArray(formattedValue) && !isNotDefinedOrEmpty(formattedValue)) {
      this.selectedValue = formattedValue;
    }

    if (this.multiple && !Array.isArray(formattedValue) && !isNotDefinedOrEmpty(formattedValue)) {
      this.selectedValue = [formattedValue];
    }

    if (this.multiple && Array.isArray(value) && formattedValue.length > 0) {
      this.selectedValue = formattedValue;
    }
  }

  // placeholder for handler propagating changes outside the custom control
  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};
}
