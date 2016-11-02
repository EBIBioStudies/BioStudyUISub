import {Component, Input, Inject} from '@angular/core';

import {CommonModule}        from '@angular/common';

import tmpl from './submissionList.component.html'
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel} from '../../submission/submission.model';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'action-buttons-cell',
    template: '<action-buttons [status]="params.value"></action-buttons>'
})
export class ActionButtonsCellComponent implements AgRendererComponent {
    private params:any;

    agInit(params:any):void {
        this.params = params;
    }
}

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
    @Input() status:string;

    deleteSubmission() {}
    revertSubmission() {}
    editSubmission() {}
    viewSubmission() {}
}

@Component({
    selector: 'submission-list',
    template: tmpl
})

export class SubmissionListComponent {
    private gridOptions:GridOptions;
    private rowData: any[];
    private columnDefs: any[];

    error: any = null;

    constructor(@Inject(SubmissionService) private submService: SubmissionService,
                @Inject(SubmissionModel) private submModel: SubmissionModel) {

        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            }
        };

        this.createColumnDefs();

        submService
            .getAllSubmissions()
            .subscribe(
                data => {
                    this.createRowData(data);
                },
                error => this.error = <any>error
            );
    }

    createRowData(data) {
        this.rowData = data;
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Accession',
                field: 'accno',
            },
            {
                headerName: 'Title',
                field: 'title'
            },
            {
                headerName: 'Release Date',
                field: 'rtime'
            },
            {
                headerName: 'Status',
                field: 'status'
            },
            {
                headerName: 'Actions',
                field: 'status',
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
        /* //TODO var sbm = SubmissionModel.create(Session.userName, Session.userEmail);
         SubmissionService.createSubmission(sbm)
         .then(function (sbm) {
         startEditing(sbm.accno);
         });
         */
    };
}