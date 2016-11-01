import {Component, Inject} from '@angular/core';

import tmpl from './submissionList.component.html'
import {SubmissionService} from '../../submission/submission.service';
import {SubmissionModel} from '../../submission/submission.model';

import {GridOptions, AgRendererComponent} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

@Component({
    selector: 'actions-cell',
    template: `<action-buttons [status]="params.value"></action-buttons>`
})
class ActionsCellComponent implements AgRendererComponent {
    private params:any;

    agInit(params:any):void {
        this.params = params;
    }
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
                    component: ActionsCellComponent
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