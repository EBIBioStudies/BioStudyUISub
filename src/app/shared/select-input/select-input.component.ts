import { Component, forwardRef, Input, ViewEncapsulation } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { isNotDefinedOrEmpty } from 'app/utils';

@Component({
  selector: 'st-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css'],
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
    if (!this.multiple && !isNotDefinedOrEmpty(value as string)) {
      this.selectedValue = value;
    }

    if (this.multiple && !Array.isArray(value) && !isNotDefinedOrEmpty(value)) {
      this.selectedValue = [value];
    }

    if (this.multiple && value.length > 0) {
      this.selectedValue = (value as string[]).filter((valueItem) => !isNotDefinedOrEmpty(valueItem));
    }
  }

  // placeholder for handler propagating changes outside the custom control
  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};
}
