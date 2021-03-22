import { Component, ViewChild } from '@angular/core';
import { IFilterParams, IDoesFilterPassParams, RowNode } from 'ag-grid-community/main';
import { AgFilterComponent } from 'ag-grid-angular';

@Component({
  selector: 'st-ag-acc-filter',
  templateUrl: 'text-filter.component.html'
})
export class TextFilterComponent implements AgFilterComponent {
  @ViewChild('inputEl', { static: true }) inputEl;
  text: string = '';
  private params?: IFilterParams;
  private prev: string = '';
  private valueGetter?: (rowNode: RowNode) => any;

  afterGuiAttached(): void {
    this.inputEl.nativeElement.focus();
  }

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.text
      .toLowerCase()
      .split(' ')
      .every((filterWord) => {
        return this.valueGetter!(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
  }

  getModel(): any {
    return { value: this.text };
  }

  isFilterActive(): boolean {
    return this.text !== null && this.text !== undefined && this.text !== '';
  }

  notifyAboutChanges(): void {
    if (this.text !== this.prev) {
      this.prev = this.text;
      this.params!.filterChangedCallback();
    }
  }

  onApplyClick(): void {
    this.notifyAboutChanges();
  }

  onClearClick(): void {
    this.text = '';
    this.notifyAboutChanges();
  }

  setModel(model: any): void {
    if (model) {
      this.text = model.value;
    }
  }
}
