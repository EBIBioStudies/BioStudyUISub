import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[equals2][formControlName],[equals2][formControl],[equals2][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => Equals2), multi: true}
    ]
})
export class Equals2 implements Validator {
    @Input('equals2') target?: AbstractControl;

    validate(c: AbstractControl): ValidationErrors | null {
        const v = c.value;

        if (this.target && v !== this.target.value) {
            return {
                equals2: true
            };
        }

        return null;
    }
}
