import {
    Directive
} from '@angular/core';
import {
    NG_VALIDATORS,
    AbstractControl,
    FormControl,
    ValidatorFn,
    Validator
} from '@angular/forms';

@Directive({
    selector: '[unique][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: UniqueValidator, multi: true }
    ]
})
export class UniqueValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = uniqueValidatorFactory();
    }

    validate(formControl: FormControl) {
        return this.validator(formControl);
    }
}

/**
 * Uniqueness validator factory. It checks the value of the control passed in is different from that of any other
 * control in the form. Effectively, the set of controls must contain no duplicate values.
 * @returns {ValidatorFn} Object describing if the uniqueness requirement is met or valid.
 */
function uniqueValidatorFactory(): ValidatorFn {
    return (control: FormControl) => {
        const controls = control.root['controls'];
        const values = Object.keys(controls).map(controlKey => controls[controlKey].value);
        const valueSet = new Set(values);
        let isValid = false;

        //NOTE: Set conversion drops any duplicated entries
        isValid = valueSet.size === values.length;

        if (isValid) {
            return null;
        } else {
            return {
                unique: {
                    valid: false
                }
            };
        }
    }
}