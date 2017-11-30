import {
    Component,
    Input,
    forwardRef,
    ElementRef, ViewChild
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    BsDatepickerComponent,
    BsDatepickerConfig
} from "ngx-bootstrap/datepicker";

import {formatDate, isEqualDate} from './date.utils';

@Component({
    selector: 'date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DateInputComponent),
        multi: true
    }]
})

/**
 * Custom component for the Bootstrap's datepicker. It allows for a default value and makes sure the resulting
 * component behaves exactly like a normal input field.
 * NOTE: Contrary to what its name suggests, DatePicker's "bsValueChange" output event is triggered every time
 * a date is set, NOT on change exclusively.
 * @see {@link https://valor-software.com/ngx-bootstrap/old/1.9.3/#/datepicker}
 * @see {@link ControlValueAccessor}
 */
export class DateInputComponent implements ControlValueAccessor {
    private dateValue: Date;

    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @ViewChild('dp') private datepicker: BsDatepickerComponent;

    private onChange: any = () => {};
    private onTouched: any = () => {};

    /**
     * Instantiates a new custom component, hiding the weeks column on the calendar disabling past dates and setting
     * its default format.
     * @param {BsDatepickerConfig} config - Configuration object for the datepicker directive
     * @param {ElementRef} rootEl - Reference to the root element of the component's template.
     */
    constructor(config: BsDatepickerConfig, private rootEl: ElementRef) {
        config.showWeekNumbers = false;
        config.minDate = new Date(Date.now());
        config.dateInputFormat = 'YYYY-MM-DD';
    }

    /**
     * Sets the date field to today's date if no value is coming from the encompassing form. It is assumed that
     * the type of the incoming data is always "string".
     * @see {@link ControlValueAccessor}
     * @param value - Value to be stored.
     */
    writeValue(value: any) {
        let dateArg: any;

        //NOTE: The first time the field is rendered, it receives a value of null. Hence the typeof check.
        if (typeof value === 'string') {
            dateArg = value || Date.now();
            this.onPickerSet(new Date(dateArg));
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
     * Normalises clicking behaviour across all of the input. Otherwise, clicking around the area of the arrow would
     * not bring up the calendar, the expected behaviour.
     * @param {Event} event - DOM event for the click action.
     */
    onClick(event: Event) {

        //Cancels the datepicker dialogue by closing it as soon as it's opened.
        if (this.readonly) {
            this.datepicker.toggle();

        //Checks click happened on the wrapping element
        } else if ((<Element>event.target).classList.contains('dropdown')) {
            this.datepicker.show();
        }
    }

    /**
     * Bubble value and change event up when the date chosen on the date picker is different from the already set one.
     * @param {Date} dateObj - Date coming from the picker. May be null if date not retrieved from server yet.
     * @param {Boolean} [isChange = false] - Forces/Cancels the triggering of a change event (and, possibly,
     * its corresponding backup action. @see {@link SubmEditComponent}). By default, any programmatic change will be
     * cancelled (because they are not initiated by the user in the first place).
     */
    onPickerSet(dateObj: Date, isChange: boolean = this.datepicker.isOpen) {
        if (dateObj && !isEqualDate(dateObj, this.dateValue)) {
            this.dateValue = dateObj;
            this.onChange(formatDate(this.dateValue));
            isChange && this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
        }
    }
}


