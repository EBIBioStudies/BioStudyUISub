import {TextValueType, ValueType, ValueTypeName} from '../../shared/submission-type.model';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

const nonEmptyStringValidator = (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value !== 'string') {
        return null;
    } else if (control.value.isEmpty()) {
        return {'required': {value: control.value}};
    } else {
        return null;
    }
};

export class ValueValidators {
    static for(valueType: ValueType): ValidatorFn[] {
        const validators: ValidatorFn[] = [];

        if (valueType.required) {
            validators.push(nonEmptyStringValidator);
        }

        if (valueType instanceof TextValueType) {
            if (valueType.maxlength > 0) {
                validators.push(Validators.maxLength(valueType.maxlength);
            }
            if (valueType.minlength > 0) {
                validators.push(Validators.minLength(valueType.minlength));
            }
        }
        return validators;
    }
}