import {Component, EventEmitter, Input, Output, Inject} from '@angular/core';
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
                        <div class="col-xs-12 article-tree">
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
}