import {Component, EventEmitter, Input, Output, Inject, OnInit} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ActivatedRoute, Params} from '@angular/router';


import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!';
import 'ag-grid/dist/styles/theme-fresh.css!';

import {AgRendererComponent} from 'ag-grid-ng2/main';

import {FileService, FileUploadService, FileUpload} from './index';

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
    <div *ngIf="value < 100" class="progress" 
         style="margin-bottom: 0;">
         <div class="progress-bar" [ngClass]="{'progress-bar-success' : !error }" role="progressbar"
                [ngStyle]="{ 'width': value + '%'}">{{value}}%</div>
    </div>
    <div *ngIf="value === 100" style="text-align:center;color:green"><i class="fa fa-check"></i></div>
`
})
export class ProgressCellComponent implements AgRendererComponent {
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
                    this.value = e > 0 ? e - 1 : e; //make it 99 not 100
                }
                let isError = e === -1;
                let isFinished = e === -2;
                let isDone = isError || isFinished;

                if (isFinished) {
                    this.value = 100;
                }
                if (isError) {
                    this.error = upload.errorMessage;
                }
                if (isDone) {
                    onUploadFinished();
                    _.delay(() => {
                        // it's delayed because event comes earlier than __sb is created
                        this.unsubscribe();
                    }, 50);
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
                                    (click)="onBackButtonClick()"
                                    *ngIf="backButton"><i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;Back
                                to submission
                            </button>
                            &nbsp;{{currentPath}}
                        </div>
                        <div class="pull-right">
                            <file-upload-button (onUpload)="onNewUpload($event)"></file-upload-button>       
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                             <ag-grid-ng2 #agGrid style="width: 100%; height: 450px;" class="ag-fresh"
                                  [gridOptions]="gridOptions"
                                  [columnDefs]="columnDefs"
                                  enableSorting
                                  enableColResize
                                  rowHeight="30"
                                  (rowDoubleClicked)="onRowDoubleClicked($event)">
                             </ag-grid-ng2>
                        </div>
                    </div>
                </div>
          </section>
            
    </aside>
</container-root>
`
})

export class FileListComponent implements OnInit {
    backButton: boolean = false;

    private gridOptions: GridOptions;
    private rowData: any[];
    private columnDefs: any[];

    private currentPath: string = '/';

    constructor(@Inject(FileService) private fileService: FileService,
                @Inject(FileUploadService) private fileUploadService: FileUploadService,
                @Inject(ActivatedRoute) private route: ActivatedRoute) {
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            },
            rowSelection: 'single'
        };

        this.rowData = [];
        this.createColumnDefs();
        this.loadData();
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.backButton = params['bb'];
        });
    }

    onBackButtonClick() {
        window.history.back();
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Type',
                field: 'type',
                width: 50,
                suppressSorting: true,
                cellRendererFramework: FileTypeCellComponent
            },
            {
                headerName: 'Name',
                field: 'name',
                cellRenderer: 'group'
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
                cellRendererFramework:  FileActionsCellComponent
            }
        ];
    }

    loadData() {
        this.fileService.getFiles(this.currentPath)
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

    onRowDoubleClicked(ev) {
        this.currentPath += ev.data.name + '/';
        this.loadData();
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
                    console.log('on upload finished');
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
        console.log('removeFile', fileName);
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