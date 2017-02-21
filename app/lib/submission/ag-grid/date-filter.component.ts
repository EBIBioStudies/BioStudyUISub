import {Component, ViewChild, ViewContainerRef} from '@angular/core';

import {IFilterParams, IDoesFilterPassParams, RowNode, IAfterGuiAttachedParams} from 'ag-grid/main';
import {AgFilterComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'ag-date-filter',
    template: `
<div style="width:250px">
    <div style="padding:5px;">
        <select style="margin: 5px 0" (change)="onSelectionChange($event)">
            <option value="after" [selected]="after">after</option>
            <option value="before" [selected]="before">before</option>
            <option value="between" [selected]="between">between</option>
        </select>
        <date-input-box
            *ngIf="after || between"
            name="date1"
            (ngModelChange)="onDate1Change($event)"
            [(ngModel)]="date1"
            bsstDateFormat>
        </date-input-box>
        <date-input-box
            *ngIf="before || between"
            name="date2"
            (ngModelChange)="onDate2Change($event)"
            [(ngModel)]="date2"
            bsstDateFormat>
        </date-input-box>
    </div>
    <div style="padding:0 5px 5px 5px;text-align:right">
        <button (click)="onRefreshClick($event)">apply</button>
    </div>
</div>
    `
})
export class DateFilterComponent implements AgFilterComponent {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;

    private date1: string = '';
    private date2: string = '';
    private seconds1: number;
    private seconds2: number;
    private selection: string = 'after';

    private prev1: string = '';
    private prev2: string = '';

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
    }

    isFilterActive(): boolean {
        return this.notEmpty(this.date1) || this.notEmpty(this.date2);
    }

    notEmpty(v): boolean {
        return v !== null && v !== undefined && v !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return true;
        /* todo this.text.toLowerCase()
         .split(" ")
         .every((filterWord) => {
         return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
         });*/
    }

    getModel(): any {
        return {value: {from: this.date1, to: this.date2}};
    }

    setModel(model: any): void {
        this.date1 = model.value.from;
        this.date2 = model.value.to;
    }

    afterGuiAttached(params: IAfterGuiAttachedParams): void {
    }

    notifyAboutChanges() {
        if (this.date1 !== this.prev1 ||
            this.date2 !== this.prev2) {
            this.prev1 = this.date1;
            this.prev2 = this.date2;
            this.params.filterChangedCallback();
        }
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
            this.date2 = '';
        }
        if (this.before) {
            this.date1 = '';
        }
    }

    onRefreshClick(ev): void {
        this.notifyAboutChanges();
    }

    onDate1Change(ev):void {
        //todo
    }

    onDate2Change(ev):void {
        //todo
    }
}
