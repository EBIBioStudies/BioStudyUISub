import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    forwardRef
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    FormControl
} from '@angular/forms';

@Component({
    selector: 'feature-value',
    templateUrl: './feature-value.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FeatureValueComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => FeatureValueComponent), multi: true}
    ]
})
export class FeatureValueComponent implements ControlValueAccessor, OnChanges {
    @Input() type: string;
    @Input() readonly: boolean;
    @Input() required: boolean;

    private _value = '';

    propagateChange: any = () => {
    };

    validateFn: any = () => {
    };

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.propagateChange(val);
    }

    writeValue(value: any): void {
        if (value) {
            this.value = value;
        }
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
}
