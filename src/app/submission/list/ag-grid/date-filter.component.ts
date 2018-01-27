import {Component} from '@angular/core';

import {
    IFilterParams,
    IDoesFilterPassParams,
    RowNode,
    IAfterGuiAttachedParams
} from 'ag-grid/main';

import {AgFilterComponent} from 'ag-grid-angular/main';

import {parseDate, formatDate} from 'app/submission-shared/date.utils';

class DateRange {
    constructor(public from: string = '',
                public to: string = '') {
    }

    isEmpty(): boolean {
        return !DateRange.hasValue(this.from) && !DateRange.hasValue(this.to);
    }

    equalsTo(obj: DateRange): boolean {
        return obj && this.from === obj.from && this.to === obj.to;
    }

    copy(): DateRange {
        return new DateRange(this.from, this.to);
    }

    toSeconds(): any {
        return {
            from: DateRange.asSeconds(this.from),
            to: DateRange.asSeconds(this.to)
        }
    }

    public static fromSeconds(from: number, to: number): DateRange {
        return new DateRange(
            DateRange.asDateString(from), DateRange.asDateString(to));
    }

    private static asSeconds(dateString: string): number {
        if (!DateRange.hasValue(dateString)) {
            return undefined;
        }
        return parseDate(dateString).getTime() / 1000;
    }

    private static asDateString(seconds: number): string {
        if (!DateRange.hasValue(seconds)) {
            return '';
        }
        let date = new Date();
        date.setTime(seconds * 1000);
        return formatDate(date);
    }

    private static hasValue(v: any): boolean {
        return v !== null && v !== undefined && v !== '';
    }
}

@Component({
    selector: 'ag-date-filter',
    templateUrl: 'date-filter.component.html'
})
export class DateFilterComponent implements AgFilterComponent {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    private hide: Function;
    private selection: string = 'after';
    private date: DateRange = new DateRange();
    private prev: DateRange;

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
    }

    isFilterActive(): boolean {
        return !this.date.isEmpty();
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        let seconds = this.valueGetter(params.node);
        if (seconds == undefined || seconds == null || seconds < 0) {
            return false;
        }
        const s = this.date.toSeconds();
        if (this.after) {
            return seconds >= s.from;
        } else if (this.before) {
            return seconds < s.to;
        } else if (this.between) {
            return seconds >= s.from && seconds < s.to;
        }
    }

    getModel(): any {
        return {value: this.date.toSeconds()};
    }

    setModel(model: any): void {
        this.date = DateRange.fromSeconds(model.value.from, model.value.to);
    }

    afterGuiAttached(params: IAfterGuiAttachedParams): void {
        this.hide = params.hidePopup;
    }

    private notifyAboutChanges() {
        if (!this.date.equalsTo(this.prev)) {
            this.prev = this.date.copy();
            this.params.filterChangedCallback();
        }
        this.hide();
    }

    get after(): boolean {
        return this.selection === "after";
    }

    get before(): boolean {
        return this.selection === "before";
    }

    get between(): boolean {
        return this.selection === "between";
    }

    onSelectionChange(ev): void {
        this.selection = ev.target.value;
        if (this.after) {
            this.date.to = '';
        }
        if (this.before) {
            this.date.from = '';
        }
    }

    onApplyClick(ev): void {
        this.notifyAboutChanges();
    }

    onClearClick(event): void {
        this.date.to = '';
        this.date.from = '';
        this.notifyAboutChanges();
    }
}
