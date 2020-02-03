import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Attribute, Feature, Field } from 'app/pages/submission/submission-shared/model';
import { TextValueType, ValueType, ValueTypeName, SelectValueType } from 'app/pages/submission/submission-shared/model';
import { parseDate, isOrcidValid } from 'app/utils';
import { ControlRef, ControlGroupRef } from './control-reference';
import { CustomFormControl } from './model/custom-form-control.model';

export class MyFormGroup extends FormGroup {
  ref: ControlGroupRef = ControlGroupRef.unknown;

  constructor(
    controls: { [p: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  withRef(ref: ControlGroupRef): MyFormGroup {
    this.ref = ref;
    return this;
  }
}

export class FormValidators {
  static formatDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return String.isNotDefinedOrEmpty(v) || (parseDate(v) !== undefined) ? null : { 'format': { value: v } };
  }

  static formatOrcid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string  = control.value;
    const isEmpty = String.isNotDefinedOrEmpty(value);
    const isValueValid = !isEmpty && isOrcidValid(value);

    if (isEmpty) {
      return null;
    }

    return isValueValid ? null : { 'format': { value } };
  }

  static uniqueValues: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const columns = <FormGroup> control;
    const values = Object.keys(columns.controls)
      .map(key => <FormControl>columns.controls[key])
      .map(c => c.value);

    const valueCounts = values
      .filter(v => !v.isEmpty())
      .reduce((rv, v) => {
        rv[v] = (rv[v] || 0) + 1;
        return rv;
      }, {});

    const duplicates = values.filter(v => valueCounts[v] > 1);
    if (duplicates.isEmpty()) {
      return null;
    }

    Object.keys(columns.controls).forEach(key => {
      const controlItem = columns.controls[key];
      let errors = controlItem.errors;
      if (duplicates.includes(controlItem.value)) {
        errors = errors || {};
        errors['uniqueCols'] = { value: controlItem.value};
      } else if (errors !== null) {
        delete errors['uniqueCols'];
        if (Object.keys(errors).length === 0) {
          errors = null;
        }
      }
      controlItem.setErrors(errors);
    });

    return {'uniqueCols': {value: duplicates[0]}};
  }
}

export class SubmFormValidators {
  static forCell(column: Attribute): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (column.displayType.isRequired) {
      validators.push(Validators.required);
    }

    if (column.uniqueValues) {
      validators.push(RxwebValidators.unique());
    }

    if (column.dependencyColumn !== '') {
      const selectValueType = <SelectValueType>column.valueType;
      validators.push(SubmFormValidators.forCellWithDependency(selectValueType));
    }

    return [
      ...validators,
      ...SubmFormValidators.forValueType(column.valueType)
    ];
  }

  static forCellWithDependency(valueType: SelectValueType): ValidatorFn {
    return (control: AbstractControl) => {
      const { value } = control;
      const { values } = valueType;

      if (value.length === 0) {
        return null;
      }

      // This is to avoid a false positive while values are calculated
      // for a dependant field.
      if (value.length !== 0 && values.length === 0) {
        return null;
      }

      return values.includes(value) ? null : { dependency: { value: control.value } };
    };
  }

  static forColumn(_column: Attribute): ValidatorFn[] {
    return [Validators.required];
  }

  static forFeatureColumns(feature: Feature) {
    const validators: ValidatorFn[] = [];

    if (feature.type.uniqueCols) {
      validators.push(FormValidators.uniqueValues);
    }

    return validators;
  }

  static forField(field: Field): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.type.displayType.isRequired) {
      validators.push(Validators.required);
    }
    return [...validators, ...SubmFormValidators.forValueType(field.type.valueType)];
  }

  static forValueType(valueType: ValueType): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
      const vt = <TextValueType>valueType;
      if (vt.maxlength > 0) {
        validators.push(Validators.maxLength(vt.maxlength));
      }
      if (vt.minlength > 0) {
        validators.push(Validators.minLength(vt.minlength));
      }
    } else if (valueType.is(ValueTypeName.date)) {
      validators.push(FormValidators.formatDate);
    }

    if (valueType.is(ValueTypeName.orcid)) {
      validators.push(FormValidators.formatOrcid);
    }

    return validators;
  }
}

export class CustomErrorMessages {
  static for(control: AbstractControl) {
    const ref = ((control instanceof CustomFormControl) ? control.ref : undefined) || ControlRef.unknown;

    return {
      'required': () => {
        return `Please enter the ${ref.parentName}'s ${ref.name.toLowerCase()}`;
      },
      'minlength': (error: { actualLength: number, requiredLength: number }) => {
        return `Please use at least ${error.requiredLength} characters`;
      },
      'maxlength': (error: { actualLength: number, requiredLength: number }) => {
        return `Please use up to ${error.requiredLength} characters`;
      },
      'format': () => {
        return `Please provide a valid value`;
      },
      'pattern': (error: { actualValue: string, requiredPattern: string }) => {
        return `Please provide a value in '${error.requiredPattern}' format`;
      },
      'uniqueCols': (error: { value: string }) => {
        return `${ref.parentName}'s ${error.value} column is not unique`;
      },
      'unique': () => {
        return `${ref.parentName}'s values should be unique`;
      },
      'dependency': (error: { value: string }) => {
        return `${error.value} is not an Study Protocol. Please add and describe Protocols on the Study page firstly. `;
      }
    };
  }
}

export class ErrorMessages {
  static map(control: AbstractControl): string[] {
    const errors = control.errors || {};
    const messages = CustomErrorMessages.for(control);

    return Object.keys(errors).map(errorKey => messages[errorKey](errors[errorKey]));
  }
}
