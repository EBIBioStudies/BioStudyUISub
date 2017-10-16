import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {GridOptions} from 'ag-grid/main';
import {AgRendererComponent} from 'ag-grid-angular/main';

import {UserData} from 'app/auth/index';
import {ConfirmDialogComponent} from 'app/shared/index';

import {SubmissionService} from '../shared/submission.service';
import {TextFilterComponent} from './ag-grid/text-filter.component';
import {DateFilterComponent} from './ag-grid/date-filter.component';
import {PageTab} from '../shared/pagetab.model';

@Component({
    selector: 'action-buttons-cell',
    template: `
        <button *ngIf="status !== 'MODIFIED'"
                type="button" class="btn btn-danger btn-xs btn-flat"
                (click)="onDeleteSubmission()"
                tooltip="Delete"
                container="body">
            <i class="fa fa-trash-o fa-fw"></i>
        </button>
        <button *ngIf="status === 'MODIFIED'"
                type="button" class="btn btn-warning btn-xs btn-flat"
                (click)="onRevertSubmission()"
                tooltip="Undo all changes"
                container="body">
            <i class="fa fa-undo fa-fw"></i>
        </button>
        <button type="button" class="btn btn-primary btn-xs btn-flat"
                (click)="onEditSubmission()"
                tooltip="Edit"
                container="body">
            <i class="fa fa-pencil fa-fw"></i>
        </button>
        <button *ngIf="status === 'MODIFIED'"
                type="button" class="btn btn-info btn-xs btn-flat"
                (click)="onViewSubmission()"
                tooltip="View original"
                container="body">
            <i class="fa fa-eye fa-fw"></i>
        </button>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
    private accno: string;
    private onDelete: (accno: string, action: string) => {};
    private onEdit: (string) => {};
    private onView: (string) => {};

    status: string;

    agInit(params: any): void {
        const data = params.data;
        const noop = (accno: string) => {};

        this.status = data.status;
        this.accno = data.accno;
        this.onDelete = data.onDelete || noop;
        this.onEdit = data.onEdit || noop;
        this.onView = data.onView || noop;
    }

    onDeleteSubmission() {
        this.onDelete(this.accno, 'delete');
    }

    onRevertSubmission() {
        this.onDelete(this.accno, 'revert');
    }

    onEditSubmission() {
        this.onEdit(this.accno);
    }

    onViewSubmission() {
        this.onView(this.accno);
    }
}

@Component({
    selector: 'date-cell',
    template: `<span>{{value | date: 'dd/MM/yyyy'}}</span>`
})
export class DateCellComponent implements AgRendererComponent {
    value: Date;

    agInit(params: any): void {
        this.value = this.asDate(params.value);
    }

    private asDate(seconds: number): Date {
        if (seconds && seconds > 0) {
            return new Date(seconds * 1000);
        }
        return null;
    }
}

@Component({
    selector: 'subm-list',
    templateUrl: './subm-list.component.html',
    styleUrls: ['./subm-list.component.css']
})

export class SubmListComponent {
    private datasource: any;

    @ViewChild('confirmDialog')
    confirmDialog: ConfirmDialogComponent;

    error: any = null;
    showSubmitted: boolean = false;

    gridOptions: GridOptions;
    columnDefs: any[];

    constructor(private submService: SubmissionService,
                private router: Router,
                private userData: UserData) {

        this.gridOptions = <GridOptions>{
            debug: false,
            rowSelection: 'single',
            enableColResize: true,
            enableServerSideFilter: true,
            rowModelType: 'pagination',
            paginationPageSize: 15,
            rowHeight: 30,
            getRowNodeId: (item) => {
                return item.accno;
            },
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
                this.setDatasource();
            }
        };

        this.createColumnDefs();
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Accession',
                field: 'accno',
                filterFramework: TextFilterComponent
            },
            {
                headerName: 'Title',
                field: 'title',
                filterFramework: TextFilterComponent
            },
            {
                headerName: 'Release Date',
                field: 'rtime',
                cellRendererFramework: DateCellComponent,
                filterFramework: DateFilterComponent
            },
            {
                headerName: 'Status',
                field: 'status',
                cellClass: 'ag-cell-centered',
                suppressMenu: true
            },
            {
                headerName: 'Actions',
                cellClass: 'ag-cell-centered',
                suppressMenu: true,
                cellRendererFramework: ActionButtonsCellComponent
            }
        ];
    }

    setDatasource() {
        if (!this.datasource) {
            this.datasource = {
                // rowCount: ???, - not setting the row count, infinite paging will be used
                getRows: (params) => {
                    console.log('ag-grid params', params);
                    const pageSize = params.endRow - params.startRow;
                    const fm = params.filterModel || {};

                    if (this.gridOptions.api != null) {
                        this.gridOptions.api.showLoadingOverlay();
                    }

                    this.submService.getSubmissions({
                        submitted: this.showSubmitted,
                        offset: params.startRow,
                        limit: pageSize,
                        accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
                        rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
                        rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined,
                        keywords: fm.title && fm.title.value ? fm.title.value : undefined
                    })
                        .subscribe(
                            (data) => {
                                this.gridOptions.api.hideOverlay();
                                let lastRow = -1;
                                if (data.length < pageSize) {
                                    lastRow = params.startRow + data.length;
                                }
                                params.successCallback(this.decorateDataRows(data), lastRow);
                            });
                }
            }
        }
        this.gridOptions.api.setDatasource(this.datasource);
    }

    onSubmTabSelect(submitted) {
        if (this.showSubmitted !== submitted) {
            this.showSubmitted = submitted;
            this.setDatasource();
        }
    }

    decorateDataRows(rows: any[]): any {
        return rows.map(row => ({
            accno: row.accno,
            title: row.title,
            rtime: row.rtime,
            status: row.status,
            onDelete: (accno: string, action: string = 'delete') => {
                const onNext = () => {
                    this.submService
                        .deleteSubmission(accno)
                        .subscribe(data => {
                            this.setDatasource();
                        });
                };

                switch (action) {
                    case 'delete':
                        this.confirm(
                            `If you proceed, the submission with accession number ${accno} will be permanently deleted.`,
                            `Delete submission`,
                            'Delete'
                        ).subscribe(onNext);
                        break;
                    case 'revert':
                        this.confirm(
                            `If you proceed, all recent changes made to the submission with accession number ${accno} will be rolled back.`,
                            `Undo changes in submission`,
                            'Undo'
                        ).subscribe(onNext);
                        break;
                }
            },

            onEdit: (accno: string) => {
                this.router.navigate(['/submissions', accno]);
            },

            onView: (accno: string) => {
                this.router.navigate(['/view', accno]);
            }
        }));
    };

    createSubmission() {
        // const userName = this.userData.name;
        // const userEmail = this.userData.email;
        // const userOrcid = this.userData.orcid;

        this.submService.createSubmission(PageTab.createNew())
            .subscribe((s) => {
                console.log('created submission:', s);
                this.startEditing(s.accno);
            });
    };

    uploadSubmission() {
        this.router.navigate(['/submissions/direct_upload']);
    }

    startEditing(accno) {
        this.router.navigate(['/submissions', accno]);
    }

    confirm(text: string, title: string, confirmLabel: string): Observable<any> {
        this.confirmDialog.title = title;
        this.confirmDialog.confirmLabel = confirmLabel;
        return this.confirmDialog.confirm(text);
    }
}
