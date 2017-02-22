import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TooltipModule} from 'ng2-bootstrap';

import {Router} from '@angular/router';

import {SubmissionService, SubmissionModel} from './index';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!';
import 'ag-grid/dist/styles/theme-fresh.css!';

import {AgRendererComponent} from 'ag-grid-ng2/main';
import {AccessionFilterComponent} from './ag-grid/acc-filter.component';
import {DateFilterComponent} from './ag-grid/date-filter.component';
import {UserData} from '../auth/index';

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
                                    (click)="onDeleteSubmission()"
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
    private status: string;
    private accno: string;
    private onDelete: (string)=>{};
    private onEdit: (string)=>{};
    private onView: (string)=>{};

    agInit(params: any): void {
        let data = params.data;
        this.status = data.status;
        this.accno = data.accno;

        let noop = (accno:string) => {};
        this.onDelete = data.onDelete || noop;
        this.onEdit = data.onEdit || noop;
        this.onView = data.onView || noop;
    }

    onDeleteSubmission() {
        this.onDelete(this.accno);
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

    <aside class="right-side strech" style="padding-top: 5px">
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
                           (click)="createSubmission()">Create a new submission
                        </a>
                    </p>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <ag-grid-ng2 #agGrid style="width: 100%; height: 500px;" class="ag-fresh"
                                     [gridOptions]="gridOptions"
                                     [columnDefs]="columnDefs">
                        </ag-grid-ng2>
                    </div>
                </div>
            </div>
        </section>

    </aside>
</container-root>
`
})

export class SubmissionListComponent {

    private gridOptions: GridOptions;
    private columnDefs: any[];
    private datasource: any;

    private showSubmitted: boolean = false;

    error: any = null;

    constructor(@Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel,
                @Inject(Router) private router: Router,
                @Inject(UserData) private userData: UserData) {

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
                filterFramework: AccessionFilterComponent
            },
            {
                headerName: 'Title',
                field: 'title',
                suppressMenu: true
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

                    this.gridOptions.api.showLoadingOverlay();

                    this.submService.getSubmissions({
                        submitted: this.showSubmitted,
                        offset: params.startRow,
                        limit: pageSize,
                        accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
                        rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
                        rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined
                        //keywords:
                    })
                        .subscribe((data) => {
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
        console.log('on submission tab select');
        if (this.showSubmitted != submitted) {
            this.showSubmitted = submitted;
            this.gridOptions.api.onFilterChanged();
        }
    }

    decorateDataRows(rows: any[]) {
        return _.map(rows, (row:any) => ({
            accno: row.accno,
            title: row.title,
            rtime: row.rtime,
            status: row.status,
            onDelete: (accno:string) => {
                console.debug('SubmList: (onDelete): accno=' + accno);
                this.submService
                    .deleteSubmission(accno)
                    .subscribe(() => {
                        this.setDatasource();
                    });
            },

            onEdit: (accno:string) => {
                console.debug('SubmList: (onEdit): accno=' + accno);
                this.router.navigate(['/edit', accno]);
            },

            onView: (accno:string) => {
                console.debug('SubmList: (onView): accno=' + accno);
                this.router.navigate(['/view', accno]);
            }
        }));
    };

    createSubmission = function () {
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

    startEditing(accno) {
        this.router.navigate(['/edit', accno]);
    }
}