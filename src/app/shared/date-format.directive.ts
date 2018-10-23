import {Directive, forwardRef} from '@angular/core';

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

import {formatDate, parseDate} from '../utils';

@Directive({
    selector: '[bsstDateFormat]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateFormatDirective), multi: true}
    ]
})
export class DateFormatDirective implements Validator {

    private regexp = /(\d{4})\-(\d{2})\-(\d{2})/;

    validate(c: AbstractControl): ValidationErrors | null {
        let v = c.value || '';
        if (v !== '') {
            if (!this.valid(v)) {
                return {
                    pattern: 'YYYY-MM-DD'
                }
            }
        }
        return null;
    }

    private valid(date: string): boolean {
        let d = date.match(this.regexp);
        if (!d) {
            return false;
        }
        return date === formatDate(parseDate(date));
    }
}