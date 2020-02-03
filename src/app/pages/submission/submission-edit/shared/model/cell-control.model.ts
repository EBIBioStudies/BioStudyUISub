import { Attribute, AttributeValue } from 'app/pages/submission/submission-shared/model';
import { ControlRef } from '../control-reference';
import { CustomFormControl } from '../model/custom-form-control.model';
import { SubmFormValidators, ErrorMessages } from '../form-validators';

export class CellControl {
  readonly control: CustomFormControl;

  constructor(attrValue: AttributeValue, column: Attribute, ref: ControlRef) {
    this.control = new CustomFormControl(attrValue.value, SubmFormValidators.forCell(column)).withRef(ref);
    this.control.valueChanges.subscribe(value => attrValue.value = value);
  }

  get errors(): string[] {
    return ErrorMessages.map(this.control);
  }

  get hasErrors(): boolean {
    return this.control.invalid && this.control.touched;
  }
}
