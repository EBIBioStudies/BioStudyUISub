import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ValueValidators} from './value-validators';
import {TextValueType, ValueType, ValueTypeName} from '../shared/model/templates';
import {Attribute, Feature, Field} from '../shared/model/submission';

interface ControlRef {
    name: string;
    parent?: string;
}

export class FormValidators {
    static required = (ref?: ControlRef) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (typeof control.value !== 'string') {
                return null;
            }
            const error = ValueValidators.required(control.value);
            return error ? Object.assign(error, {ref: ref}) : null;
        };
    };

    static uniqueValues = (parentRef?: ControlRef) => {
        return (control: AbstractControl): ValidationErrors | null => {
            const columns = <FormGroup> control;
            const values = Object.keys(columns.controls)
                .map(key => <FormControl>columns.controls[key])
                .map(c => c.value);

            const error = ValueValidators.uniqueValues(values);
            if (error) {
                const duplicates = error['unique'].values;
                Object.keys(columns.controls).forEach(key => {
                    const control = columns.controls[key];
                    let errors = control.errors;
                    if (duplicates.includes(control.value)) {
                        errors = errors || {};
                        errors['unique'] = {value: control.value, ref: parentRef};
                    } else if (errors !== null) {
                        delete errors['unique'];
                        if (Object.keys(errors).length === 0) {
                            errors = null;
                        }
                    }
                    control.setErrors(errors);
                });
                return {'unique': {value: duplicates[0], ref: parentRef}};
            }
            return null;
        }
    };

    static maxLength = (maxLen: number): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            return ValueValidators.maxLength(control.value, maxLen);
        }
    };

    static minLength = (minLen: number): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            return ValueValidators.minLength(control.value, minLen);
        }
    };
}

export class SubmFormValidators {
    static forValueType(valueType: ValueType): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
            const vt = <TextValueType>valueType;
            if (vt.maxlength > 0) {
                validators.push(FormValidators.maxLength(vt.maxlength));
            }
            if (vt.minlength > 0) {
                validators.push(FormValidators.minLength(vt.minlength));
            }
        }
        return validators;
    }

    static forField(field: Field, parentRef: string): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (field.type.displayType.isRequired) {
            validators.push(FormValidators.required({name: field.name, parent: parentRef}));
        }
        return [...validators, ...SubmFormValidators.forValueType(field.type.valueType)];
    }

    static forCell(column: Attribute, parentRef: string): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (column.displayType.isRequired) {
            validators.push(FormValidators.required({name: column.name, parent: parentRef}));
        }
        return [...validators, ...SubmFormValidators.forValueType(column.valueType)];
    }

    static forColumn(column: Attribute, parentRef: string): ValidatorFn[] {
        return [FormValidators.required({name: 'key', parent: parentRef})];
    }

    static forFeatureColumns(feature: Feature) {
        const validators: ValidatorFn[] = [];
        if (feature.type.uniqueCols) {
            validators.push(FormValidators.uniqueValues({name: feature.typeName}))
        }
        return validators;
    }
}

const CustomErrorMessages = (() => {
    return {
        'required': (error: { value: string, ref?: ControlRef }) => {
            return `Please enter the ${error.ref!.parent}'s ${error.ref!.name.toLowerCase()}`;
        },
        'minlength': (error: { requiredLength: number, actualLength: number }) => {
            return `Please use at least ${error.requiredLength} characters`;
        },
        'maxlength': (error: { requiredLength: number, actualLength: number }) => {
            return `Please use up to ${error.requiredLength} characters`;
        },
        'format': (error: any) => {
            return `Please provide a valid value`;
        },
        'unique': (error: { value: string, ref?: ControlRef }) => {
            return `${error.ref!.name}'s ${error.value} column is not unique`;
        }
    };
})();

export class ErrorMessages {
    static map(errors: any): string[] {
        return Object.keys(errors).map(errorKey => CustomErrorMessages[errorKey](errors[errorKey]))
    }
}
