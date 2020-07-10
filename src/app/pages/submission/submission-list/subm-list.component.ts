import { ActivatedRoute, Router } from '@angular/router';
import { AgRendererComponent } from 'ag-grid-angular/main';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community/main';
import { Subject, Subscription, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { AppConfig } from 'app/app.config';
import { ModalService } from 'app/shared/modal.service';
import { SubmissionService } from '../submission-shared/submission.service';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { TextFilterComponent } from './ag-grid/text-filter.component';
import { SubmissionStatusService, SubmStatus } from '../submission-shared/submission-status.service';

@Component({
  selector: 'st-action-buttons-cell',
  template: `
    <button *ngIf="rowData" type="button" class="btn btn-primary btn-xs btn-flat"
        (click)="onEditSubmission()"
        tooltip="Edit this submission"
        container="body">
      <i class="fas fa-pencil-alt fa-fw"></i>
    </button>
    <button *ngIf="rowData && rowData.isDeletable" type="button" class="btn btn-danger btn-xs btn-flat"
        [disabled]="isBusy"
        (click)="onDeleteSubmission()"
        tooltip="Delete this submission"
        container="body">
      <i *ngIf="!isBusy" class="fas fa-trash-alt fa-fw"></i>
      <i *ngIf="isBusy" class="fa fa-cog fa-spin fa-fw"></i>
    </button>`
})
export class ActionButtonsCellComponent implements AgRendererComponent {
  isBusy: boolean = false; // flags if a previous button action is in progress
  rowData: any; // object including the data values for the row this cell belongs to

  agInit(params: any): void {
    this.rowData = params.data;
    this.reset();
  }

  onDeleteSubmission() {
    this.isBusy = true;

    if (this.rowData) {
      this.rowData.onDelete(this.rowData.accno, this.reset.bind(this), this.rowData.isTemp);
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

  /**
   * Reverts the button to its original state
   */
  reset() {
    this.isBusy = false;
  }
}

@Component({
  selector: 'st-date-cell',
  template: `{{ value === undefined ? '&mdash;' : value | date: appConfig.dateListFormat }}`
})
export class DateCellComponent implements AgRendererComponent {
  value?: Date;

  /**
   * Exposes app's configuration to the template.
   * @param {AppConfig} appConfig - Global configuration object with app-wide settings.
   */
  constructor(public appConfig: AppConfig) {}

  agInit(params: any): void {
    this.value = this.asDate(params.value);
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

  /**
   * Formats date string into a JavaScript Date object.
   * @param {string} date Date string to be formatted
   * @returns {Date} Equivalent JavaScript Date object.
   */
  private asDate(date: string): Date | undefined {
    if (date === undefined || date === null || date.length === 0) {
      return undefined;
    }

    return new Date(date);
  }
}

@Component({
  selector: 'st-subm-list',
  templateUrl: './subm-list.component.html',
  styleUrls: ['./subm-list.component.css']
})
export class SubmListComponent implements OnDestroy, OnInit {
  columnDefs?: any[];
  // AgGrid-related properties
  gridOptions: GridOptions;
  isBusy: boolean = false; // Flag indicating if a request is in progress
  isCreating: boolean = false; // Flag indicating if submission creation is in progress
  showSubmitted: boolean = true; // Flag indicating if the list of sent submissions is to be displayed

  protected ngUnsubscribe: Subject<void>; // Stopper for all subscriptions to HTTP get operations

  private datasource: any;

  constructor(
    private submService: SubmissionService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private submStatusService: SubmissionStatusService
  ) {
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
        cellClass: 'ag-cell-centered',
        field: 'title',
        filter: true,
        filterFramework: TextFilterComponent,
        headerName: this.showSubmitted ? 'Latest title' : 'Title',
        resizable: true
      },
      {
        field: 'status',
        headerName: 'Status',
        resizable: false,
        maxWidth: 100,
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

  decorateDataRows(rows: any[]): any {
    return rows.map(row => ({
      isTemp: !this.showSubmitted,
      isDeletable: !this.showSubmitted || ['S-', 'TMP_'].some((prefix) => row.accno.indexOf(prefix) === 0),
      accno: row.accno,
      method: row.method,
      rtime: row.rtime,
      status: row.status,
      title: row.title,
      version: row.version,
      onDelete: (accno: string, onCancel: Function, isTemp: boolean): Subscription => {
        const onNext = (isOk: boolean) => {
          this.isBusy = true;

          // Deletion confirmed => makes a request to remove the submission from the server
          if (isOk) {
            const action: Function = isTemp
              ? this.submService.deleteDraft.bind(this.submService)
              : this.submService.deleteSubmitted.bind(this.submService);

            action(accno).subscribe(() => {
              this.setDatasource();
              this.isBusy = false;
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
   * Removes all subscriptions whenever the user navigates away from this view.
   * Requires the takeUntil operator before every subscription.
   * @see {@link https://stackoverflow.com/a/41177163}
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.submStatusService.getSubmStatus().subscribe((data: SubmStatus) => {
      console.log(data);
    });
  }

  /**
   * Handler for click events on a row. It redirects the user to the study's edit mode, unless over the actions cell
   * @param event - ag-Grid's custom event object that includes data represented by the clicked row.
   */
  onRowClicked(event): void {
    if (!this.isBusy && event.colDef.headerName !== 'Actions') {
      const { accno, method } = event.data;
      const optionalParams = String.isDefinedAndNotEmpty(method) ? { method } : {};

      this.router.navigate([`/submissions/edit/${accno}`, optionalParams ]);
    }
  }

  onSubmTabSelect(isSubmitted: boolean) {
    let fragment = 'draft';

    // Ignores actions that don't carry with them a change in state.
    if (this.showSubmitted !== isSubmitted) {

      // Submitted list's route has 'sent' as a fragment while temp list has no fragment.
      if (isSubmitted) {
        fragment = '';
      }

      this.router.navigate([fragment], { relativeTo: this.route, replaceUrl: true });
    }
  }

  /**
   * Handler for the click event on the upload submission button, redirecting to a new view.
   * @param {Event} event - Click event object, the bubbling of which will be prevented.
   */
  onUploadSubmClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/submissions/direct_upload']);
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
          if (agApi !== undefined && agApi !== null) {
            agApi.showLoadingOverlay();
          }

          // Makes the request taking into account any filtering arguments supplied through the UI.
          this.submService.getSubmissions(this.showSubmitted, {
            offset: params.startRow,
            limit: pageSize,
            accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
            rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
            rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined,
            keywords: fm.title && fm.title.value ? fm.title.value : undefined

          // Hides the overlaid progress box if request failed
          }).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((error) => {
              agApi!.hideOverlay();
              return throwError(error);
            })
          )
          .subscribe((rows) => {
            let lastRow = -1;

            // Hides progress box.
            agApi!.hideOverlay();

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
}
