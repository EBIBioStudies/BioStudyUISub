import {
    Component,
    ElementRef,
    ViewChild,
    Input,
    forwardRef
} from '@angular/core';

import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from '@angular/forms';

import 'rxjs/add/observable/timer';

import {
    formatDate,
    parseDate
} from './date.utils';

@Component({
    selector: 'date-input',
    template: `
    <div class="input-group">
        <span class="btn input-group-addon" (click)="toggleDatePicker()">
            <i class="fa fa-calendar"></i>
        </span>
        <input type="text"
                class="form-control"
                placeholder="YYYY-MM-DD"
                [(ngModel)]="value"
                pattern="^\d{4}-\d{2}-\d{2}$"
                (click)="openDatePicker()"
                [required]="required"
                [disabled]="readonly"
                 #inputbox>
    </div>
    <datepicker style="position: absolute; z-index:10; min-height:290px;"
                [hidden]="!showDatePicker"
                [ngModel]="activeDate" 
                (ngModelChange)="onActiveDateChange($event)"
                [disabled]="readonly"></datepicker>
`,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateInputComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateInputComponent), multi: true}
    ]
})

export class DateInputComponent implements ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;

    showDatePicker = false;
    activeDate: Date;

    private dateValue = '';

    @ViewChild('inputbox')
    private inpEl: ElementRef;

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    get value() {
        return this.dateValue;
    }

    set value(val) {
        this.dateValue = val;
        this.onChange(val);
    }

    writeValue(value: any) {
        if (value) {
            this.dateValue = value;
            this.activeDate = parseDate(value);
        }
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    toggleDatePicker() {
        this.showDatePicker = !this.showDatePicker;
    }

    closeDatePicker() {
        this.showDatePicker = false;
    }

    openDatePicker() {
        this.showDatePicker = true;
        this.inpEl.nativeElement.blur();
    }

    onActiveDateChange(date: Date): void {
        this.value = formatDate(date);
        this.activeDate = date;
        this.closeDatePicker();
    }
}


