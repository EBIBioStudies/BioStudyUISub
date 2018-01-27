import {
    Component,
    ViewChild
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
    templateUrl: 'text-filter.component.html'
})
export class TextFilterComponent implements AgFilterComponent {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;

    text: string = '';
    private prev: string = '';
    private hide: Function;

    @ViewChild('inputEl') public inputEl;

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
        this.inputEl.nativeElement.focus();
        this.hide = params.hidePopup;
    }

    onApplyClick(ev): void {
        this.notifyAboutChanges();
    }

    onClearClick(event): void {
        this.text = '';
        this.notifyAboutChanges();
    }

    notifyAboutChanges() {
        if (this.text !== this.prev) {
            this.prev = this.text;
            this.params.filterChangedCallback();
        }
        this.hide();
    }
}
