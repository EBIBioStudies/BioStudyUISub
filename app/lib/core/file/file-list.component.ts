import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule}        from '@angular/common';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';

import {FileService} from '../../file/file.service';
import {FileUploadService, FileUpload} from '../../file/file-upload.service';

import * as _ from 'lodash';

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
class FileActionsCellComponent implements AgRendererComponent {
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
    <div style="text-align:center">
    <i class="fa" [ngClass]="{
                               'fa-file' : ftype === 'FILE', 
                               'fa-folder' : ftype === 'DIR', 
                               'fa-archive' : ftype === 'ARCHIVE', 
                               'fa-file-archive-o' : ftype === 'FILE_IN_ARCHIVE'}"></i>
    </div>                                     
`
})
class FileTypeCellComponent implements AgRendererComponent {
    private ftype: string;

    agInit(params: any): void {
        this.ftype = params.value;
    }
}

@Component({
    selector: 'progress-cell',
    template: `
    <div *ngIf="value < 100" class="progress" 
         style="margin-bottom: 0;">
         <div class="progress-bar" [ngClass]="{'progress-bar-success' : !error }" role="progressbar"
                [ngStyle]="{ 'width': value + '%'}">{{value}}%</div>
    </div>
    <div *ngIf="value === 100"><i class="fa fa-check"></i></div>
`
})
class ProgressCellComponent implements AgRendererComponent {
    private value: number;
    private error: string;
    private type: string;

    private __sb;

    agInit(params: any): void {
        let type = params.data.type;
        let upload = params.data.upload;
        if (upload) {
            let onUploadFinished = params.data.onUploadFinished || (() => {
                });
            this.__sb = upload.progress.subscribe((e) => {
                if (e >= 0) {
                    this.value = e;
                }
                if (e === -1) {
                    this.error = upload.errorMessage;
                }
                if (e < 0 || e === 100) {
                    _.delay(() => {
                        // it's delayed because event comes earlier than __sb is created
                        this.unsubscribe();
                    }, 50);
                    onUploadFinished();
                }
            })
        } else if (type === 'FILE' || type === 'ARCHIVE') {
            this.value = 100;
        }
    }

    unsubscribe() {
        this.__sb.unsubscribe();
    }
}

@Component({
    selector: 'file-list',
    template: `
<container-root>
    <aside class="right-side strech">
    
         <section class="content">
                <div class="panel panel-info">
                    <div class="panel-heading clearfix">
                        <div class="panel-title pull-left">
                            <button class="btn btn-default btn-xs"
                                    (click)="history.back()"
                                    *ngIf="backButton"><i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;Back
                                to submission
                            </button>
                            &nbsp;Uploaded files
                        </div>
                        <div class="pull-right">
                            <file-upload-button (onUpload)="onNewUpload($event)"></file-upload-button>       
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                             <ag-grid-ng2 #agGrid style="width: 100%; height: 350px;" class="ag-fresh"
                                  [gridOptions]="gridOptions"
                                  [columnDefs]="columnDefs"
                                  enableSorting
                                  enableColResize
                                  rowHeight="30">
                             </ag-grid-ng2>
                        </div>
                    </div>
                </div>
          </section>
            
    </aside>
</container-root>
`
})

export class FileListComponent {
    backButton: boolean = false;

    private gridOptions: GridOptions;
    private rowData: any[];
    private columnDefs: any[];

    constructor(@Inject(FileService) private fileService: FileService,
                @Inject(FileUploadService) private fileUploadService: FileUploadService) {
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            },
            getNodeChildDetails: FileListComponent.getNodeChildDetails,
        };

        this.rowData = [];
        this.createColumnDefs();
        this.loadData();
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Name',
                field: 'name',
                cellRenderer: 'group'
            },
            {
                headerName: 'Type',
                field: 'type',
                width: 50,
                suppressSorting: true,
                cellRendererFramework: {
                    component: FileTypeCellComponent,
                    moduleImports: [CommonModule]
                }
            },
            {
                headerName: 'Progress',
                width: 200,
                cellRendererFramework: {
                    component: ProgressCellComponent,
                    moduleImports: [CommonModule]
                }
            },
            {
                headerName: 'Actions',
                width: 100,
                suppressMenu: true,
                suppressSorting: true,
                cellRendererFramework: {
                    component: FileActionsCellComponent,
                    moduleImports: [CommonModule]
                }
            }
        ];
    }

    loadData() {
        this.fileService.getFiles()
            .subscribe((data) => {
                console.log(data);
                this.updateDataRows([].concat(
                    this.decorateUploads(this.fileUploadService.currentUploads()),
                    this.decorateFiles(data)));
            });

        /*
         d.then(function (data) {
         $scope.filesTree = data.files;
         if ($scope.filesTree[0]) {
         $scope.filesTree[0].name = "Your uploaded files";
         }
         decorateFiles($scope.filesTree);
         $scope.rootFileInTree = $scope.filesTree[0];
         addSelectedFileToTree();
         });
         */
    }

    updateDataRows(rows) {
        this.rowData = rows;
        this.gridOptions.api.setRowData(rows);
    }

    onNewUpload(upload) {
        this.updateDataRows([].concat(this.decorateUploads([upload]), this.rowData));
    }

    decorateUploads(uploads: FileUpload[]): any[] {
        return _.flatMap(uploads, (u) => {
            if (u.done()) {
                return [];
            }
            return _.map(u.files, (f) => ({
                name: f,
                upload: u,
                type: 'FILE',
                onRemove: () => {
                    this.removeUpload(u);
                },
                onUploadFinished: () => {
                    this.loadData();
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
            .removeFile(fileName)
            .subscribe((resp) => {
                this.loadData();
            });
    }

    private removeUpload(u: FileUpload) {
        this.fileUploadService.remove(u);
        this.loadData();
    }

    static getNodeChildDetails(rowItem) {
        /*$scope.fileTypes = {
         dir: 'DIR',
         file: 'FILE',
         archive: 'ARCHIVE',
         fileInArchive: 'FILE_IN_ARCHIVE'
         };*/
        if (rowItem.type === 'DIR' || rowItem.type === 'ARCHIVE') {
            return {
                group: true,
                expanded: true, //todo
                children: rowItem.files || [],
                field: 'name',
                key: rowItem.name
            };
        } else {
            return null;
        }
    }

}