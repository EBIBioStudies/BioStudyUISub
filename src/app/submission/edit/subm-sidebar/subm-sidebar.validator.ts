import {
    Directive,
    forwardRef
} from '@angular/core';
import {
    NG_VALIDATORS,
    AbstractControl,
    FormControl,
    ValidatorFn,
    Validator
} from '@angular/forms';

@Directive({
    selector: '[TypeName][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: TypeNameValidator, multi: true }
    ]
})
export class TypeNameValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateTypeNameFactory();
    }

    validate(formControl: FormControl) {
        return this.validator(formControl);
    }
}

/**
 * Stub TBC
 * @returns {ValidatorFn}
 */
function validateTypeNameFactory(): ValidatorFn {
    return (control: AbstractControl) => {
        const isValid = false;

        if(isValid) {
            return null;
        } else {
            return {
                typeName: {
                    valid: false
                }
            };
        }
    }
}