import { ChangeDetectorRef, Component, DoCheck, Input, OnInit } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ImportTableDataModalComponent } from './import-table-data-modal.component';
import { TableForm } from '../../shared/model/table-form.model';

interface TableOperation {
  callback: () => void;
  label: string;
}

@Component({
  selector: 'st-subm-table',
  templateUrl: './subm-table.component.html',
  styleUrls: ['./subm-table.component.css']
})
export class SubmTableComponent implements OnInit, DoCheck {
  @Input() tableForm!: TableForm;
  operations: TableOperation[] = [];
  @Input() readonly?: boolean = false;

  private submTableAllowedColNames: string[] = [];
  private submTableErrorNum: number = 0;
  private submTableUniqueColNames: string[] = [];
  private colTypeNames: string[] = [];

  constructor(private changeRef: ChangeDetectorRef, public userData: UserData, private modalService: BsModalService) {}

  get allowedColNames(): string[] {
    return this.submTableAllowedColNames;
  }

  get uniqueColNames(): string[] {
    return this.submTableUniqueColNames;
  }

  get errorNum(): number {
    return this.submTableErrorNum;
  }

  /**
   * Counts the number of errors if the table is not empty.
   */
  ngDoCheck(): void {
    this.submTableErrorNum = Object.keys(this.tableForm.form.errors || {}).length;
    this.submTableUniqueColNames = this.colTypeNames.filter((name) => this.tableForm.columnNames.includes(name));
    this.submTableAllowedColNames = this.tableForm.hasUniqueColumns ? this.submTableUniqueColNames : this.colTypeNames;
    this.changeRef.detectChanges();
  }

  ngOnInit(): void {
    if (this.tableForm === undefined) {
      return;
    }

    this.operations.push({
      label: 'Add column',
      callback: () => {
        this.tableForm.addColumn();
      }
    });

    this.operations.push({
      label: 'Add row',
      callback: () => {
        this.tableForm.addRow();
      }
    });
  }

  onTableDataImport(tableData: string[][], isFirstRowHeaders: boolean, appendData: boolean): void {
    // If imported data is not appended then clear the existing entries in the table.
    if (!appendData) {
      this.tableForm.reset();
    }

    tableData.forEach((cells, index) => {
      const firstRow = index === 0;

      if (firstRow && isFirstRowHeaders) {
        cells.forEach((columnName) => {
          if (!this.tableForm.hasColumn(columnName)) {
            this.tableForm.addColumn(columnName);
          }
        });
      } else {
        this.tableForm.addRowWithData(cells);
      }
    });
  }

  openImportTableDataModal(): void {
    this.modalService.show(ImportTableDataModalComponent, {
      initialState: { onTableDataImport: this.onTableDataImport.bind(this) }
    });
  }
}
