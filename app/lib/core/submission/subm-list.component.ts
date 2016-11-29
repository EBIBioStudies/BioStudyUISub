import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule}        from '@angular/common';

import {Router} from '@angular/router';

import tmpl from './subm-list.component.html'
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel} from '../../submission/submission.model';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';
import {UserSession} from '../../session/user-session';

@Component({
    selector: 'action-buttons',
    template: `
                           <button *ngIf="status !== 'MODIFIED'"
                                    type="button" class="btn btn-danger btn-xs btn-flat"
                                    (click)="deleteSubmission()"
                                    tooltip="delete">
                                <i class="fa fa-trash-o fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-warning btn-xs btn-flat"
                                    (click)="revertSubmission()"
                                    tooltip="undo changes">
                                <i class="fa fa-undo fa-fw"></i>
                           </button>
                           <button type="button" class="btn btn-primary btn-xs btn-flat"
                                    (click)="editSubmission()"
                                    tooltip="edit">
                                <i class="fa fa-pencil fa-fw"></i>
                           </button>
                           <button *ngIf="status === 'MODIFIED'" 
                                    type="button" class="btn btn-info btn-xs btn-flat"
                                    (click)="viewSubmission()"
                                    tooltip="view">
                                <i class="fa fa-eye fa-fw"></i>
                           </button>
`
})
export class ActionButtonsComponent {
    @Input() status: string;
    @Input() accno: string;
    @Output() onDelete = new EventEmitter<boolean>();
    @Output() onRevert = new EventEmitter<boolean>();
    @Output() onEdit = new EventEmitter<boolean>();
    @Output() onView = new EventEmitter<boolean>();

    deleteSubmission() {
        this.onDelete.emit(this.accno);
    }

    revertSubmission() {
        this.onRevert.emit(this.accno);
    }

    editSubmission() {
        this.onEdit.emit(this.accno);
    }

    viewSubmission() {
        this.onView.emit(this.accno);
    }
}

@Component({
    selector: 'action-buttons-cell',
    template: `<action-buttons [status]="status"
                               [accno]="accno" 
                               (onDelete)="doDelete($event)"
                               (onRevert)="doRevert($event)"
                               (onEdit)="doEdit($event)"
                               (onView)="doView($event)">
                               </action-buttons>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
    status: string;
    accno: string;

    constructor(@Inject(Router) private router: Router) {
    }

    agInit(params: any): void {
        console.debug("params: ", params);
        this.status = params.data.status;
        this.accno = params.data.accno;
    }

    doDelete(accno) {
        console.debug("doDelete: ", accno);
        //TODO
    }

    doRevert(accno) {
        console.debug("doRevert: ", accno);
        //TODO
    }

    doEdit(accno) {
        console.debug("doEdit: ", accno);
        this.router.navigate(['/edit', accno]);
    }

    doView(accno) {
        console.debug("doView: ", accno);
        this.router.navigate(['/view', accno]);
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
            //enableServerSideSorting: true,
            //enableServerSideFilter: true,
            //enableSorting: true,
            //enableFilter: true,
            debug: true,
            rowSelection: 'single',
            enableColResize: true,
            paginationPageSize: 200,
            rowModelType: 'pagination',
            rowHeight: 30,
            getRowNodeId: (item) => {
                return item.accno;
            },
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
                this.createDatasource();
            }
        };

        this.createColumnDefs();
    }

    createDatasource() {
        let dataSource = {
            //rowCount: ???, - not setting the row count, infinite paging will be used
            getRows: (params) => {
                console.log("grid params:", params);
                // params.sortModel
                // params.filterModel
                // params.startRow
                // params.endRow

                let offset = params.startRow;
                let limit = params.endRow - params.startRow;
                this.submService.getAllSubmissions(offset, limit)
                    .subscribe((data) => {
                        let rowsThisPage = data;
                        let lastRow = -1;
                        if (data.length < limit) {
                            lastRow = params.startRow + data.length;
                        }
                        params.successCallback(rowsThisPage, lastRow);
                    });
            }
        };

        this.gridOptions.api.setDatasource(dataSource);
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Accession',
                field: 'accno',
                suppressFilter: true
                //filter: 'text',
                //filterParams: {apply: true, newRowsAction: 'keep'}
            },
            {
                headerName: 'Title',
                field: 'title',
                suppressFilter: true
                //filter: 'text',
                //filterParams: {apply: true, newRowsAction: 'keep'}
            },
            {
                headerName: 'Release Date',
                field: 'rtime',
                suppressFilter: true,
                cellRendererFramework: {
                    component: DateCellComponent,
                    moduleImports: [CommonModule]
                }
            },
            {
                headerName: 'Status',
                field: 'status',
                suppressFilter: true
            },
            {
                headerName: 'Actions',
                suppressMenu: true,
                suppressSorting: true,
                cellRendererFramework: {
                    component: ActionButtonsCellComponent,
                    dependencies: [ActionButtonsComponent],
                    moduleImports: [CommonModule]
                }
            }
        ];

    }

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