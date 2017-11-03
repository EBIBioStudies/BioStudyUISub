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
    selector: 'subm-field',
    templateUrl: './subm-field.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SubmFieldComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => SubmFieldComponent), multi: true}
    ]
})
export class SubmFieldComponent implements ControlValueAccessor, OnChanges {
    @Input() name: string;
    @Input() type: string;
    @Input() isSmall: boolean;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() formControl: FormControl;

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
