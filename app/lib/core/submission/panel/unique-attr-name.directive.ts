import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';

import * as _ from 'lodash';

@Directive({
    selector: '[uniqueAttrName][ngModel]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => UniqueAttrName), multi: true}
    ]
})
export class UniqueAttrName implements Validator {
    @Input('uniqueAttrName') private attributes: any[];

    validate(c: AbstractControl): { [key: string]: any } {
        let v = c.value;
        if (v !== '') {
            let valid = (_.filter(this.attributes, {name: v}).length) === 1;
            if (!valid) {
                return {
                    uniqueAttrName: false
                }
            }
        }
        return null;
    }
}