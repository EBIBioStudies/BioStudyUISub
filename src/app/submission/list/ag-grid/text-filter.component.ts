import {
    Component,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {
    IFilterParams,
    IDoesFilterPassParams,
    RowNode,
    IAfterGuiAttachedParams
} from 'ag-grid/main';

import {AgFilterComponent} from 'ag-grid-angular/main';

@Component({
    selector: 'ag-acc-filter',
    template: `
    <div style="padding:5px">
        <span>Filter:&nbsp;</span>
        <input #input 
              [(ngModel)]="text">
    </div>
    <div style="padding:0 5px 5px 5px;text-align:right">
        <button (click)="onApplyClick($event)">apply</button>
    </div>
    `
})
export class TextFilterComponent implements AgFilterComponent {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;

    text: string = '';
    private prev: string = '';

    @ViewChild('input', {read: ViewContainerRef}) public input;

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
    }

    isFilterActive(): boolean {
        return this.text !== null && this.text !== undefined && this.text !== '';
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        return this.text.toLowerCase()
            .split(" ")
            .every((filterWord) => {
                return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
            });
    }

    getModel(): any {
        return {value: this.text};
    }

    setModel(model: any): void {
        this.text = model.value;
    }

    afterGuiAttached(params: IAfterGuiAttachedParams): void {
        this.input.element.nativeElement.focus();
    }

    onApplyClick(ev): void {
        this.notifyAboutChanges();
    }

    notifyAboutChanges() {
        if (this.text !== this.prev) {
            this.prev = this.text;
            this.params.filterChangedCallback();
        }
    }
}
