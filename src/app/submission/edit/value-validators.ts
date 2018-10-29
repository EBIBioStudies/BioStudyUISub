import {ValidationErrors} from '@angular/forms';
import {ValueType, ValueTypeName} from '../shared/model/templates';
import {parseDate} from '../../utils';

export class ValueValidators {
    static required = (value: string): ValidationErrors | null => {
        if (value.isEmpty()) {
            return {'required': {value: value}};
        } else {
            return null;
        }
    };

    static uniqueValues = (values: string[]): ValidationErrors | null => {
        const valueCounts = values
            .filter(v => !v.isEmpty())
            .reduce((rv, v) => {
                rv[v] = (rv[v] || 0) + 1;
                return rv;
            }, {});

        const duplicated = values.filter(v => valueCounts[v] > 1);
        return duplicated.length === 0 ? null : {'unique': {values: duplicated}};
    };

    static maxLength = (value: string, maxLen: number): ValidationErrors | null => {
        return (value.length < maxLen) ? null : {'maxlength': {actualLength: value.length, requiredLength: maxLen}};
    };

    static minLength = (value: string, minLen: number): ValidationErrors | null => {
        return (value.length >= minLen) ? null : {'minlength': {actualLength: value.length, requiredLength: minLen}};
    };

    static format = (value: string, valueType: ValueType): ValidationErrors | null => {
        if (valueType.is(ValueTypeName.date) && parseDate(value) === undefined) {
            return {'format': {value: value}};
        }
        if (valueType.is(ValueTypeName.orcid) && !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(value)) {
            return {'format': {value: value}};
        }
        return null;
    };
}
