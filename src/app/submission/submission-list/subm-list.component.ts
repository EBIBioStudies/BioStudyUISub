import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community/main';
import { Subject, Subscription, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { ModalService } from 'app/shared/modal.service';
import { SubmissionService } from '../submission-shared/submission.service';
import { SubmissionStatusService } from '../submission-shared/submission-status.service';
import { DateFilterComponent } from './ag-grid/date-filter.component';
import { TextFilterComponent } from './ag-grid/text-filter.component';
import { ActionButtonsCellComponent } from './ag-grid/action-buttons-cell.component';
import { DateCellComponent } from './ag-grid/date-cell.component';
import { StatusCellComponent } from './ag-grid/status-cell.component';
import { TextCellComponent } from './ag-grid/text-cell.component';
import { SubmissionStatus } from 'app/submission/submission-shared/submission.status';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'st-subm-list',
  templateUrl: './subm-list.component.html'
})
export class SubmListComponent implements OnDestroy, OnInit {
  columnDefs?: any[];
  // AgGrid-related properties
  gridOptions: GridOptions;
  isBusy: boolean = false; // Flag indicating if a request is in progress
  isCreating: boolean = false; // Flag indicating if submission creation is in progress
  rows: any[] = [];
  showSubmitted: boolean = true; // Flag indicating if the list of sent submissions is to be displayed
  frontendURL: string = this.appConfig.frontendURL;

  protected ngUnsubscribe: Subject<void>; // Stopper for all subscriptions to HTTP get operations

  private datasource: any;

  constructor(
    private submService: SubmissionService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private submStatusService: SubmissionStatusService,
    private appConfig: AppConfig
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
    this.gridOptions = {
      cacheBlockSize: 15,
      debug: false,
      enableSorting: false,
      getRowNodeId: (item) => item.accno,
      icons: { menu: '<i class="fa fa-filter"/>' },
      localeText: { noRowsToShow: 'No submissions found' },
      overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center"><i class="fa fa-cog fa-spin fa-lg"></i> Loading...</span>',
      pagination: true,
      paginationPageSize: 15,
      rowHeight: 35,
      rowModelType: 'infinite',
      rowSelection: 'single',
      suppressRowClickSelection: true,
      unSortIcon: true,
      onGridReady: () => {
        this.gridOptions!.api!.sizeColumnsToFit();
        this.setDatasource();

        window.onresize = () => this.gridOptions!.api! && this.gridOptions!.api!.sizeColumnsToFit();
      }
    } as GridOptions;

    this.createColumnDefs();
  }

  createColumnDefs(): void {
    this.columnDefs = [
      {
        cellClass: 'ag-cell-centered',
        cellRendererFramework: StatusCellComponent,
        field: 'accno',
        filter: false,
        headerName: 'Accession',
        maxWidth: 175,
        resizable: true
      },
      {
        cellClass: 'ag-cell-centered',
        cellRendererFramework: TextCellComponent,
        editable: false,
        field: 'title',
        filter: true,
        filterFramework: TextFilterComponent,
        headerName: 'Title',
        resizable: true
      },
      {
        cellClass: 'ag-cell-centered',
        cellRendererFramework: DateCellComponent,
        field: 'rtime',
        filter: true,
        filterFramework: DateFilterComponent,
        headerName: 'Release Date',
        maxWidth: 150,
        resizable: true,
        hide: !this.showSubmitted
      },
      {
        cellRendererFramework: ActionButtonsCellComponent,
        filter: true,
        headerName: 'Actions',
        maxWidth: this.showSubmitted ? 150 : 100,
        resizable: true,
        sortable: false,
        suppressMenu: true
      }
    ];
  }

  decorateDataRows(rows: any[]): any {
    return rows.map((row) => ({
      id: row.accno,
      isTemp: !this.showSubmitted,
      isDeletable: this.canDeleteRow(row),
      isEditable: this.canEditRow(row),
      isProcessing: this.isProcessingRowSubmission(row),
      accno: row.accno,
      method: row.method,
      rtime: row.rtime,
      status: row.status || SubmissionStatus.PROCESSED.name,
      title: row.title,
      version: row.version,
      onDelete: (accno: string, onCancel: () => void, isTemp: boolean): Subscription => {
        const onNext = (isOk: boolean) => {
          this.isBusy = true;

          // Deletion confirmed => makes a request to remove the submission from the server
          if (isOk) {
            const action = isTemp
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
          return this.modalService
            .confirm(
              `The submission with accession number ${accno} may have un-submitted changes. \
            If you proceed, both the submission and any changes will be permanently lost.`,
              `Delete submission and its revisions`,
              'Delete'
            )
            .subscribe(onNext);

          // Shows the confirm dialogue for a temporary submission
        } else {
          return this.modalService
            .confirm(
              `The draft with accession number ${accno} has not been submitted yet. If you proceed, \
            it will be permanently deleted.`,
              `Delete draft`,
              'Delete'
            )
            .subscribe(onNext);
        }
      },

      onEdit: (accno: string) => {
        this.router.navigate(['/edit', accno]);
      },

      onView: (accno: string) => {
        window.open(`${this.frontendURL}/studies/${accno}`, '_blank');
      }
    }));
  }

  /**
   * Removes all subscriptions whenever the user navigates away from this view.
   * Requires the takeUntil operator before every subscription.
   * @see {@link https://stackoverflow.com/a/41177163}
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.submStatusService
      .getSubmStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((accno: string) => {
        const agApi = this.gridOptions.api;
        const rowNode = agApi!.getRowNode(accno);

        if (rowNode !== null) {
          const rowData = rowNode.data;
          const newRowData = {
            ...rowData,
            status: SubmissionStatus.PROCESSED.name
          };
          const updateRowData = {
            ...newRowData,
            isDeletable: this.canDeleteRow(newRowData),
            isEditable: this.canEditRow(newRowData),
            isProcessing: false
          };

          rowNode.updateData(updateRowData);
          agApi!.redrawRows();
        }
      });
  }

  onSubmTabSelect(isSubmitted: boolean): void {
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

  setDatasource(): void {
    const agApi = this.gridOptions.api;

    if (!this.datasource) {
      this.datasource = {
        getRows: (params) => {
          const pageSize = params.endRow - params.startRow;
          const fm = params.filterModel || {};
          this.isBusy = true;

          // Shows loading progress overlay box.
          if (agApi !== undefined && agApi !== null) {
            agApi.showLoadingOverlay();
          }

          // Makes the request taking into account any filtering arguments supplied through the UI.
          this.submService
            .getSubmissions(this.showSubmitted, {
              offset: params.startRow,
              limit: pageSize,
              accNo: fm.accno && fm.accno.value ? fm.accno.value : undefined,
              rTimeFrom: fm.rtime && fm.rtime.value && fm.rtime.value.from ? fm.rtime.value.from : undefined,
              rTimeTo: fm.rtime && fm.rtime.value && fm.rtime.value.to ? fm.rtime.value.to : undefined,
              keywords: fm.title && fm.title.value ? fm.title.value : undefined

              // Hides the overlaid progress box if request failed
            })
            .pipe(
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

              this.rows = this.decorateDataRows(rows);
              params.successCallback(this.rows, lastRow);
              this.isBusy = false;
            });
        }
      };
    }
    agApi!.setDatasource(this.datasource);
  }

  private canDeleteRow(row): boolean {
    return ['S-', 'TMP_'].some((prefix) => row.accno.indexOf(prefix) >= 0) && !this.isProcessingRowSubmission(row);
  }

  private canEditRow(row): boolean {
    return !this.isProcessingRowSubmission(row);
  }

  private isProcessingRowSubmission(row): boolean {
    return row.status === SubmissionStatus.REQUESTED.name;
  }
}
