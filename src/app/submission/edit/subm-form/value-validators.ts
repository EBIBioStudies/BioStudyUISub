import {FieldType, TextValueType, ValueType, ValueTypeName} from '../../shared/submission-type.model';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Field} from '../../shared/submission.model';

const nonEmptyStringValidator = (controlName: string, controlParent: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (typeof control.value !== 'string') {
            return null;
        } else if (control.value.isEmpty()) {
            return {'required': {value: control.value, controlName: controlName, controlParent: controlParent}};
        } else {
            return null;
        }
    };
};


export class ValueValidators {
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
        }
        return validators;
    }

    static forField(field: Field, parentRef: string): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (field.type.required) {
            validators.push(nonEmptyStringValidator(field.name, parentRef));
        }

        return [...validators, ...ValueValidators.forValueType(field.type.valueType)];
    }
}

const CustomErrorMessages = (() => {
    const prefixed = (text: string, prefix?: string) => {
        return String.isDefinedAndNotEmpty(prefix) ? `${prefix}:${text}` : text;
    };
    return {
        'required': (error: { value: string, controlName: string, controlParent: string }, prefix?: string) => {
            return prefixed(`Please enter the ${error.controlParent.toLowerCase()}'s ${error.controlName.toLowerCase()}`, prefix);
        },
        'minlength': (error: { requiredLength: number, actualLength: number }, prefix?: string) => {
            return prefixed(`Please use at least ${error.requiredLength} characters`, prefix);
        },
        'maxlength': (error: { requiredLength: number, actualLength: number }, prefix?: string) => {
            return prefixed(`Please use up to ${error.requiredLength} characters`, prefix);
        },
        'pattern': (error: any, prefix?: string) => {
            return prefixed(`Please provide a valid value`, prefix);
        }
    };
})();

export class ErrorMessages {
    static map(errors: any, prefix?: string): string[] {
        return Object.keys(errors).map(errorKey => CustomErrorMessages[errorKey](errors[errorKey], prefix))
    }
}
