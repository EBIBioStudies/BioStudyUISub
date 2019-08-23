import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community/main';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { AppConfig } from '../../app.config';
import { FileService } from '../shared/file.service';
import { ModalService } from '../../shared/modal.service';
import { Path } from '../shared/path';
import { FileActionsCellComponent } from './ag-grid/file-actions-cell.component';
import { FileTypeCellComponent } from './ag-grid/file-type-cell.component';
import { FileUpload, FileUploadList } from '../shared/file-upload-list.service';
import { ProgressCellComponent } from './ag-grid/upload-progress-cell.component';
import { UploadBadgeItem } from './file-upload-badge/file-upload-badge.component';
import { UserData } from 'app/auth/shared';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit, OnDestroy {
    protected ngUnsubscribe: Subject<void>;     // stopper for all subscriptions
    private rowData: any[];
    private ftpUser: string = 'bsftp';
    private ftpPass: string = 'bsftp1';

    path: Path = new Path('/User', '/');
    sideBarCollapsed = false;
    backButton = false;
    gridOptions: GridOptions;
    columnDefs?: any[];
    isBulkMode = false;

    constructor(
        private appConfig: AppConfig,
        private fileService: FileService,
        private fileUploadList: FileUploadList,
        private modalService: ModalService,
        private route: ActivatedRoute,
        private userData: UserData
    ) {
        this.ngUnsubscribe = new Subject<void>();

        // Initially collapses the sidebar for tablet-sized screens
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
        const p: Path = path ? path : this.path;
        this.fileService.getFiles(p.absolutePath())
            .takeUntil(this.ngUnsubscribe)
            .catch(error => {
                this.gridOptions!.api!.hideOverlay();
                return throwError(error);

            }).subscribe(files => {
                const decoratedRows = ([] as any[]).concat(
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

    onRowDoubleClick(ev) {
        if (ev.data.type !== 'FILE') {
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
        const uploadedFileNames = this.rowData.map((file) => file.name);
        const filesToUpload =  Array.from(files).map((file) => file.name);
        const overlap = filesToUpload.filter((fileToUpload) => uploadedFileNames.includes(fileToUpload));

        (overlap.length > 0 ? this.confirmOverwrite(overlap) : of(true))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() =>
                this.confirmSpecialExtensions(filesToUpload)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(() => this.upload(files))
            );
    }

    private confirmOverwrite(overlap) {
        const overlapString = overlap.length === 1 ? overlap[0] + '?' :
            overlap.length + ' files? (' + overlap.join(', ') + ')' ;

        return this.modalService.whenConfirmed(`Do you want to overwrite ${overlapString}`,
            'Overwrite files?', 'Overwrite');
    }

    private confirmSpecialExtensions(filesToUpload: string[]) {
        const dbMap = { '.cel': 'ArrayExpress', '.fastq': 'ENA'};
        const extensions = Array.from(new Set(
                filesToUpload.map( (file) => file.substring(file.lastIndexOf('.')).toLowerCase())
                    .filter( x => x !== null && dbMap[x] )));
        if (extensions.length === 0) { return of(true); }
        return this.modalService.whenConfirmed(`We notice that you are trying to upload files with extension`
            + ((extensions.length === 1) ? ` ` : `s `)
            + extensions.join('/')
            + ` which may be more appropriate for other databases such as `
            + extensions.map( (ext) => dbMap[ext]).join('/')
            + ((extensions.length === 1) ? `` : ` respectively`)
            + `. Are you sure you want to continue with the upload?`,
            'File Extension Check', 'Continue');
    }

    private upload(files: FileList) {
        const upload = this.fileUploadList.upload(this.path, Array.from(files));
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
            },
            onDownload: () => {
                this.downloadFile(f.path);
            }
        }));
    }

    private removeFile(fileName: string): void {
        this.modalService.whenConfirmed(`Do you want to delete "${fileName}"?`, 'Delete a file', 'Delete')
            .pipe( switchMap( () => this.fileService.removeFile(this.path.absolutePath(fileName))))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => this.loadData());
    }

    private removeUpload(u: FileUpload) {
        this.fileUploadList.remove(u);
        this.loadData();
    }

    private downloadFile(filePath: string): void {
        const relativePath = filePath.replace('/User/', '');

        this.userData.secretId$.subscribe((secret) => {
            const ftpPath = `ftp://${this.ftpUser}:${this.ftpPass}@ftp-private.ebi.ac.uk/${secret}/${relativePath}`;
            const link = document.createElement('a');

            link.href = ftpPath;
            link.download = filePath.substr(filePath.lastIndexOf('/') + 1);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}
