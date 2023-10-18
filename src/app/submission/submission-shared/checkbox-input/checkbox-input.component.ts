import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldType } from '../model';

@Component({
  selector: 'st-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CheckboxInputComponent implements ControlValueAccessor, OnInit {
  @Input() formControl!: FormControl;
  @Input() fieldType?: FieldType;
  @Input() readonly: boolean = false;
  isChecked: boolean = false;

  constructor() {}

  ngOnInit(): void {}

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
