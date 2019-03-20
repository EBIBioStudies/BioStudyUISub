import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {GridOptions} from 'ag-grid-community/main';
import {throwError} from 'rxjs';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import {AppConfig} from '../../app.config';
import {FileUpload, FileUploadList} from '../shared/file-upload-list.service';
import {FileService} from '../shared/file.service';
import {Path} from '../shared/path';
import {FileActionsCellComponent} from './ag-grid/file-actions-cell.component';
import {FileTypeCellComponent} from './ag-grid/file-type-cell.component';
import {ProgressCellComponent} from './ag-grid/upload-progress-cell.component';
import {UploadBadgeItem} from './file-upload-badge/file-upload-badge.component';

@Component({
    selector: 'file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.css']
})

export class FileListComponent implements OnInit, OnDestroy {
    protected ngUnsubscribe: Subject<void>;     //stopper for all subscriptions
    private rowData: any[];

    path: Path = new Path('/User', '/');

    sideBarCollapsed: boolean = false;
    backButton: boolean = false;
    gridOptions: GridOptions;
    columnDefs?: any[];
    isBulkMode: boolean = false;

    constructor(private fileService: FileService,
                private fileUploadList: FileUploadList,
                private route: ActivatedRoute,
                private appConfig: AppConfig) {

        this.ngUnsubscribe = new Subject<void>();

        //Initally collapses the sidebar for tablet-sized screens
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions!.api!.sizeColumnsToFit();
            },
            rowSelection: 'single',
            unSortIcon: true,
            localeText: {noRowsToShow: 'No files found'},
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center"><i class="fa fa-cog fa-spin fa-lg"></i> Loading...</span>',
        };

        this.fileUploadList.uploadCompleted$
            .filter((path) => path.startsWith(this.currentPath))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.loadData();
            });
        this.rowData = [];
        this.createColumnDefs();
        this.loadData();
    }

    ngOnInit() {
        this.route.queryParams.forEach((params: Params) => {
            this.backButton = params.bb;
        });
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

    private get currentPath() {
        return this.path.absolutePath();
    }

    get rootPath(): string {
        return this.path.root;
    }

    set rootPath(rp: string) {
        this.path = this.path.setRoot(rp);
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Type',
                field: 'type',
                minWidth: 70,
                maxWidth: 70,
                sortable: false,
                cellRendererFramework: FileTypeCellComponent
            },
            {
                headerName: 'Name',
                field: 'name'
            },
            {
                headerName: 'Progress',
                maxWidth: 200,
                cellRendererFramework: ProgressCellComponent
            },
            {
                headerName: 'Actions',
                maxWidth: 100,
                suppressMenu: true,
                sortable: false,
                cellRendererFramework: FileActionsCellComponent
            }
        ];
    }

    private loadData(path?: Path) {
        let p: Path = path ? path : this.path;
        this.fileService.getFiles(p.absolutePath())
            .takeUntil(this.ngUnsubscribe)

            .catch(error => {
                this.gridOptions!.api!.hideOverlay();
                return throwError(error);

            }).subscribe(files => {
                let decoratedRows = ([] as any[]).concat(
                    this.decorateUploads(this.fileUploadList.activeUploads),
                    this.decorateFiles(files)
                );

                this.path = p;
                this.updateDataRows(decoratedRows);
            }
        );
    }

    updateDataRows(rows) {
        this.rowData = rows;
        this.gridOptions!.api!.setRowData(rows);
    }

    private onBackButtonClick() {
        window.history.back();
    }

    onRowDoubleClick(ev) {
        if (ev.data.type != 'FILE') {
            this.loadData(this.path.addRel(ev.data.name));
        }
    }

    onRelativePathChange(relPath) {
        this.loadData(this.path.setRel(relPath));
    }

    onRootPathSelect(rootPath) {
        this.path = new Path(rootPath, '/');
        this.loadData();
    }

    onUploadSelect(upload: UploadBadgeItem) {
        this.path = upload.filePath;
        this.loadData();
    }

    onUploadFilesSelect(files: FileList) {
        let upload = this.fileUploadList.upload(this.path, Array.from(files));
        this.updateDataRows(([] as any[]).concat(this.decorateUploads([upload]), this.rowData));
    }

    decorateUploads(uploads: FileUpload[]): any[] {
        return uploads.map(u => {
            if (!u.absoluteFilePath.startsWith(this.currentPath)) {
                return [];
            }
            return u.fileNames.map(f => ({
                name: f,
                upload: u,
                type: 'FILE',
                onRemove: () => {
                    this.removeUpload(u);
                }
            }));
        }).reduce((rv, v) => rv.concat(v), []);
    }

    decorateFiles(files: any[] | undefined): any[] {
        return (files || []).map(f => ({
            name: f.name,
            type: f.type,
            files: this.decorateFiles(f.files),
            onRemove: () => {
                this.removeFile(f.name);
            }
        }));
    }

    private removeFile(fileName: string): void {

        if (!confirm('Do you really want to delete ' + fileName + '?')) {
            return;
        }
        this.fileService
            .removeFile(this.path.absolutePath(fileName))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((resp) => {
                this.loadData();
            });
    }

    private removeUpload(u: FileUpload) {
        this.fileUploadList.remove(u);
        this.loadData();
    }
}
