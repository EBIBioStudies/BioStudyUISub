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
import { Attribute, Table, Field } from 'app/submission/submission-shared/model';
import { TextValueType, ValueType, ValueTypeName, SelectValueType } from 'app/submission/submission-shared/model';
import {
  parseDate,
  isOrcidValid,
  isDnaSequenceValid,
  isProteinSequenceValid,
  isNotDefinedOrEmpty,
  isArrayEmpty,
  isStringEmpty
} from 'app/utils';
import { Observable, of } from 'rxjs';
import { SubmissionListItem, SubmissionService } from 'app/submission/submission-shared/submission.service';
import { ControlRef, ControlGroupRef } from './control-reference';
import { CustomFormControl } from './model/custom-form-control.model';
import { catchError, first, map } from 'rxjs/operators';
import pluralize from 'pluralize';

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
    return isNotDefinedOrEmpty(v) || parseDate(v) !== undefined ? null : { format: { value: v } };
  };

  static formatDna: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    const [richValue, rawValue] = value.split('@');
    const isEmpty: boolean = isNotDefinedOrEmpty(richValue);

    if (isEmpty) {
      return null;
    }

    const isValueValid: boolean = isDnaSequenceValid(rawValue);

    return isValueValid ? null : { format: { value } };
  };

  static formatOrcid: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;
    const isEmpty: boolean = isNotDefinedOrEmpty(value);

    if (isEmpty) {
      return null;
    }

    const isValueValid: boolean = isOrcidValid(value);

    return isValueValid ? null : { format: { value } };
  };

  static formatProtein: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    const [richValue, rawValue] = value.split('@');
    const isEmpty: boolean = isNotDefinedOrEmpty(richValue);

    if (isEmpty) {
      return null;
    }

    const isValueValid: boolean = isProteinSequenceValid(rawValue);

    return isValueValid ? null : { format: { value } };
  };

  static uniqueValues: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const columns = control as FormGroup;
    const values = Object.keys(columns.controls)
      .map((key) => columns.controls[key] as FormControl)
      .map((c) => c.value);

    const valueCounts = values
      .filter((v) => !isStringEmpty(v))
      .reduce((rv, v) => {
        rv[v] = (rv[v] || 0) + 1;
        return rv;
      }, {});

    const duplicates = values.filter((v) => valueCounts[v] > 1);
    if (isArrayEmpty(duplicates)) {
      return null;
    }

    Object.keys(columns.controls).forEach((key) => {
      const controlItem = columns.controls[key];
      let errors = controlItem.errors;
      if (duplicates.includes(controlItem.value)) {
        errors = errors || {};
        errors.uniqueCols = { value: controlItem.value };
      } else if (errors !== null) {
        delete errors.uniqueCols;
        if (Object.keys(errors).length === 0) {
          errors = null;
        }
      }
      controlItem.setErrors(errors);
    });

    return { uniqueCols: { value: duplicates[0] } };
  };
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
      const selectValueType = column.valueType as SelectValueType;
      validators.push(SubmFormValidators.forCellWithDependency(selectValueType));
    }

    return [...validators, ...SubmFormValidators.forValueType(column.valueType)];
  }

  static forCellWithDependency(valueType: SelectValueType): ValidatorFn {
    return (control: AbstractControl) => {
      const { value } = control;
      const { values } = valueType;

      if (!value || value.length === 0) {
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

  // tslint:disable-next-line: variable-name
  static forColumn(_column: Attribute): ValidatorFn[] {
    return [Validators.required];
  }

  static forTableColumns(table: Table): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (table.type.uniqueCols) {
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
      const vt = valueType as TextValueType;

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

    if (valueType.is(ValueTypeName.dna)) {
      validators.push(FormValidators.formatDna);
    }

    if (valueType.is(ValueTypeName.protein)) {
      validators.push(FormValidators.formatProtein);
    }

    return validators;
  }
}

export class CustomErrorMessages {
  static for(control: AbstractControl): any {
    const ref = (control instanceof CustomFormControl ? control.ref : undefined) || ControlRef.unknown;

    return {
      required: () => {
        return `This field is required please enter a value`;
      },
      minlength: (error: { actualLength: number; requiredLength: number }) => {
        return `Please use at least ${error.requiredLength} characters`;
      },
      maxlength: (error: { actualLength: number; requiredLength: number }) => {
        return `Please use up to ${error.requiredLength} characters`;
      },
      format: () => {
        return 'Please provide a valid value';
      },
      pattern: (error: { actualValue: string; requiredPattern: string }) => {
        return `Please provide a value in '${error.requiredPattern}' format`;
      },
      uniqueCols: (error: { value: string }) => {
        return `${ref.parentName}'s ${error.value} column is not unique`;
      },
      unique: () => {
        return `${ref.parentName}'s values should be unique`;
      },
      dependency: (error: { value: string }) => {
        return `${error.value} is not an Study Protocol. Please add and describe Protocols on the Study page firstly. `;
      }
    };
  }
}

export class CustomWarningsDefinition {
  static for(): any {
    return {
      uniqueSubmission: (error: { value: string; payload: SubmissionListItem[] }) => {
        const submissionsCount = error.payload.length;
        const submissionText = pluralize('Submission', submissionsCount);
        const countText = pluralize('have', submissionsCount);

        return {
          message: `${submissionText} with a similar title ${countText} been found`,
          payload: error.payload
        };
      }
    };
  }
}

export class ErrorMessages {
  static map(control: AbstractControl): string[] {
    const errors = control.errors || {};
    const messages = CustomErrorMessages.for(control);

    return Object.keys(errors).map((errorKey) => messages[errorKey](errors[errorKey]));
  }
}

export class WarningMessages {
  static map(control: CustomFormControl): { message: string; payload: any }[] {
    const warnings = control.warnings || {};
    const definitions = CustomWarningsDefinition.for();

    return Object.keys(warnings).map((errorKey) => definitions[errorKey](warnings[errorKey]));
  }

  static getWarningParamByErrorKey<T>(control: CustomFormControl, paramName: string, errorKey: string): T | null {
    const definitions = CustomWarningsDefinition.for();
    const warnings = control.warnings || {};

    // Only return warnings if control is valid to avoid polluting the control with messages.
    if (warnings[errorKey] && control.status === 'VALID') {
      const definition = definitions[errorKey](warnings[errorKey]);

      return definition ? definition[paramName] : null;
    }

    return null;
  }
}
