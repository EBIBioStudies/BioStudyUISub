import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectValueOptionType } from '../model';

@Component({
  selector: 'st-select-valquals-input',
  templateUrl: './select-valquals-input.component.html',
  styleUrls: ['./select-valquals-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectValqualsInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectValqualsInputComponent implements ControlValueAccessor {
  @Input() values: SelectValueOptionType[] = [];
  @Input() isInputGroup: boolean = false;
  @Input() formControl!: FormControl;
  @Input() readonly: boolean = false;
  @Input() inputId: string = '';
  searchTerm: string = '';
  selectedValue: SelectValueOptionType = { value: '', valqual: [] };

  onSelectChange(value: any): void {
    this.onChange(value);
  }

  onClose(): void {
    if (this.searchTerm.length === 0) {
      return;
    }
    this.onChange(this.selectedValue);
  }

  onSearch({ term }: { term: string }): void {
    this.searchTerm = term;
  }

  writeValue(option: any): void {
    if (typeof option == 'string') {
      option = this.values.find((value) => value.value == option);
    }
    this.selectedValue = option;
  }

  urlOf(option: SelectValueOptionType) {
    return option.valqual.find((vq) => vq.name.toLowerCase() === 'url')?.value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange: any = (_: any) => {};
  onTouched: any = (_: any) => {};
}
