import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule} from '@angular/common';
import {TooltipModule} from 'ng2-bootstrap/ng2-bootstrap';

import {Router} from '@angular/router';

import tmpl from './subm-list.component.html'
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel} from '../../submission/submission.model';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';
import {UserSession} from '../../session/user-session';

import * as _ from 'lodash';

@Component({
    selector: 'action-buttons-cell',
    template: `
                           <button *ngIf="status !== 'MODIFIED'"
                                    type="button" class="btn btn-danger btn-xs btn-flat"
                                    (click)="onDeleteSubmission()"
                                    tooltip="delete"
                                    tooltipAppendToBody="true">
                                <i class="fa fa-trash-o fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-warning btn-xs btn-flat"
                                    (click)="onDeleteSubmission()"
                                    tooltip="undo all changes"
                                    tooltipAppendToBody="true">
                                <i class="fa fa-undo fa-fw"></i>
                           </button>
                           <button type="button" class="btn btn-primary btn-xs btn-flat"
                                    (click)="onEditSubmission()"
                                    tooltip="edit"
                                    tooltipAppendToBody="true">
                                <i class="fa fa-pencil fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-info btn-xs btn-flat"
                                    (click)="onViewSubmission()"
                                    tooltip="view original"
                                    tooltipAppendToBody="true">
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
        console.log("date:", params.value);
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
    template: tmpl
})

export class SubmissionListComponent {
    private gridOptions: GridOptions;
    private columnDefs: any[];
    private rows: any[];
    private currentPage: number = 1;
    private totalItems: number = 0;
    private itemsPerPage: number = 2;

    private userName: string;
    private userEmail: string;

    error: any = null;

    constructor(@Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel,
                @Inject(Router) private router: Router,
                @Inject(UserSession) sess: UserSession) {

        this.userName = sess.user.name;
        this.userEmail = sess.user.email;

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
                cellRendererFramework: {
                    component: DateCellComponent,
                    moduleImports: [CommonModule]
                }
            },
            {
                headerName: 'Status',
                field: 'status',
            },
            {
                headerName: 'Actions',
                suppressMenu: true,
                cellRendererFramework: {
                    component: ActionButtonsCellComponent,
                    moduleImports: [TooltipModule, CommonModule]
                }
            }
        ];
    }

    loadDataRows() {
        let offset = (this.currentPage - 1) * this.itemsPerPage;
        let limit = this.itemsPerPage;
        this.submService.getAllSubmissions(offset, limit)
            .subscribe((data) => {
                console.debug("all data", data);
                this.setDataRows(data);
            });
    }

    onPageChanged(ev) {
        console.debug("onPageChanged", ev);
        this.currentPage = ev.page;
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
                console.debug("onDelete:", accno);
                this.submService
                    .deleteSubmission(accno)
                    .subscribe(() => {
                        this.loadDataRows();
                    });
            },

            onEdit: (accno:string) => {
                console.debug("onEdit:", accno);
                this.router.navigate(['/edit', accno]);
            },

            onView: (accno:string) => {
                console.debug("onView:", accno);
                this.router.navigate(['/view', accno]);
            }
        }));
    };

    createSubmission = function () {
        let sbm = this.submModel.createNew(this.userName, this.userEmail);
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