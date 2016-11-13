import {Directive, forwardRef, Attribute} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';
@Directive({
    selector: '[equals2][formControlName],[equals2][formControl],[equals2][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => Equals2), multi: true}
    ]
})
export class Equals2 implements Validator {
    constructor(@Attribute('equals2') public equals2: string) {
    }

    validate(c: AbstractControl): { [key: string]: any } {
        // self value (e.g. retype password)
        let v = c.value;

        // control value (e.g. password)
        let e = c.root.get(this.equals2);

        // value not equal
        if (e && v !== e.value) {
            return {
                equals2: false
            };
        }
        return null;
    }
}