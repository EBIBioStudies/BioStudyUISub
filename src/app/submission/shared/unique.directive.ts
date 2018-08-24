import {
    Directive, Injector, Input
} from '@angular/core';
import {
    NG_VALIDATORS,
    FormControl,
    ValidatorFn,
    Validator, NgControl
} from '@angular/forms';

@Directive({
    selector: '[unique]',
    host: {
        '(change)': 'onChange()'
    },
    providers: [
        { provide: NG_VALIDATORS, useExisting: UniqueValidator, multi: true }
    ]
})
export class UniqueValidator implements Validator {
    validator: ValidatorFn;

    @Input('unique') isApply?: boolean = true;

    constructor(private injector: Injector) {
        this.validator = uniqueValidatorFactory();
    }

    validate(formControl: FormControl) {
        if (this.isApply) {
            return this.validator(formControl);
        } else {
            return null;
        }
    }

    /**
     * Checks the validity of the other controls once the current one has changed. This is done since
     * two invalid fields with a non-unique value will cease to be invalid the moment that value is changed
     * in any one field.
     */
    onChange(): void {
        const control = this.injector.get(NgControl).control;
        const controls = control.parent.controls;

        //Updates validity of fields, forcing the display of feedback even if not "touched" yet.
        Object.keys(controls).forEach((key) => {
            controls[key].updateValueAndValidity();
            if (controls[key].invalid) {
                controls[key].markAsTouched();
            }
        });
    }

    /**
     * Updates validity after deletion to avoid inconsistencies.
     */
    ngOnDestroy(): void {
        this.onChange();
    }
}

/**
 * Uniqueness validator factory. It checks the value of the control passed in is different from that of any other
 * control in the form. Effectively, the set of controls must contain no duplicate values.
 * @returns {ValidatorFn} Object describing if the uniqueness requirement is met or valid.
 */
function uniqueValidatorFactory(): ValidatorFn {
    return (control: FormControl) => {
        const controls = control.parent.controls;
        const values = Object.keys(controls).map(controlKey => controls[controlKey].value);
        const valueSet = new Set(values);
        let isValid = false;

        //If all values of all form controls are unique, the present control must be valid
        //NOTE: Set conversion drops any duplicated entries
        isValid = valueSet.size === values.length;

        //If some values are not unique, does the present control have one such value?
        //NOTE: the uniqueness test may be passed if all controls with values equal to this control's are removed.
        if (!isValid) {
            isValid = values.reduce((occurrences, value) => {
                return occurrences + (value === control.value);
            }, 0) == 1;
        }

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