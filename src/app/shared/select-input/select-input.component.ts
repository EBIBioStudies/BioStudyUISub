import { Component, forwardRef, Input, ViewEncapsulation } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NgSelectOption } from '@angular/forms';

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

  writeValue(obj: any): void {
    if (this.multiple && !Array.isArray(obj)) {
      this.selectedValue = [obj];
    } else {
      this.selectedValue = obj;
    }
  }

  // placeholder for handler propagating changes outside the custom control
  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};
}
