import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {GridOptions} from 'ag-grid/main';
import {AgRendererComponent} from 'ag-grid-angular/main';

import {ConfirmDialogComponent} from 'app/shared/index';
import {SubmissionService} from '../shared/submission.service';
import {TextFilterComponent} from './ag-grid/text-filter.component';
import {DateFilterComponent} from './ag-grid/date-filter.component';
import {PageTab} from '../shared/pagetab.model';
import {Subscription} from "rxjs/Subscription";
import {AppConfig} from "../../app.config";
import {SubmAddDialogComponent} from "./subm-add.component";

@Component({
    selector: 'action-buttons-cell',
    template: `
        <button type="button" class="btn btn-link btn-xs btn-flat"
                (click)="onEditSubmission()"
                tooltip="Edit this submission"
                container="body">
            <i class="fa fa-pencil fa-fw fa-lg"></i>
        </button>
        <button type="button" class="btn btn-danger btn-xs btn-flat"
                [disabled]="isBusy"
                (click)="onDeleteSubmission()"
                tooltip="Delete this submission"
                container="body">
            <i *ngIf="!isBusy" class="fa fa-trash-o fa-fw"></i>
            <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
        </button>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
    private accno: string;
    private isBusy: boolean;        //flags if a previous button action is in progress
    private isTemp: boolean;        //flags if the corresponding submission is a temporary one
    private onDelete: (accno: string, onCancel: Function) => {};
    private onEdit: (string) => {};
    private onView: (string) => {};

    status: string;

    agInit(params: any): void {
        const data = params.data;
        const noop = (accno: string) => {};

        this.status = data.status;
        this.accno = data.accno;
        this.isTemp = data.isTemp;
        this.onDelete = data.onDelete || noop;
        this.onEdit = data.onEdit || noop;
        this.onView = data.onView || noop;

        this.reset();
    }

    /**
     * Reverts the button to its original state
     */
    reset() {
        this.isBusy = false;
    }

    onDeleteSubmission() {
        this.isBusy = true;
        this.onDelete(this.accno, this.reset.bind(this));
    }

    onEditSubmission() {
        this.onEdit(this.accno);
    }
}

@Component({
    selector: 'date-cell',
    template: `{{value | date: appConfig.dateListFormat}}`
})
export class DateCellComponent implements AgRendererComponent {
    value: Date;

    /**
     * Exposes app's configuration to the template.
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     */
    constructor(private appConfig: AppConfig) {}

    agInit(params: any): void {
        this.value = this.asDate(params.value);
    }

    /**
     * Converts the date to a JavaScript standard Date object. Note that dates are stored on the server in
     * seconds, not in milliseconds as the Date object requires.
     * @param {number} seconds - Seconds since 1 January 1970 UTC
     * @returns {Date} Equivalent JavaScript Date object.
     */
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
    showSubmitted: boolean = false;     //flag indicating if the list of sent submissions is to be displayed
    isBusy: boolean = false;            //flag indicating if a request is in progress

    //AgGrid-related properties
    gridOptions: GridOptions;
    columnDefs: any[];
    private datasource: any;

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;
    @ViewChild('confirmDialog')
    confirmDialog: ConfirmDialogComponent;

    constructor(private submService: SubmissionService,
                private router: Router,
                private route: ActivatedRoute) {

        //Microstate - Allows going back to the sent submissions list directly
        this.route.data.subscribe((data) => {
            if (data.hasOwnProperty('isSent')) {
                this.showSubmitted = data.isSent;
            }
        });

        this.gridOptions = <GridOptions>{
            debug: false,
            rowSelection: 'single',
            enableColResize: true,
            unSortIcon: true,
            enableSorting: true,
            enableServerSideFilter: true,
            rowModelType: 'pagination',
            paginationPageSize: 15,
            rowHeight: 30,
            localeText: {noRowsToShow: 'No submissions found'},
            icons: {menu: '<i class="fa fa-filter"/>'},
            getRowNodeId: (item) => {
                return item.accno;
            },
            onGridReady: (params) => {
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
                cellClass: 'ag-cell-centered',
                maxWidth: 175,
                field: 'accno',
                filterFramework: TextFilterComponent
            },
            {
                headerName: 'Version',
                field: 'version',
                maxWidth: 100,
                cellClass: 'ag-cell-centered',
                hide: !this.showSubmitted,
                filterFramework: TextFilterComponent
            },
            {
                headerName: this.showSubmitted ? 'Latest title' : 'Title',
                field: 'title',
                filterFramework: TextFilterComponent
            },
            {
                headerName: this.showSubmitted ? 'First Released' : 'Release Date',
                cellClass: 'ag-cell-centered',
                maxWidth: 150,
                field: 'rtime',
                cellRendererFramework: DateCellComponent,
                filterFramework: DateFilterComponent
            },
            {
                headerName: 'Actions',
                cellClass: 'ag-cell-centered',
                maxWidth: 100,
                suppressMenu: true,
                suppressSorting: true,
                cellRendererFramework: ActionButtonsCellComponent
            }
        ];
    }

    setDatasource() {
        const agApi = this.gridOptions.api;     //AgGrid's API

        if (!this.datasource) {
            this.datasource = {
                // rowCount: ???, - not setting the row count, infinite paging will be used
                getRows: (params) => {
                    const pageSize = params.endRow - params.startRow;
                    const fm = params.filterModel || {};
                    this.isBusy = true;

                    if (agApi != null) {
                        agApi.showLoadingOverlay();
                    }

                    //Makes the request taking into account any filtering arguments supplied through the UI.
                    this.submService.getSubmissions({
                        submitted: this.showSubmitted,
                        offset: params.startRow,
                        limit: pageSize,
                        accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
                        rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
                        rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined,
                        keywords: fm.title && fm.title.value ? fm.title.value : undefined

                    //Once all submissions fetched, determines last row for display purposes.
                    }).subscribe((rows) => {
                        let lastRow = -1;

                        agApi.hideOverlay();

                        //Removes any entries that are really revisions of sent submissions if showing temporary ones
                        if (!this.showSubmitted) {
                            rows = rows.filter((subm) => {
                                return subm.accno.indexOf('TMP') == 0;
                            });
                        }

                        if (rows.length < pageSize) {
                            lastRow = params.startRow + rows.length;
                        }

                        params.successCallback(this.decorateDataRows(rows), lastRow);
                        this.isBusy = false;
                    });
                }
            }
        }
        agApi.setDatasource(this.datasource);
    }

    onSubmTabSelect(isSubmitted: boolean) {
        let fragment = '';

        //Ignores actions that don't carry with them a change in state.
        if (this.showSubmitted !== isSubmitted) {

            //Submitted list's route has 'sent' as a fragment while temp list has no fragment.
            if (isSubmitted) {
                fragment = 'sent';
            }

            this.router.navigate([fragment], {relativeTo: this.route, replaceUrl:true});
        }
    }

    decorateDataRows(rows: any[]): any {
        return rows.map(row => ({
            isTemp: !this.showSubmitted,
            accno: row.accno,
            title: row.title,
            rtime: row.rtime,
            status: row.status,
            version: row.version,
            onDelete: (accno: string, onCancel: Function): Subscription => {
                const onNext = (isOk: boolean) => {
                    this.isBusy = true;

                    //Deletion confirmed => makes a request to removes the submission from the server
                    if (isOk) {
                        this.submService
                            .deleteSubmission(accno)
                            .subscribe(() => {

                                //Issues an additional delete request for modified submissions
                                //TODO: This is a crude approach to the problem of no response data coming from the API (whether there are revisions or not is unknown).
                                if (this.showSubmitted) {
                                    this.submService.deleteSubmission(accno).subscribe(() => {
                                        this.setDatasource();               //TODO: refreshes grid by re-fetching data. Better approach is to use a singleton.
                                        this.isBusy = false;
                                    });
                                } else {
                                    this.setDatasource();
                                    this.isBusy = false;
                                }
                            });

                    //Deletion canceled: reflects it on the button
                    } else {
                        this.isBusy = false;
                        onCancel();
                    }
                };

                //Shows the confim dialogue for an already sent submission (including its revisions).
                if (this.showSubmitted) {
                    return this.confirm(
                        `The submission with accession number ${accno} may have un-submitted changes. If you proceed, both the submission and any changes will be permanently lost.`,
                        `Delete submission and its revisions`,
                        'Delete'
                    ).subscribe(onNext);

                //Shows the confirm dialogue for a temporary submission
                } else {
                    return this.confirm(
                        `The submission with accession number ${accno} has not been sent yet. If you proceed, it will be permanently deleted.`,
                        `Delete pending submission`,
                        'Delete'
                    ).subscribe(onNext);


                }
            },

            onEdit: (accno: string) => {
                this.router.navigate(['/submissions/edit', accno]);
            },

            onView: (accno: string) => {
                this.router.navigate(['/submissions', accno]);
            }
        }));
    };

    /**
     * Handler for the click event on the upload submission button, redirecting to a new view.
     * @param {Event} event - Click event object, the bubbling of which will be prevented.
     */
    onUploadSubmClick() {
        event.preventDefault();
        this.router.navigate(['/submissions/direct_upload']);
    }

    /**
     * Renders the new submission dialogue that allows the user to choose what type definitions template is used.
     * @param {Event} event - Click event object, the bubbling of which will be prevented
     */
    onNewSubmClick(event: Event): void {
        event.preventDefault();
        this.addDialog.show();
    }

    /**
     * Creates a new submission using PageTab's data structure and brings up a form to edit it.
     * @param {string} tmplId - ID for the type definitions template to be used for the submission.
     * TODO: at present, the app relies on the backend to generate a ready instance of a submission. This leads to two requests for every new submission, one to create it and another to retrieve it for the edit view.
     */
    createSubmission(tmplId: string) {
        this.isBusy = true;
        this.submService.createSubmission(PageTab.createNew(tmplId)).subscribe((subm) => {
            this.isBusy = false;
            this.router.navigate(['/submissions/new/', subm.accno]);
        });
    };

    /**
     * Handler for click events on a row. It redirects the user to the study's edit mode, unless over the actions cell
     * @param event - ag-Grid's custom event object that includes data represented by the clicked row.
     */
    onRowClicked(event): void {
        if (event.colDef.headerName !== "Actions") {
            this.router.navigate(['/submissions/edit', event.data.accno]);
        }
    }

    confirm(text: string, title: string, confirmLabel: string): Observable<any> {
        this.confirmDialog.title = title;
        this.confirmDialog.confirmLabel = confirmLabel;
        return this.confirmDialog.confirm(text, false);
    }
}
