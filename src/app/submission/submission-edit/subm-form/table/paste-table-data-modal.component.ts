import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-paste-modal',
  templateUrl: './paste-table-data-modal.component.html'
})
export class PasteTableDataModalComponent {
  private tableData: string[][] = [];
  isFirstRowHeaders: boolean = false;
  appendData: boolean = false;
  requireData: boolean = false;
  @Input() onTableDataPaste: (
    tableData: string[][],
    isFirstRowHeaders: boolean,
    appendData: boolean
  ) => void = () => {};

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  onCancelCloseClick(): void {
    this.hide();
  }

  onImportClick(): void {
    if (this.tableData.length === 0) {
      this.requireData = true;
    } else {
      this.onTableDataPaste(this.tableData, this.isFirstRowHeaders, this.appendData);
      this.hide();
    }
  }

  onTextAreaChange(event): void {
    const data = event.target.value;

    this.tableData = [];

    if (data) {
      const rows = data.split('\n');

      rows.forEach((row) => {
        this.tableData.push(row.split(/\t/g).map((item) => item.trim()));
      });
    }
  }

  onIsFirstRowHeadersChange(event): void {
    this.isFirstRowHeaders = event.target.checked;
  }

  onAppendDataChange(event): void {
    this.appendData = event.target.checked;
  }
}
