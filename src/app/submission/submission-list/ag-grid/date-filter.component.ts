import { Component, QueryList, ViewChildren } from '@angular/core';
import {
    IFilterParams,
    IDoesFilterPassParams,
    RowNode,
    IAfterGuiAttachedParams
} from 'ag-grid-community/main';
import { AgFilterComponent } from 'ag-grid-angular/main';
import { DateInputComponent } from '../../../shared/date-input.component';

class DateRange {
    private static isValueEmpty(v: any): boolean {
        return v === null || v === undefined && v === '';
    }

    constructor(
        public from?: string,
        public to?: string
    ) {}

    isEmpty(): boolean {
        return DateRange.isValueEmpty(this.from) && DateRange.isValueEmpty(this.to);
    }

    equalsTo(obj?: DateRange): boolean {
        return (obj && this.from === obj.from && this.to === obj.to) === true;
    }

    copy(): DateRange {
        return new DateRange(this.from, this.to);
    }

    getRange(): any {
        return {
            from: this.from,
            to: this.to
        };
    }
}

@Component({
    selector: 'ag-date-filter',
    templateUrl: 'date-filter.component.html'
})
export class DateFilterComponent implements AgFilterComponent {
    private params?: IFilterParams;
    private valueGetter?: (rowNode: RowNode) => any;
    private selection;
    private date?: DateRange;
    private prev?: DateRange;

    hide?: Function;

    @ViewChildren(DateInputComponent) dateInputs?: QueryList<DateInputComponent>;

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
        this.reset();
    }

    /**
     * Sets all date fields and the underlying date range model to initial values.
     */
    reset() {
        this.selection = 'after';
        this.date = new DateRange();

        if (this.dateInputs) {
            this.dateInputs.forEach((dateInput) => dateInput.reset());
        }
    }

    isFilterActive(): boolean {
        return !this.date!.isEmpty();
    }

    get isInvalidRange(): boolean {
        const s = this.date!.getRange();
        return this.between && s.from > s.to;
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
        return {value: this.date!.getRange()};
    }

    setModel(model: any): void {
        if (model) {
            this.date = new DateRange(model.value.from, model.value.to);
        }
    }

    afterGuiAttached(params: IAfterGuiAttachedParams): void {
        this.hide = params.hidePopup;
    }

    private notifyAboutChanges() {
        if (!this.date!.equalsTo(this.prev)) {
            this.prev = this.date!.copy();
            this.params!.filterChangedCallback();
        }

        if (this.hide) {
            this.hide();
        }
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

    onSelectionChange(value): void {
        this.selection = value;
        if (this.after) {
            this.date!.to = undefined;
        }
        if (this.before) {
            this.date!.from = undefined;
        }
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

    onToChange() {
        if (!this.between) {
            return;
        }
    }

    onFromChange() {
        if (!this.between) {
            return;
        }

        const s = this.date!.getRange();
        if (s.from > s.to) {
            this.reset();
        }
    }
}
