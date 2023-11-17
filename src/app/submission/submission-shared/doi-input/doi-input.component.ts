import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldType } from '../model';

@Component({
  selector: 'st-doi-input',
  templateUrl: './doi-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DoiInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class DoiInputComponent implements ControlValueAccessor, OnInit {
  @Input() formControl!: FormControl;
  @Input() fieldType?: FieldType;
  @Input() readonly: boolean = false;
  @Input() value!: string;
  isChecked: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isChecked = this?.value?.toLowerCase() === 'true';
  }

  writeValue(value: string): void {
    this.isChecked = value.toLowerCase() === 'true';
    this.onChange(this.isChecked ? 'true' : '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // placeholder for handler propagating changes outside the custom control
  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};
}
