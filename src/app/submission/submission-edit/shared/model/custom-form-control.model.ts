import { FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';
import { ControlRef } from '../control-reference';

export class CustomFormControl extends FormControl {
  ref: ControlRef = ControlRef.unknown;

  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  static compareBySectionId = (c1: FormControl, c2: FormControl) => {
    if (c1 instanceof CustomFormControl && c2 instanceof CustomFormControl) {
      return c1.ref.sectionId.localeCompare(c2.ref.sectionId);
    } else if (c1 instanceof CustomFormControl) {
      return 1;
    } else if (c2 instanceof CustomFormControl) {
      return -1;
    }
    return 0;
  };

  withRef(ref: ControlRef): CustomFormControl {
    this.ref = ref;
    return this;
  }
}
