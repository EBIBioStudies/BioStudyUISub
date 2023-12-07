import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community/main';
import { Subject, throwError, of, Observable } from 'rxjs';
import { switchMap, filter, takeUntil, catchError } from 'rxjs/operators';
import { AppConfig } from 'app/app.config';
import { FileService } from 'app/file/shared/file.service';
import { ModalService } from 'app/shared/modal/modal.service';
import { Path } from 'app/file/shared/path';
import { FileActionsCellComponent } from './ag-grid/file-actions-cell.component';
import { FileTypeCellComponent } from './ag-grid/file-type-cell.component';
import { FileUpload, FileUploadList } from 'app/file/shared/file-upload-list.service';
import { ProgressCellComponent } from './ag-grid/upload-progress-cell.component';
import { isDefinedAndNotEmpty } from '../../utils/validation.utils';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'st-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  absolutePath: string = '/user';
  backButton = false;
  columnDefs?: any[];
  gridOptions: GridOptions;
  isBulkMode = false;
  path: Path = new Path('/user', '/');
  sideBarCollapsed = false;
  USER_PATH = 'user';

  protected ngUnsubscribe: Subject<void>; // stopper for all subscriptions
  private rowData: any[];

  constructor(
    private appConfig: AppConfig,
    private fileService: FileService,
    private fileUploadList: FileUploadList,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ngUnsubscribe = new Subject<void>();

    // Initially collapses the sidebar for tablet-sized screens
    this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

    this.gridOptions = {
      onGridReady: () => {
        if (this.gridOptions && this.gridOptions.api) {
          this.gridOptions.api?.sizeColumnsToFit();
        }
      },
      rowHeight: 40,
      rowSelection: 'single',
      unSortIcon: true,
      localeText: { noRowsToShow: 'No files found' },
      overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center"><i class="fa fa-cog fa-spin fa-lg"></i> Loading...</span>'
    } as GridOptions;

    this.fileUploadList.uploadCompleted$
      .pipe(
        filter((path) => path.startsWith(this.absolutePath)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.refreshData();
      });

    this.rowData = [];
    this.createColumnDefs();
  }

  get rootPath(): string {
    return this.path.root;
  }

  set rootPath(rp: string) {
    this.path = this.path.setRoot(rp);
  }

  changePathQuery(absolutePath: string): void {
    const queryParams = { path: absolutePath };

    this.router.navigate(['.'], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams });
  }

  decorateFiles(files: any[] | undefined): any[] {
    return (files || []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      files: this.decorateFiles(f.files),
      onRemove: () => {
        this.removeFile(f.path, f.name);
      },
      onDownload: () => {
        this.downloadFile(f.path, f.name);
      },
      onDownloadFileList: () => {
        this.downloadFileList(`${f.path}/${f.name}`);
      }
    }));
  }

  decorateUploads(uploads: FileUpload[]): any[] {
    return uploads
      .map((upload) => {
        if (!upload.absoluteFilePath.startsWith(this.absolutePath)) {
          return [];
        }

        return upload.fileNames.map((fileName) => ({
          name: fileName,
          upload,
          type: 'FILE',
          onRemove: () => {
            this.removeUpload(upload);
          }
        }));
      })
      .reduce((rv, v) => rv.concat(v), []);
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
    this.route.queryParams.forEach((params: Params) => {
      this.backButton = params.bb;
    });

    this.route.queryParamMap.subscribe((queryParams) => {
      const path: string = queryParams.get('path') || `/${this.USER_PATH}`;

      this.loadData(path);
    });
  }

  onPathChange(path): void {
    this.changePathQuery(path);
  }

  onRootPathSelect(rootPath: string): void {
    this.changePathQuery(rootPath);
  }

  onRowDoubleClick(event): void {
    if (event.data.type !== 'FILE') {
      const dirName: string = event.data.name;
      const dirPath: string = `${this.absolutePath}/${dirName}`;

      this.changePathQuery(dirPath);
    }
  }

  onSideBarCollapsed(): void {
    this.sideBarCollapsed = !this.sideBarCollapsed;
  }

  onUploadFilesSelect(files: FileList, isFolder: boolean = false): void {
    const totalSize = Array.from(files).reduce((total, file) => total + file.size, 0);
    const allowedSize = this.appConfig.maxUploadFolderSize / (1000 * 1000);
    (totalSize > this.appConfig.maxUploadFolderSize || files.length > this.appConfig.maxUploadFiles
      ? this.modalService.confirm(
          `For uploading a folder larger than ${allowedSize} MB or more than ${this.appConfig.maxUploadFiles} files, using FTP/Aspera is recommended. Do you still want to continue?`,
          `Folder upload`,
          `Yes`
        )
      : of(true)
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isConfirmed: boolean) => {
        if (!isConfirmed) {
          return;
        }
        const uploadedFileNames = this.rowData.map((file) => file.name);
        const filesToUpload = Array.from(files).map((file) => file.webkitRelativePath || file.name);
        const overlap = filesToUpload.filter((fileToUpload) => uploadedFileNames.includes(fileToUpload));
        const fullPath = this.fileService.getFullPath(files[0]);
        const isFolderBeingUpdated =
          isDefinedAndNotEmpty(fullPath) &&
          fullPath.indexOf('/') > 0 &&
          isFolder &&
          uploadedFileNames.includes(fullPath.substr(0, fullPath.indexOf('/'))); // folder is already present;
        (overlap.length > 0 || isFolderBeingUpdated ? this.confirmOverwrite(overlap, isFolder) : of(true))
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => this.upload(files));
      });
  }

  updateDataRows(rows): void {
    this.rowData = rows;
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setRowData(rows);
    }
  }

  private confirmOverwrite(overlap, isFolder): Observable<boolean> {
    const overlapString =
      overlap.length === 1 ? overlap[0] + '?' : overlap.length + ' files? (' + overlap.join(', ') + ')';

    return this.modalService.whenConfirmed(
      isFolder
        ? 'This may overwrite existing files in the folder. Do you want to go ahead?'
        : `Do you want to overwrite ${overlapString}`,
      'Overwrite files?',
      'Overwrite'
    );
  }

  private createColumnDefs(): void {
    this.columnDefs = [
      {
        cellRendererFramework: FileTypeCellComponent,
        field: 'type',
        headerName: 'Type',
        maxWidth: 70,
        minWidth: 70,
        sort: 'asc',
        sortable: false
      },
      {
        field: 'name',
        headerName: 'Name'
      },
      {
        field: 'size',
        headerName: 'Size (in bytes)',
        maxWidth: 200,
        valueFormatter: (params) => (params?.data?.type === 'DIR' ? '' : formatNumber(params.value, 'en-gb')),
        type: 'numericColumn'
      },
      {
        cellRendererFramework: ProgressCellComponent,
        headerName: 'Progress',
        maxWidth: 100
      },
      {
        cellRendererFramework: FileActionsCellComponent,
        headerName: 'Actions',
        maxWidth: 150,
        sortable: false,
        suppressMenu: true
      }
    ];
  }

  private downloadFile(filePath: string, fileName: string): void {
    const contextPath: string = this.appConfig.contextPath;
    const downloadPath = `${contextPath}/api/files/${filePath}?fileName=${fileName}`;
    const link = document.createElement('a');

    link.href = downloadPath;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private downloadFileList(filePath: string): void {
    const contextPath: string = this.appConfig.contextPath;
    const downloadPath = `${contextPath}/file-list/${filePath}`;
    const link = document.createElement('a');
    link.href = downloadPath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private loadData(absolutePath: string): void {
    this.fileService
      .getFiles(absolutePath)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((error) => {
          if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.hideOverlay();
          }

          return throwError(error);
        })
      )
      .subscribe((files) => {
        const decoratedRows = ([] as any[]).concat(
          this.decorateUploads(this.fileUploadList.activeUploads),
          this.decorateFiles(files)
        );

        this.absolutePath = absolutePath;
        this.updateDataRows(decoratedRows);
      });
  }

  private refreshData(): void {
    this.loadData(this.absolutePath);
  }

  private removeFile(filePath: string, fileName: string): void {
    this.modalService
      .whenConfirmed(`Do you want to delete "${fileName}"?`, 'Delete a file', 'Delete')
      .pipe(
        switchMap(() => this.fileService.removeFile(filePath, fileName)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => this.refreshData());
  }

  private removeUpload(u: FileUpload): void {
    this.fileUploadList.remove(u);
    this.refreshData();
  }

  private upload(files: FileList): void {
    const uploadPath: Path = new Path(this.absolutePath, '');
    const upload: FileUpload = this.fileUploadList.upload(uploadPath, Array.from(files));
    const decoratedRows = this.decorateUploads([upload]);
    this.updateDataRows([...this.rowData, ...decoratedRows]);
  }
}
