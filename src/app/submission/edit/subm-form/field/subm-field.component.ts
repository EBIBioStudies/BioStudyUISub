import {
    Component,
    Input,
    forwardRef,
    ElementRef
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {FieldControl} from "../subm-form.service";


@Component({
    selector: 'subm-field',
    templateUrl: './subm-field.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SubmFieldComponent),
        multi: true
    }]
})
export class SubmFieldComponent implements ControlValueAccessor {
    private onChange: any = (_:any) => {};      //placeholder for handler propagating changes outside the custom control
    private onTouched: any = () => {};          //placeholder for handler after the control has been "touched"

    @Input() name: string;
    @Input() type: string;
    @Input() isSmall: boolean;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() formControl: FieldControl;

    private _value = '';

    constructor(private elementRef: ElementRef) { }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.onChange(value);
    }

    ngAfterViewInit(): void {
        this.formControl.nativeElement = this.elementRef.nativeElement.querySelector('.form-control');
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property.
     * @see {@link ControlValueAccessor}
     * @param value - Value to be stored
     */
    writeValue(value: any): void {
        if (value) {
            this.value = value;
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers a handler specifically for when a control receives a touch event.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler for touch events.
     */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * Handler for blur events. Normalises the behaviour of the "touched" flag.
     */
    onBlur() {
        this.onTouched();
    }
}
