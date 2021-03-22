import { Component, ElementRef, forwardRef, Input, ViewChild, OnInit, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { formatDate } from 'ngx-bootstrap/chronos';
import { isEqualDate, isDefinedAndNotEmpty } from 'app/utils';
import { CustomFormControl } from 'app/submission/submission-edit/shared/model/custom-form-control.model';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'st-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})

/**
 * Custom component for the Bootstrap's datepicker. It allows for a default value and makes sure the resulting
 * component behaves exactly like a read-only input field (so that input is only allowed through the date picker).
 * It allows the display format for the date to be different to the transactional one if needed (the latter is
 * hard-coded to ISO 8601 YYYY-MM-DD).
 * @see {@link ControlValueAccessor}
 */
export class DateInputComponent implements ControlValueAccessor, OnInit {
  @Input() allowPast?: boolean = undefined;
  inputDateValue: string | undefined;
  @Input() isSmall?: boolean = false;
  @Input() inputId: string = '';
  @Input() maxDate?: Date = undefined;
  rawDateValue: Date | undefined;
  @Input() readonly?: boolean = false;
  @Input() required?: boolean = false;
  @Input() formControl!: CustomFormControl;
  @Input() isInputGroup: boolean = false;
  @ViewChild('dp', { static: true })
  private datepicker!: BsDatepickerDirective;

  /**
   * Instantiates a new custom component, hiding the weeks column on the calendar and setting
   * its default formats.
   * @param config - Configuration object for the datepicker directive.
   * @param appConfig - Global configuration object with app-wide settings.
   * @param rootEl - Reference to the component's wrapping element
   */
  constructor(config: BsDatepickerConfig, private appConfig: AppConfig, private rootEl: ElementRef) {
    config.showWeekNumbers = false;
  }

  /**
   * Disables past dates if so defined in the corresponding input binding. If there is none, it falls back
   * on the app-wide config's relevant entry. Otherwise, the default behaviour is to allow past dates.
   * Also sets the maximum date for selection only if the corresponding input binding is provided. If not,
   * any future date can be set.
   */
  ngOnInit(): void {
    if (!this.allowPast) {
      this.datepicker.minDate = new Date(Date.now());
    }
    if (this.maxDate instanceof Date) {
      this.datepicker.maxDate = this.maxDate;
    }
  }

  /**
   * Normalises clicking behaviour across all of the input. Otherwise, clicking around the area of the arrow would
   * not bring up the calendar, the expected behaviour.
   * @param event - DOM event for the click action.
   */
  onClick(event: Event): void {
    // Cancels the datepicker dialogue by closing it as soon as it's opened.
    // NOTE: As of ngx-bootstrap's current version, a disabled state is still WIP.
    if (this.readonly) {
      this.datepicker.toggle();

      // Checks click happened on the wrapping element
    } else if ((event.target as Element).classList.contains('dropdown')) {
      this.datepicker.show();
    }
  }

  /**
   * Bubble value and change event up when the date chosen on the date picker is different from the already set one.
   * @param dateObj - Date coming from the picker. May be null if date not retrieved from server yet.
   * @param [isChange = false] - Forces/Cancels the triggering of a change event (and, possibly,
   * its corresponding backup action. @see {@link SubmEditComponent}). By default, any programmatic change will be
   * cancelled (because they are not initiated by the user in the first place).
   * NOTE: Contrary to what its name suggests, DatePicker's "bsValueChange" output event is triggered every time
   * a date is set, NOT on value change exclusively.
   * @see {@link https://valor-software.com/ngx-bootstrap/#/datepicker}
   */
  onPickerSet(dateObj: Date, isChange: boolean = this.datepicker.isOpen): void {
    if (dateObj && !isEqualDate(dateObj, this.rawDateValue)) {
      this.rawDateValue = dateObj;
      this.inputDateValue = formatDate(dateObj, this.appConfig.dateInputFormat);

      // Formats to ISO as backend expect such format.
      const formattedDate = dateObj.toISOString();

      // Propagates the date change through the DOM if so wished.
      if (isChange) {
        this.onChange(formattedDate);
      }
    }
  }

  /**
   * Prevents any click events from bubbling beyond the date picker to avoid conflict with any external listeners.
   */
  onPickerShown(): void {
    const dataPickerContainer: Element | null = document.querySelector('.bs-datepicker-container');

    if (dataPickerContainer) {
      dataPickerContainer.addEventListener('mousedown', (event) => {
        event.stopPropagation();
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScrollEvent(): void {
    this.datepicker.hide();
  }

  /**
   * Registers a handler that should be called when something in the view has changed.
   * @see {@link ControlValueAccessor}
   * @param fn - Handler telling other form directives and form controls to update their values.
   */
  registerOnChange(fn): void {
    this.onChange = fn;
  }

  /**
   * Registers a handler specifically for when a control receives a touch event.
   * @see {@link ControlValueAccessor}
   */
  registerOnTouched(): void {}

  /**
   * Gets the datepicker's input back to its state at instantiation, namely a blank value.
   */
  reset(): void {
    this.rawDateValue = undefined;
    this.inputDateValue = undefined;
    this.onChange(this.rawDateValue);
  }

  /**
   * Sets the date field to today's date if no value is coming from the encompassing form. It is assumed that
   * the type of the incoming data is always "string".
   * @see {@link ControlValueAccessor}
   * @param value - Value to be stored.
   */
  writeValue(value: any): void {
    if (isDefinedAndNotEmpty(value)) {
      this.onPickerSet(new Date(value));
    }
  }

  private onChange: any = () => {};
}
