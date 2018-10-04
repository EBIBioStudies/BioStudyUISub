import {TextValueType, ValueType, ValueTypeName} from '../../shared/submission-type.model';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {Attribute, Feature, Field} from '../../shared/submission.model';

const nonEmptyStringValidator = (controlName: string, parentRef: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (typeof control.value !== 'string') {
            return null;
        } else if (control.value.isEmpty()) {
            return {'required': {value: control.value, controlName: controlName || '', controlParent: parentRef}};
        } else {
            return null;
        }
    };
};

const uniqueColumnsValidator = (parentRef: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
        const columns = <FormGroup> control;
        const keys = Object.keys(columns.controls);

        const valueCounts = keys.map(key => <FormControl>columns.controls[key])
            .map(c => c.value)
            .filter(v => !(<string>v).isEmpty())
            .reduce((rv, v) => {
                rv[v] = (rv[v] || 0) + 1;
                return rv;
            }, {});

        let errorCount = 0;
        Object.keys(columns.controls).forEach(key => {
            const control = columns.controls[key];
            let errors = control.errors;
            if (valueCounts[control.value] > 1) {
                errors = errors || {};
                errors['uniqueColumn'] = {columnName: control.value, controlParent: parentRef};
                errorCount += 1;
            } else if (errors !== null) {
                delete errors['uniqueColumn'];
                if (Object.keys(errors).length === 0) {
                    errors = null;
                }
            }
            control.setErrors(errors);
        });
        return errorCount === 0 ? null : {'uniqueFeatureColumns': {controlParent: parentRef}}
    }
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

    static forCell(column: Attribute, parentRef: string): ValidatorFn[] {
        return []; //TODO
    }

    static forColumn(column: Attribute, parentRef: string): ValidatorFn[] {
        return [nonEmptyStringValidator('key', parentRef)]
    }
}

export class FormValidators {
    static forFeatureColumns(feature: Feature) {
        const validators: ValidatorFn[] = [];
        if (feature.type.uniqueCols) {
            validators.push(uniqueColumnsValidator(feature.typeName))
        }
        return validators;
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
        },
        'uniqueColumn': (error: any, prefix?: string) => {
            return prefixed(`${error.controlParent}'s ${error.columnName} column is not unique`, prefix);
        },
        'uniqueFeatureColumns': (error: any, prefix?: string) => {
            return prefixed(`${error.controlParent}'s columns should be unique`, prefix);
        }
    };
})();

export class ErrorMessages {
    static map(errors: any, prefix?: string): string[] {
        return Object.keys(errors).map(errorKey => CustomErrorMessages[errorKey](errors[errorKey], prefix))
    }
}
