import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TooltipModule} from 'ng2-bootstrap';

import {Router} from '@angular/router';

import tmpl from './subm-list.component.html'
import {SubmissionService, SubmissionModel} from './index';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!';
import 'ag-grid/dist/styles/theme-fresh.css!';

import {AgRendererComponent} from 'ag-grid-ng2/main';
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
                (select)="onSubmTypeSelect(false)"></tab>
           <tab heading="Submitted Submissions"
                [active]="showSubmitted" 
                (select)="onSubmTypeSelect(true)"></tab>
        </tabset>
        
        <section class="content">
            <div class="panel panel-info">
                <div class="panel-heading clearfix">
                    <span>(current page: {{currentPage}})</span>
                    <span>(page size: {{itemsPerPage}})</span>
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
                                     [columnDefs]="columnDefs"
                                     [rowData]="rowData">
                        </ag-grid-ng2>
                    </div>
                    <div>
                        <pager [totalItems]="totalItems"
                               [itemsPerPage]="itemsPerPage"
                               [(ngModel)]="currentPage"
                               (pageChanged)="onPageChanged($event)"
                               pageBtnClass="btn"></pager>
                        <!--pagination [totalItems]="totalItems"
                                    [(ngModel)]="currentPage"
                                    [maxSize]="5"
                                    class="pagination-sm"
                                    [boundaryLinks]="true"
                                    [rotate]="false"
                                    (pageChanged)="onPageChanged($event)"></pagination-->
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
    private rows: any[];
    private currentPage: number = 1;
    private totalItems: number = 0;
    private itemsPerPage: number = 15;

    private showSubmitted: boolean = false;

    error: any = null;

    constructor(@Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel,
                @Inject(Router) private router: Router,
                @Inject(UserData) private userData: UserData) {

        this.gridOptions = <GridOptions>{
            debug: true,
            rowSelection: 'single',
            enableColResize: true,
            rowHeight: 30,
            getRowNodeId: (item) => {
                return item.accno;
            },
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
                this.loadDataRows();
            }
        };

        this.createColumnDefs();
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Accession',
                field: 'accno',
                suppressSorting: true
            },
            {
                headerName: 'Title',
                field: 'title'
            },
            {
                headerName: 'Release Date',
                field: 'rtime',
                cellRendererFramework: DateCellComponent
            },
            {
                headerName: 'Status',
                field: 'status',
            },
            {
                headerName: 'Actions',
                suppressMenu: true,
                cellRendererFramework: ActionButtonsCellComponent
            }
        ];
    }

    loadDataRows() {
        let offset = (this.currentPage - 1) * this.itemsPerPage;
        let limit = this.itemsPerPage;
        this.submService.getSubmissions(this.showSubmitted, offset, limit)
            .subscribe((data) => {
                console.debug('SubmList: data loaded');
                this.setDataRows(data);
            });
    }

    onPageChanged(ev) {
        console.debug('SubmList: current page number changed: ' + ev.page);
        this.currentPage = ev.page;
        this.loadDataRows();
    }

    onSubmTypeSelect(submitted) {
        this.showSubmitted = submitted;
        this.currentPage = 1;
        this.loadDataRows();
    }

    setDataRows(rows) {
        this.rows = rows;
        this.totalItems = (this.currentPage - 1)*this.itemsPerPage + this.rows.length + 1;
        this.gridOptions.api.setRowData(this.decorateDataRows(this.rows));
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
                        this.loadDataRows();
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