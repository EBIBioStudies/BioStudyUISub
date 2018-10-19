import {Attribute, Feature, Field, TextValueType, ValueType, ValueTypeName} from '../../shared/model';
import {ValidatorFn, Validators} from '@angular/forms';
import {CustomValidators} from '../../shared/custom-validators';

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
        if (field.type.displayType.isRequired) {
            validators.push(CustomValidators.required(field.name, parentRef));
        }
        return [...validators, ...ValueValidators.forValueType(field.type.valueType)];
    }

    static forCell(column: Attribute, parentRef: string): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (column.displayType.isRequired) {
            validators.push(CustomValidators.required(column.name, parentRef));
        }
        return [...validators, ...ValueValidators.forValueType(column.valueType)];
    }

    static forColumn(column: Attribute, parentRef: string): ValidatorFn[] {
        return [CustomValidators.required('key', parentRef)]
    }
}

export class FormValidators {
    static forFeatureColumns(feature: Feature) {
        const validators: ValidatorFn[] = [];
        if (feature.type.uniqueCols) {
            validators.push(CustomValidators.uniqueValues(feature.typeName))
        }
        return validators;
    }
}

const CustomErrorMessages = (() => {
    return {
        'required': (error: { value: string, controlName: string, controlParent: string }) => {
            return `Please enter the ${error.controlParent.toLowerCase()}'s ${error.controlName.toLowerCase()}`;
        },
        'minlength': (error: { requiredLength: number, actualLength: number }) => {
            return `Please use at least ${error.requiredLength} characters`;
        },
        'maxlength': (error: { requiredLength: number, actualLength: number }) => {
            return `Please use up to ${error.requiredLength} characters`;
        },
        'pattern': (error: any) => {
            return `Please provide a valid value`;
        },
        'unique': (error: { controlValue: string, controlParent: string }) => {
            return `${error.controlParent}'s ${error.controlValue} column is not unique`;
        }
    };
})();

export class ErrorMessages {
    static map(errors: any): string[] {
        return Object.keys(errors).map(errorKey => CustomErrorMessages[errorKey](errors[errorKey]))
    }
}
