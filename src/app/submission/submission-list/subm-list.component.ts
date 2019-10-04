import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgRendererComponent } from 'ag-grid-angular/main';
import { GridOptions } from 'ag-grid-community/main';
import { AppConfig } from 'app/app.config';
import { UserData } from 'app/auth/shared';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { SubmissionService } from '../submission-shared/submission.service';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { TextFilterComponent } from './ag-grid/text-filter.component';
import { ModalService } from '../../shared/modal.service';

@Component({
    selector: 'action-buttons-cell',
    template: `
        <button *ngIf="rowData" type="button" class="btn btn-primary btn-xs btn-flat"
                (click)="onEditSubmission()"
                tooltip="Edit this submission"
                container="body">
            <i class="fas fa-pencil-alt fa-fw"></i>
        </button>
        <button *ngIf="rowData" type="button" class="btn btn-danger btn-xs btn-flat"
                [disabled]="isBusy"
                (click)="onDeleteSubmission()"
                tooltip="Delete this submission"
                container="body">
            <i *ngIf="!isBusy" class="fas fa-trash-alt fa-fw"></i>
            <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
        </button>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
    public isBusy: boolean = false; // flags if a previous button action is in progress
    public rowData: any; // object including the data values for the row this cell belongs to

    private onDelete?: (accno: string, onCancel: Function) => {};
    private onEdit?: (string) => {};

    agInit(params: any): void {
        this.rowData = params.data;
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

        if (this.rowData) {
            this.rowData.onDelete(this.rowData.accno, this.reset.bind(this));
        }

    }

    onEditSubmission() {
        if (this.rowData) {
            this.rowData.onEdit(this.rowData.accno);
        }
    }

    /**
     * Mandatory - Get the cell to refresh.
     * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
     * @returns {boolean} By returning false, the grid will remove the component from the DOM and create
     * a new component in it's place with the new values.
     */
    refresh(): boolean {
        return false;
    }
}

@Component({
    selector: 'date-cell',
    template: `{{!value ? '&mdash;' : value | date: appConfig.dateListFormat}}`
})
export class DateCellComponent implements AgRendererComponent {
    value?: Date;

    /**
     * Exposes app's configuration to the template.
     * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
     */
    constructor(public appConfig: AppConfig) {
    }

    agInit(params: any): void {
        this.value = this.asDate(params.value);
    }

    /**
     * Formats date string into a JavaScript Date object.
     * @param {string} date Date string to be formatted
     * @returns {Date} Equivalent JavaScript Date object.
     */
    private asDate(date: string): Date {
        return new Date(date);
    }

    /**
     * Mandatory - Get the cell to refresh.
     * @see {@link https://www.ag-grid.com/javascript-grid-cell-editor/}
     * @returns {boolean} By returning false, the grid will remove the component from the DOM and create
     * a new component in it's place with the new values.
     */
    refresh(): boolean {
        return false;
    }
}

@Component({
    selector: 'subm-list',
    templateUrl: './subm-list.component.html',
    styleUrls: ['./subm-list.component.css']
})
export class SubmListComponent {
    protected ngUnsubscribe: Subject<void>; // Stopper for all subscriptions to HTTP get operations
    showSubmitted: boolean = true; // Flag indicating if the list of sent submissions is to be displayed
    isBusy: boolean = false; // Flag indicating if a request is in progress
    isCreating: boolean = false; // Flag indicating if submission creation is in progress

    // AgGrid-related properties
    gridOptions: GridOptions;
    columnDefs?: any[];
    private datasource: any;

    constructor(private submService: SubmissionService,
                private modalService: ModalService,
                private userData: UserData,
                private router: Router,
                private route: ActivatedRoute) {

        this.ngUnsubscribe = new Subject<void>();

        // Microstate - Allows going back to the sent submissions list directly
        this.route.data.subscribe((data) => {
            if (data.hasOwnProperty('isSent')) {
                this.showSubmitted = data.isSent;
            }
        });

        // TODO: enable server-side sorting once sorting parameters are added to the submission list endpoint
        // NOTE: Ag-Grid doesn't support client-side filtering/sorting and server-side pagination simultaneously.
        // https://www.ag-grid.com/javascript-grid-infinite-scrolling/#sorting-filtering
        this.gridOptions = <GridOptions>{
            cacheBlockSize: 15,
            debug: false,
            enableColResize: true,
            enableSorting: false,
            icons: {menu: '<i class="fa fa-filter"/>'},
            localeText: {noRowsToShow: 'No submissions found'},
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center"><i class="fa fa-cog fa-spin fa-lg"></i> Loading...</span>',
            pagination: true,
            paginationPageSize: 15,
            rowHeight: 30,
            rowModelType: 'infinite',
            rowSelection: 'single',
            unSortIcon: true,
            getRowNodeId: (item) => item.accno,
            onGridReady: () => {
                this.gridOptions!.api!.sizeColumnsToFit();
                this.setDatasource();

                window.onresize = () => this.gridOptions!.api! && this.gridOptions!.api!.sizeColumnsToFit();
            }
        };

        this.createColumnDefs();

        // Works out the list of allowed projects by comparison with template names
        // this.isBusy = true;
    }

    /**
     * Removes all subscriptions whenever the user navigates away from this view.
     * Requires the takeUntil operator before every subscription.
     * @see {@link https://stackoverflow.com/a/41177163}
     */
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                cellClass: 'ag-cell-centered',
                field: 'accno',
                filter: true,
                filterFramework: TextFilterComponent,
                headerName: 'Accession',
                maxWidth: 175,
                resizable: true
            },
            {
                cellClass: 'ag-cell-centered',
                field: 'version',
                filter: true,
                filterFramework: TextFilterComponent,
                headerName: 'Version',
                hide: !this.showSubmitted,
                maxWidth: 100,
                resizable: true
            },
            {
                field: 'title',
                filter: true,
                filterFramework: TextFilterComponent,
                headerName: this.showSubmitted ? 'Latest title' : 'Title',
                resizable: true
            },
            {
                cellClass: 'ag-cell-centered',
                cellRendererFramework: DateCellComponent,
                field: 'rtime',
                filter: true,
                filterFramework: DateFilterComponent,
                headerName: this.showSubmitted ? 'First Released' : 'Release Date',
                maxWidth: 150,
                resizable: true
            },
            {
                cellClass: 'ag-cell-centered',
                cellRendererFramework: ActionButtonsCellComponent,
                filter: true,
                headerName: 'Actions',
                maxWidth: 100,
                sortable: false,
                suppressMenu: true,
                resizable: true
            }
        ];
    }

    setDatasource() {
        const agApi = this.gridOptions.api; // AgGrid's API

        if (!this.datasource) {
            this.datasource = {
                // rowCount: ???, - not setting the row count, infinite paging will be used
                getRows: (params) => {
                    const pageSize = params.endRow - params.startRow;
                    const fm = params.filterModel || {};
                    this.isBusy = true;

                    // Shows loading progress overlay box.
                    if (agApi != null) {
                        agApi.showLoadingOverlay();
                    }

                    // Makes the request taking into account any filtering arguments supplied through the UI.
                    this.submService.getSubmissions( this.showSubmitted, {
                        offset: params.startRow,
                        limit: pageSize,
                        accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
                        rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
                        rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined,
                        keywords: fm.title && fm.title.value ? fm.title.value : undefined

                    // Hides the overlaid progress box if request failed
                    }).takeUntil(this.ngUnsubscribe).catch(error => {
                        agApi!.hideOverlay();
                        return throwError(error);

                    // Once all submissions fetched, determines last row for display purposes.
                    }).subscribe((rows) => {
                        let lastRow = -1;

                        // Hides progress box.
                        agApi!.hideOverlay();

                        // Removes any entries that are really revisions of sent submissions if showing temporary ones
                        if (!this.showSubmitted) {
                            rows = rows.filter((subm) => {
                                return subm.accno.indexOf('TMP') === 0;
                            });
                        }

                        if (rows.length < pageSize) {
                            lastRow = params.startRow + rows.length;
                        }

                        params.successCallback(this.decorateDataRows(rows), lastRow);
                        this.isBusy = false;
                    });
                }
            };
        }
        agApi!.setDatasource(this.datasource);
    }

    onSubmTabSelect(isSubmitted: boolean) {
        let fragment = 'draft';

        // Ignores actions that don't carry with them a change in state.
        if (this.showSubmitted !== isSubmitted) {

            // Submitted list's route has 'sent' as a fragment while temp list has no fragment.
            if (isSubmitted) {
                fragment = '';
            }

            this.router.navigate([fragment], {relativeTo: this.route, replaceUrl: true});
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

                    // Deletion confirmed => makes a request to remove the submission from the server
                    if (isOk) {
                        this.submService
                            .deleteSubmission(accno)
                            .subscribe(() => {
                                // Issues an additional delete request for modified submissions
                                // TODO: This is a crude approach to the problem of no response data coming from the
                                // API (whether there are revisions or not is unknown).
                                if (this.showSubmitted) {
                                    this.submService.deleteSubmission(accno).subscribe(() => {
                                        this.setDatasource();
                                        // TODO: refreshes grid by re-fetching data.Better approach is to use a singleton
                                        this.isBusy = false;
                                    });
                                } else {
                                    this.setDatasource();
                                    this.isBusy = false;
                                }
                            });

                        // Deletion canceled: reflects it on the button
                    } else {
                        this.isBusy = false;
                        onCancel();
                    }
                };

                // Shows the confirm dialogue for an already sent submission (including its revisions).
                if (this.showSubmitted) {
                    return this.modalService.confirm(
                        `The submission with accession number ${accno} may have un-submitted changes. \
                        If you proceed, both the submission and any changes will be permanently lost.`,
                        `Delete submission and its revisions`,
                        'Delete'
                    ).subscribe(onNext);

                    // Shows the confirm dialogue for a temporary submission
                } else {
                    return this.modalService.confirm(
                        `The submission with accession number ${accno} has not been submitted yet. If you proceed, \
                        it will be permanently deleted.`,
                        `Delete draft submission`,
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
    }

    /**
     * Handler for the click event on the upload submission button, redirecting to a new view.
     * @param {Event} event - Click event object, the bubbling of which will be prevented.
     */
    onUploadSubmClick(event: Event) {
        event.preventDefault();
        this.router.navigate(['/submissions/direct_upload']);
    }

    /**
     * Handler for click events on a row. It redirects the user to the study's edit mode, unless over the actions cell
     * @param event - ag-Grid's custom event object that includes data represented by the clicked row.
     */
    onRowClicked(event): void {
        if (!this.isBusy && event.colDef.headerName !== 'Actions') {
            this.router.navigate(['/submissions/edit', event.data.accno]);
        }
    }

}
