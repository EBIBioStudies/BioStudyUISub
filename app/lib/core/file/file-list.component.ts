import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {CommonModule}        from '@angular/common';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';

import {FileService} from '../../file/file.service';

@Component({
    selector: 'file-actions-cell',
    template: `
<div style="text-align:center">
    <span *ngIf="loading"><i class="fa fa-cog fa-spin"></i></span>
    <button *ngIf="(ftype === 'FILE' || ftype === 'ARCHIVE')" 
            type="button" class="btn btn-danger btn-xs"
            (click)="deleteFile($event)">Delete</button>
</div>
`
})
class FileActionsCellComponent implements AgRendererComponent {
    ftype: string;
    loading:boolean = false;
    agInit(params: any): void {
        console.debug("params: ", params);
        this.ftype = params.value;
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
    ftype:string;
    agInit(params:any):void {
        console.debug("params: ", params);
        this.ftype = params.value;
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
                            <file-upload-button></file-upload-button>       
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                             <ag-grid-ng2 #agGrid style="width: 100%; height: 350px;" class="ag-fresh"
                                  [gridOptions]="gridOptions"
                                  [columnDefs]="columnDefs"
                                  [rowData]="rowData"
                                  enableSorting
                                  enableColResize
                                  rowHeight="30">
                             </ag-grid-ng2>
                            <!--tree-grid tree-data="filesTree"
                                       tree-control="uploadedTree"
                                       col-defs="col_defs"
                                       expand-on="expanding_property"
                                       on-select="selectFile(branch)"
                                       expand-level="2"
                                       icon-leaf="{{'fa fa-file'}}">
                            </tree-grid-->
                        </div>
                    </div>
                </div>
          </section>
            
    </aside>
</container-root>
`
})

export class FileListComponent {
    backButton:boolean = false;

    private gridOptions:GridOptions;
    private rowData: any[];
    private columnDefs: any[];

    constructor(@Inject(FileService) private fileService:FileService) {
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
                field: 'progress',
                width: 200
            },
            {
                headerName: 'Actions',
                field: 'type',
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
        var d = this.fileService.getFiles()
            .subscribe((data) => {
                console.log(data);
                this.rowData = data;
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

    static getNodeChildDetails(rowItem) {
        if (rowItem.type === 'DIR') {
            return {
                group: true,
                expanded: true, //todo
                children: rowItem.files,
                field: 'name',
                key: rowItem.name
            };
        } else {
            return null;
        }
    }
}