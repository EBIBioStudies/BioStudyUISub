import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';

import {
    ActivatedRoute,
    Params
} from '@angular/router';

import {GridOptions} from 'ag-grid/main';
import {AgRendererComponent} from 'ag-grid-angular/main';

import {FileService} from './file.service';

import {
    FileUploadService,
    FileUpload
} from './file-upload.service';

import {Path} from './path';

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';
import {AppConfig} from '../app.config';
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import {throwError} from 'rxjs/index';

@Component({
    selector: 'file-actions-cell',
    template: `
        <div style="text-align:center">
            <button *ngIf="canRemove"
                    type="button" class="btn btn-danger btn-xs btn-flat"
                    tooltip="Delete"
                    (click)="onFileRemove($event)">
                <i class="fa fa-trash-o fa-fw"></i>
            </button>
            <button *ngIf="canCancel"
                    type="button" class="btn btn-warning btn-xs"
                    tooltip="Cancel"
                    (click)="onCancelUpload($event)">
                Cancel
            </button>
        </div>
    `
})
export class FileActionsCellComponent implements AgRendererComponent {
    private type: string;
    private upload: FileUpload;
    private onRemove;

    agInit(params: any): void {
        this.type = params.data.type;
        this.upload = params.data.upload;
        this.onRemove = params.data.onRemove || (() => {
        });
    }

    get canRemove(): boolean {
        return !this.canCancel && (this.type === 'FILE' || this.type === 'ARCHIVE')
    }

    get canCancel(): boolean {
        return this.upload && !this.upload.finished();
    }

    onFileRemove(ev) {
        ev.preventDefault();
        this.onRemove();
    }

    onCancelUpload(ev) {
        ev.preventDefault();
        if (this.upload) {
            this.upload.cancel();
        }
    }

    refresh(): boolean {
        return false;
    }
}

@Component({
    selector: 'file-type-cell',
    template: `
        <div class="text-center text-primary">
            <i class="fa" [ngClass]="{
                               'fa-file' : ftype === 'FILE', 
                               'fa-folder' : ftype === 'DIR', 
                               'fa-archive' : ftype === 'ARCHIVE', 
                               'fa-file-archive-o' : ftype === 'FILE_IN_ARCHIVE'}"></i>
        </div>
    `
})
export class FileTypeCellComponent implements AgRendererComponent {
    ftype: string;

    agInit(params: any): void {
        this.ftype = params.value;
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
    selector: 'progress-cell',
    template: `
        <div *ngIf="value >= 1 && value < 100" class="progress"
             style="margin-bottom: 0;">
            <div class="progress-bar" role="progressbar"
                 [ngStyle]="{ 'width': value + '%'}">
                {{value}}%
            </div>
        </div>
        <div *ngIf="value === 100" class="text-success text-center"><i class="fa fa-check"></i></div>
        <div *ngIf="value < 0" class="text-danger text-center"><i class="fa fa-times-circle"></i> {{error}}</div>
    `
})
export class ProgressCellComponent implements AgRendererComponent {
    private upload: FileUpload;
    private type: string;

    agInit(params: any): void {
        this.type = params.data.type;
        this.upload = params.data.upload;
    }

    get value(): number {
        if (this.upload) {
            if (this.upload.failed()) {
                return -1;
            }
            return this.upload.progress;
        }
        if (this.type === 'FILE' || this.type === 'ARCHIVE') {
            return 100;
        }
        return 0;
    }

    get error(): string {
        return this.upload.error;
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
    columnDefs: any[];
    isBulkMode: boolean = false;

    constructor(private fileService: FileService,
                private fileUploadService: FileUploadService,
                private route: ActivatedRoute,
                private appConfig: AppConfig) {

        this.ngUnsubscribe = new Subject<void>();

        //Initally collapses the sidebar for tablet-sized screens
        this.sideBarCollapsed = window.innerWidth < this.appConfig.tabletBreak;

        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            },
            rowSelection: 'single',
            unSortIcon: true,
            localeText: {noRowsToShow: 'No files found'},
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center"><i class="fa fa-cog fa-spin fa-lg"></i> Loading...</span>',
        };

        this.fileUploadService.uploadFinish$
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
        return this.path.fullPath();
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
                minWidth: 45,
                maxWidth: 45,
                suppressSorting: true,
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
                suppressSorting: true,
                cellRendererFramework: FileActionsCellComponent
            }
        ];
    }

    private loadData(path?: Path) {
        let p: Path = path ? path : this.path;
        this.fileService.getFiles(p.fullPath())
            .takeUntil(this.ngUnsubscribe)

            .catch(error => {
                this.gridOptions.api.hideOverlay();
                return throwError(error);

            }).subscribe(files => {
                let decoratedRows = [].concat(
                    this.decorateUploads(this.fileUploadService.activeUploads()),
                    this.decorateFiles(files)
                );

                this.path = p;
                this.updateDataRows(decoratedRows);
            }
        );
    }

    updateDataRows(rows) {
        this.rowData = rows;
        this.gridOptions.api.setRowData(rows);
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

    onUploadSelect(upload) {
        this.path = upload.path;
        this.loadData();
    }

    onUploadFilesSelect(files) {
        let upload = this.fileUploadService.upload(this.path, files);
        this.updateDataRows([].concat(this.decorateUploads([upload]), this.rowData));
    }

    decorateUploads(uploads: FileUpload[]): any[] {
        return _.flatMap(uploads, (u) => {
            if (!u.path.fullPath().startsWith(this.currentPath)) {
                return [];
            }
            return _.map(u.files, (f) => ({
                name: f,
                upload: u,
                type: 'FILE',
                onRemove: () => {
                    this.removeUpload(u);
                }
            }));
        });
    }

    decorateFiles(files): any[] {
        return _.map(files, (f) => ({
            name: f.name,
            type: f.type,
            files: this.decorateFiles(f.files),
            onRemove: () => {
                this.removeFile(f.name);
            }
        }));
    }

    private removeFile(fileName: string): void {
        this.fileService
            .removeFile(this.path.fullPath(fileName))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((resp) => {
                this.loadData();
            });
    }

    private removeUpload(u: FileUpload) {
        this.fileUploadService.remove(u);
        this.loadData();
    }
}