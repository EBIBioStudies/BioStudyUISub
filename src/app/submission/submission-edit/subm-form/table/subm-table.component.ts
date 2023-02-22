import { ChangeDetectorRef, Component, DoCheck, Input, OnInit } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PasteTableDataModalComponent } from './paste-table-data-modal.component';
import { TableForm } from '../../shared/model/table-form.model';
import { ModalService } from 'app/shared/modal/modal.service';

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

  constructor(
    private changeRef: ChangeDetectorRef,
    public userData: UserData,
    private modalService: BsModalService,
    private stModalService: ModalService
  ) {}

  get allowedColNames(): string[] {
    return this.submTableAllowedColNames;
  }

  get uniqueColNames(): string[] {
    return this.submTableUniqueColNames;
  }

  get errorNum(): number {
    return this.submTableErrorNum;
  }

  get canRemove(): boolean {
    return !this.tableForm.isRequired && !this.tableForm.isReadonly && !this.readonly;
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

  onTableDataPaste(tableData: string[][], isFirstRowHeaders: boolean, appendData: boolean): void {
    // If pasted data is not appended then clear the existing entries in the table.
    if (!appendData) {
      this.tableForm.reset();
    }

    let headerRow: string[] = [];
    if (isFirstRowHeaders) {
      headerRow = tableData.shift() || [];

      headerRow.forEach((columnName) => {
        if (!this.tableForm.hasColumn(columnName)) {
          this.tableForm.addColumn(columnName);
        }
      });
    }

    tableData.forEach((rowCells) => {
      this.tableForm.addRowWithData(rowCells, headerRow);
    });
  }

  onRemoveSection(): void {
    this.stModalService
      .confirm(
        'Are you sure you want to permanently remove this section?',
        `Delete ${this.tableForm.prettyName} section`,
        'Delete'
      )
      .subscribe((hasConfirmed) => {
        if (hasConfirmed) {
          this.tableForm.reset();
          this.tableForm.form.disable();
        }
      });
  }

  openPasteTableDataModal(): void {
    this.modalService.show(PasteTableDataModalComponent, {
      initialState: { onTableDataPaste: this.onTableDataPaste.bind(this) },
      class: 'modal-lg'
    });
  }
}
