import {Component, ElementRef, ViewChild, forwardRef} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor} from '@angular/forms';

import 'rxjs/add/observable/timer';
import {formatDate, parseDate} from './date.utils';
import {DatePickerComponent} from 'ng2-bootstrap/datepicker';

@Component({
    selector: 'date-input-box',
    template: `
    <div class="input-group">
         <input type="text"
                class="form-control"
                placeholder="YYYY-MM-DD"
                [(ngModel)]="value"
                pattern="^\d{4}-\d{2}-\d{2}$"
                (click)="openDatePicker()"
                 #inputbox>
                <span class="btn input-group-addon" 
                      (click)="toggleDatePicker()"><i class="fa fa-calendar"></i></span>       
    </div>
    <datepicker style="position: absolute; z-index:10; min-height:290px;"
                [activeDate]="activeDate" 
                [hidden]="!showDatePicker"
                (selectionDone)="onSelectionDone($event)"></datepicker>
`,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateInputBoxComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => DateInputBoxComponent), multi: true}
    ]
})

export class DateInputBoxComponent implements ControlValueAccessor {

    @ViewChild('inputbox') private inpEl: ElementRef;

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    private dateValue = '';
    private activeDate: Date = new Date();
    private showDatePicker = false;

    get value() {
        return this.dateValue;
    }

    set value(val) {
        this.dateValue = val;
        this.onChange(val);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        console.log('write value', value);
        if (value) {
            this.dateValue = value;
            this.activeDate = parseDate(value);
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn) {
        this.onChange = fn;
    }

    //From ControlValueAccessor interface
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

    onSelectionDone(date: Date): void {
        this.value = formatDate(date);
        this.activeDate = date;
        this.closeDatePicker();
    }
}


