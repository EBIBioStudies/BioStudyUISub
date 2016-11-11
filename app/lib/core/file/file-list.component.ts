import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';

import {GridOptions} from 'ag-grid/main';

import 'ag-grid/dist/styles/ag-grid.css!css';
import 'ag-grid/dist/styles/theme-fresh.css!css';

import {AgRendererComponent} from 'ag-grid-ng2/main';

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

    constructor() {
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit();
            }
        };

        this.createColumnDefs();
        this.rowData = [];
    }

    createColumnDefs() {
        this.columnDefs = [
            {
                headerName: 'Name',
                field: 'name',
            },
            {
                headerName: 'Type',
                field: 'type',
                width: 50
            },
            {
                headerName: 'Progress',
                field: 'progress'
            },
            {
                headerName: 'Actions'
                /*suppressMenu: true,
                suppressSorting: true,
                cellRendererFramework: {
                    component: ActionButtonsCellComponent,
                    dependencies: [ActionButtonsComponent],
                    moduleImports: [CommonModule]
                }*/
            }
        ];

    }
}