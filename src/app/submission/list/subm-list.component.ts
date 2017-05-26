import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {GridOptions} from 'ag-grid/main';
import {AgRendererComponent} from 'ag-grid-angular/main';

import {SubmissionModel} from 'app/submission-model/index';
import {UserData} from 'app/auth/index';
import {ConfirmDialogComponent} from 'app/shared/index';

import {SubmissionService} from '../shared/submission.service';
import {TextFilterComponent} from './ag-grid/text-filter.component';
import {DateFilterComponent} from './ag-grid/date-filter.component';


import * as _ from 'lodash';

@Component({
    selector: 'action-buttons-cell',
    template: `
        <button *ngIf="status !== 'MODIFIED'"
                type="button" class="btn btn-danger btn-xs btn-flat"
                (click)="onDeleteSubmission()"
                tooltip="delete"
                container="body">
            <i class="fa fa-trash-o fa-fw"></i>
        </button>
        <button *ngIf="status === 'MODIFIED'"
                type="button" class="btn btn-warning btn-xs btn-flat"
                (click)="onRevertSubmission()"
                tooltip="undo all changes"
                container="body">
            <i class="fa fa-undo fa-fw"></i>
        </button>
        <button type="button" class="btn btn-primary btn-xs btn-flat"
                (click)="onEditSubmission()"
                tooltip="edit"
                container="body">
            <i class="fa fa-pencil fa-fw"></i>
        </button>
        <button *ngIf="status === 'MODIFIED'"
                type="button" class="btn btn-info btn-xs btn-flat"
                (click)="onViewSubmission()"
                tooltip="view original"
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
        let data = params.data;
        this.status = data.status;
        this.accno = data.accno;

        let noop = (accno: string) => {
        };
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
    template: `
        <container-root>

            <aside class="right-side stretch" style="padding-top: 5px">
                <tabset>
                    <tab heading="New / Modified Submissions"
                         [active]="!showSubmitted"
                         (select)="onSubmTabSelect(false)"></tab>
                    <tab heading="Submitted Submissions"
                         [active]="showSubmitted"
                         (select)="onSubmTabSelect(true)"></tab>
                </tabset>

                <section class="content">
                    <div class="panel panel-info">
                        <div class="panel-heading clearfix">
                            <p class="pull-right">
                                <a class="pull-right btn btn-default btn-xs"
                                   (click)="createSubmission()">
                                    <i class="fa fa-file-text-o" aria-hidden="true"></i>
                                    <span>Create new submission</span>
                                </a>
                                <a style="margin-right:3px"
                                   class="pull-right btn btn-default btn-xs"
                                   (click)="uploadSubmission()">
                                    <i class="fa fa-upload" aria-hidden="true"></i>
                                    <span>Direct upload</span>
                                </a>
                            </p>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <ag-grid-angular #agGrid style="width: 100%; height: 500px;" class="ag-fresh"
                                                 [gridOptions]="gridOptions"
                                                 [columnDefs]="columnDefs">
                                </ag-grid-angular>
                            </div>
                        </div>
                    </div>
                </section>

            </aside>

        </container-root>
        <confirm-dialog #confirmDialog></confirm-dialog>
    `
})

export class SubmissionListComponent {
    private datasource: any;

    @ViewChild('confirmDialog')
    confirmDialog: ConfirmDialogComponent;

    error: any = null;
    showSubmitted: boolean = false;

    gridOptions: GridOptions;
    columnDefs: any[];

    constructor(private submService: SubmissionService,
                private submModel: SubmissionModel,
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
                suppressMenu: true
            },
            {
                headerName: 'Actions',
                suppressMenu: true,
                cellRendererFramework: ActionButtonsCellComponent
            }
        ];
    }

    setDatasource() {
        if (!this.datasource) {
            this.datasource = {
                //rowCount: ???, - not setting the row count, infinite paging will be used
                getRows: (params) => {
                    console.log('ag-grid params', params);
                    let pageSize = params.endRow - params.startRow;
                    let fm = params.filterModel || {};

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
        if (this.showSubmitted != submitted) {
            this.showSubmitted = submitted;
            this.setDatasource();
        }
    }

    decorateDataRows(rows: any[]) {
        return _.map(rows, (row: any) => ({
            accno: row.accno,
            title: row.title,
            rtime: row.rtime,
            status: row.status,
            onDelete: (accno: string, deleteOrRevert: string = 'delete') => {
                const action = deleteOrRevert === 'delete' ? 'delete' : 'undo all changes for';
                this.confirm(`Do you want to ${action} submission with accession number ${accno}?`)
                    .subscribe(() => {
                        this.submService
                            .deleteSubmission(accno)
                            .subscribe(data => {
                                this.setDatasource();
                            });
                    });
            },

            onEdit: (accno: string) => {
                this.router.navigate(['/edit', accno]);
            },

            onView: (accno: string) => {
                this.router.navigate(['/view', accno]);
            }
        }));
    };

    createSubmission() {
        let userName = this.userData.name;
        let userEmail = this.userData.email;
        let userOrcid = this.userData.orcid;

        let sbm = this.submModel.createNew(userName, userEmail, userOrcid);
        this.submService.createSubmission(sbm)
            .subscribe((sbm) => {
                console.log("created submission:", sbm);
                this.startEditing(sbm.accno);
            });
    };

    uploadSubmission() {
        this.router.navigate(['/direct_upload']);
    }

    startEditing(accno) {
        this.router.navigate(['/edit', accno]);
    }

    confirm(text: string): Observable<any> {
        return this.confirmDialog.confirm(text);
    }
}