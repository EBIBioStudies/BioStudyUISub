import { Component, QueryList, ViewChildren } from '@angular/core';
import {
  IFilterParams,
  IDoesFilterPassParams,
  RowNode,
  IAfterGuiAttachedParams
} from 'ag-grid-community/main';
import { AgFilterComponent } from 'ag-grid-angular';
import { DateInputComponent } from 'app/shared/date-input/date-input.component';

class DateRange {
  constructor(
    public from?: string,
    public to?: string
  ) {}

  private static isValueEmpty(v: any): boolean {
    return v === null || v === undefined && v === '';
  }

  copy(): DateRange {
    return new DateRange(this.from, this.to);
  }

  equalsTo(obj?: DateRange): boolean {
    return (obj && this.from === obj.from && this.to === obj.to) === true;
  }

  getRange(): any {
    return {
      from: this.from,
      to: this.to
    };
  }

  isEmpty(): boolean {
    return DateRange.isValueEmpty(this.from) && DateRange.isValueEmpty(this.to);
  }
}

@Component({
  selector: 'st-ag-date-filter',
  templateUrl: 'date-filter.component.html'
})
export class DateFilterComponent implements AgFilterComponent {
  @ViewChildren(DateInputComponent) dateInputs?: QueryList<DateInputComponent>;
  hide?: () => void;
  selection;

  private date?: DateRange;
  private params?: IFilterParams;
  private prev?: DateRange;
  private valueGetter?: (rowNode: RowNode) => any;

  get isInvalidRange(): boolean {
    const s = this.date!.getRange();
    return this.between && s.from > s.to;
  }

  get after(): boolean {
    return this.selection === 'after';
  }

  get before(): boolean {
    return this.selection === 'before';
  }

  get between(): boolean {
    return this.selection === 'between';
  }

  afterGuiAttached(params: IAfterGuiAttachedParams): void {
    this.hide = params.hidePopup;
  }

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
    this.reset();
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const seconds = this.valueGetter!(params.node);
    if (seconds === undefined || seconds === null || seconds < 0) {
      return false;
    }

    const s = this.date!.getRange();
    if (this.after) {
      return seconds >= s.from;
    } else if (this.before) {
      return seconds < s.to;
    } else if (this.between) {
      return seconds >= s.from && seconds <= s.to && s.from <= s.to;
    }

    return true;
  }

  getModel(): any {
    return { value: this.date!.getRange() };
  }

  isFilterActive(): boolean {
    return !this.date!.isEmpty();
  }

  onApplyClick(): void {
    this.notifyAboutChanges();
  }

  /**
   * Resets the state so that it ceases to be on filtered mode. This is fulfilled by
   * setting the date to any "empty" value.
   * @see {@link DateRange.hasValue}
   */
  onClearClick(): void {
    this.reset();
    this.notifyAboutChanges();
  }

  onFromChange(): void {
    if (!this.between) {
      return;
    }

    const s = this.date!.getRange();
    if (s.from > s.to) {
      this.reset();
    }
  }

  onSelectionChange(value): void {
    this.selection = value;
    if (this.after) {
      this.date!.to = undefined;
    }
    if (this.before) {
      this.date!.from = undefined;
    }
  }

  onToChange(): void {
    if (!this.between) {
      return;
    }
  }

  /**
   * Sets all date fields and the underlying date range model to initial values.
   */
  reset(): void {
    this.selection = 'after';
    this.date = new DateRange();

    if (this.dateInputs) {
      this.dateInputs.forEach((dateInput) => dateInput.reset());
    }
  }

  setModel(model: any): void {
    if (model) {
      this.date = new DateRange(model.value.from, model.value.to);
    }
  }

  private notifyAboutChanges(): void {
    if (!this.date!.equalsTo(this.prev)) {
      this.prev = this.date!.copy();
      this.params!.filterChangedCallback();
    }

    if (this.hide) {
      this.hide();
    }
  }
}
