import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Field, FieldType } from '../../../submission-shared/model';
import { SubmFormValidators, ErrorMessages } from '../form-validators';

export class FieldControl {
  readonly control: CustomFormControl;

  constructor(private field: Field, ref: ControlRef) {
    this.control = new CustomFormControl(field.value, SubmFormValidators.forField(field)).withRef(ref);
    this.control.valueChanges.subscribe((value) => {
      field.value = value;
    });
  }

  get errors(): string[] {
    return ErrorMessages.map(this.control);
  }

  get type(): FieldType {
    return this.field.type;
  }

  get name(): string {
    return this.field.name;
  }
}
