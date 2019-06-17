import { Component, forwardRef, Injector, Input, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NgControl,
    NgModel,
    Validators,
} from '@angular/forms';
import 'rxjs/add/observable/timer';

@Component({
    selector: 'orcid-input-box',
    templateUrl: './orcid-input-box.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ORCIDInputBoxComponent),
        multi: true
    }]
})

/**
 * Custom ORCID component including messaging for Thor. It supports validation directives both on the
 * inside of the custom control and the outside, i.e. on the wrapping component itself.
 * @see {@link ControlValueAccessor}
 */
export class ORCIDInputBoxComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {
    private orcidValue = ''; // internal data model
    private mlistener: any = null;

    @Input() readonly: boolean = false;
    @Input() isPopupButton: boolean = true; // flag for showing/hiding popup button
    @Input() isSmall: boolean = true; // flag for making the input area the same size as grid fields

    @ViewChild(NgModel)
    private inputModel?: NgModel;

    // placeholder for handler propagating changes outside the custom control
    private onChange: any = (_: any) => {
    }

    // placeholder for handler after the control has been "touched"
    private onTouched: any = () => {
    }

    /**
     * Instantiates a new custom component.
     * @param {Injector} injector - Parent's injector retrieved to get the component's form control later on.
     */
    constructor(private injector: Injector) {
    }


    get value() {
        return this.orcidValue;
    }

    set value(newValue) {
        this.orcidValue = newValue;
        this.onChange(newValue);
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property.
     * @see {@link ControlValueAccessor}
     * @param newValue - Value to be stored
     */
    writeValue(newValue: any) {
        if (newValue) {
            this.orcidValue = newValue;
            this.onChange(newValue);
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn) {
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

    messageListener() {
        if (!this.mlistener) {
            const obj = this;

            this.mlistener = function (event) {
                const msg = event.data;

                if (!msg.thor) {
                    return;
                }

                const data = JSON.parse(msg.thor);
                const orcid = data['orcid-profile']['orcid-identifier']['path'];

                obj.value = orcid;
            };
        }

        return this.mlistener;
    }

    ngOnInit() {
        window.addEventListener('message', this.messageListener());
    }

    /**
     * Lifecycle hook for operations after all child views have been initialised. It merges all validators of
     * the actual input and the wrapping component.
     */
    ngAfterViewInit() {
        const control: AbstractControl = this.injector.get(NgControl).control;

        control.setValidators(Validators.compose([control.validator, this.inputModel!.control.validator]));
        control.setAsyncValidators(Validators.composeAsync([control.asyncValidator, this.inputModel!.control.asyncValidator]));
        setTimeout(() => {
            control.updateValueAndValidity();
        }, 10);
    }

    ngOnDestroy() {
        window.removeEventListener('message', this.messageListener());
    }

    openPopup() {
        const thorIFrame: any = document.getElementById('thor');
        const w = thorIFrame.contentWindow;

        w.postMessage('openPopup', '*');
    }
}
