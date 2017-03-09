import {Component, EventEmitter, Input, Output, Inject, OnInit, OnDestroy} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ActivatedRoute, Params} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!';
import 'ag-grid/dist/styles/theme-fresh.css!';

import {AgRendererComponent} from 'ag-grid-ng2/main';

import {FileService, FileUploadService, FileUpload} from './index';
import {Path} from './path';

import * as _ from 'lodash';

import 'rxjs/add/operator/filter';

@Component({
    selector: 'file-actions-cell',
    template: `
<div style="text-align:center">
    <button *ngIf="canRemove" 
            type="button" class="btn btn-danger btn-xs"
            (click)="onFileRemove($event)">Delete</button>
    <button *ngIf="canCancel" 
            type="button" class="btn btn-warning btn-xs"
            (click)="onCancelUpload($event)">Cancel</button>        
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
}

@Component({
    selector: 'file-type-cell',
    template: `
    <div style="text-align:center;color:#82b0bc">
    <i class="fa" [ngClass]="{
                               'fa-file' : ftype === 'FILE', 
                               'fa-folder' : ftype === 'DIR', 
                               'fa-archive' : ftype === 'ARCHIVE', 
                               'fa-file-archive-o' : ftype === 'FILE_IN_ARCHIVE'}"></i>
    </div>                                     
`
})
export class FileTypeCellComponent implements AgRendererComponent {
    private ftype: string;

    agInit(params: any): void {
        this.ftype = params.value;
    }
}

@Component({
    selector: 'progress-cell',
    template: `
    <div *ngIf="value >= 1 && value < 100" class="progress" 
         style="margin-bottom: 0;">
         <div class="progress-bar" [ngClass]="{'progress-bar-success' : !error }" role="progressbar"
                [ngStyle]="{ 'width': value + '%'}">{{value}}%</div>
    </div>
    <div *ngIf="value === 100" style="text-align:center;color:green"><i class="fa fa-check"></i></div>
    <div *ngIf="value < 0" class="text-danger">{{error}}</div>
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
}

@Component({
    selector: 'file-list',
    template: `
<div class="row-offcanvas row-offcanvas-left">

   <user-dirs-sidebar 
       name="userDirsSidebar"
       [(ngModel)]="rootPath"
       (select)="onRootPathSelect($event)"
       (toggle)="sideBarCollapsed=!sideBarCollapsed"
       [collapsed]="sideBarCollapsed">
   </user-dirs-sidebar>
          
   <div class="container-fluid">
        <aside class="right-side" [ngClass]="{'collapse-left' : sideBarCollapsed}">    
            <section class="content">
                <div class="panel panel-info">
                    <div class="panel-heading clearfix">
                        <div class="panel-title pull-left">
                            <button class="btn btn-default btn-xs"
                                    (click)="onBackButtonClick()"
                                    *ngIf="backButton"><i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;Back
                                to submission
                            </button>
                            &nbsp;<directory-path [path]="path.rel" (change)="onRelativePathChange($event)"></directory-path>
                        </div>
                        <div class="pull-right">
                            <file-upload-badge (select)="onUploadSelect($event)"></file-upload-badge>
                            <file-upload-button [path]="path" (onUpload)="onNewUpload($event)"></file-upload-button>       
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                             <ag-grid-angular #agGrid style="width: 100%; height: 450px;" class="ag-fresh"
                                  [gridOptions]="gridOptions"
                                  [columnDefs]="columnDefs"
                                  enableSorting
                                  enableColResize
                                  rowHeight="30"
                                  (rowDoubleClicked)="onRowDoubleClick($event)">
                             </ag-grid-angular>
                        </div>
                    </div>
                </div>
              </section>
          </aside>
    </div>
</div>
`
})

export class FileListComponent implements OnInit, OnDestroy {
    private backButton: boolean = false;
    private sideBarCollapsed: boolean = false;

    private gridOptions: GridOptions;
    private rowData: any[];
    private columnDefs: any[];

    private path: Path = new Path('/User', '/');
    private uploadSubscription: Subscription;

    constructor(@Inject(FileService) private fileService: FileService,
                @Inject(FileUploadService) private fileUploadService: FileUploadService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            },
            rowSelection: 'single'
        };

        this.uploadSubscription = this.fileUploadService.uploadFinish$
            .filter((path) => path.startsWith(this.currentPath))
            .subscribe(() => {
                console.log('on upload finished');
                this.loadData();
            });
        this.rowData = [];
        this.createColumnDefs();
        this.loadData();
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.backButton = params['bb'];
        });
    }

    ngOnDestroy() {
        console.log('onDestroy()');
        this.uploadSubscription.unsubscribe();
    }

    private get currentPath() {
        return this.path.fullPath();
    }

    private get rootPath() {
        return this.path.root;
    }

    private set rootPath(rp: string) {
        this.path = this.path.setRoot(rp);
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Type',
                field: 'type',
                width: 30,
                suppressSorting: true,
                cellRendererFramework: FileTypeCellComponent
            },
            {
                headerName: 'Name',
                field: 'name'
            },
            {
                headerName: 'Progress',
                width: 200,
                cellRendererFramework: ProgressCellComponent
            },
            {
                headerName: 'Actions',
                width: 100,
                suppressMenu: true,
                suppressSorting: true,
                cellRendererFramework: FileActionsCellComponent
            }
        ];
    }

    private loadData(path?: Path) {
        let p: Path = path ? path : this.path;
        this.fileService.getFiles(p.fullPath())
            .subscribe(
                data => {
                    if (data.status === 'OK') { //use proper http codes for this!!!!!!
                        this.path = p;
                        this.updateDataRows([].concat(
                            this.decorateUploads(this.fileUploadService.activeUploads()),
                            this.decorateFiles(data.files)));
                    } else {
                        console.error("Error", data);
                    }
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

    onNewUpload(upload) {
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
        console.log('removeFile', fileName);
        this.fileService
            .removeFile(this.path.fullPath(fileName))
            .subscribe((resp) => {
                this.loadData();
            });
    }

    private removeUpload(u: FileUpload) {
        this.fileUploadService.remove(u);
        this.loadData();
    }
}