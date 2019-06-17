import { Component, QueryList, ViewChildren } from '@angular/core';
import {
    IFilterParams,
    IDoesFilterPassParams,
    RowNode,
    IAfterGuiAttachedParams
} from 'ag-grid-community/main';
import { AgFilterComponent } from 'ag-grid-angular/main';
import { parseDate, formatDate } from 'app/utils';
import { DateInputComponent } from '../../../shared/date-input.component';

class DateRange {
    public static fromSeconds(from: number, to: number): DateRange {
        return new DateRange(
            DateRange.asDateString(from), DateRange.asDateString(to));
    }

    private static asSeconds(dateString?: string): number | undefined {
        if (DateRange.isValueEmpty(dateString)) {
            return undefined;
        }
        const date = parseDate(dateString!);
        return date ? date.getTime() / 1000 : undefined;
    }

    private static asDateString(seconds?: number): string {
        if (DateRange.isValueEmpty(seconds)) {
            return '';
        }
        const date = new Date();
        date.setTime(seconds! * 1000);
        return formatDate(date);
    }

    private static isValueEmpty(v: any): boolean {
        return v === null || v === undefined && v === '';
    }

    constructor(public from?: string,
                public to?: string) {
    }

    isEmpty(): boolean {
        return DateRange.isValueEmpty(this.from) && DateRange.isValueEmpty(this.to);
    }

    equalsTo(obj?: DateRange): boolean {
        return (obj && this.from === obj.from && this.to === obj.to) === true;
    }

    copy(): DateRange {
        return new DateRange(this.from, this.to);
    }

    toSeconds(): any {
        return {
            from: DateRange.asSeconds(this.from),
            to: DateRange.asSeconds(this.to)
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
    private hide?: Function;
    private selection;
    private date?: DateRange;
    private prev?: DateRange;

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

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        const seconds = this.valueGetter!(params.node);
        if (seconds === undefined || seconds === null || seconds < 0) {
            return false;
        }
        const s = this.date!.toSeconds();
        if (this.after) {
            return seconds >= s.from;
        } else if (this.before) {
            return seconds < s.to;
        } else if (this.between) {
            return seconds >= s.from && seconds < s.to;
        }
        return true;
    }

    getModel(): any {
        return {value: this.date!.toSeconds()};
    }

    setModel(model: any): void {
        if (model) {
            this.date = DateRange.fromSeconds(model.value.from, model.value.to);
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
        this.hide && this.hide();
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

    onSelectionChange(ev): void {
        this.selection = ev.target.value;
        if (this.after) {
            this.date!.to = undefined;
        }
        if (this.before) {
            this.date!.from = undefined;
        }
    }

    onApplyClick(ev): void {
        this.notifyAboutChanges();
    }

    /**
     * Resets the state so that it ceases to be on filtered mode. This is fulfilled by
     * setting the date to any "empty" value.
     * @see {@link DateRange.hasValue}
     * @param event DOM event for the click action.
     */
    onClearClick(event): void {
        this.reset();
        this.notifyAboutChanges();
    }
}
