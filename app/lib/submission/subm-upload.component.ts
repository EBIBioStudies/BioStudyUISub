import {Component, Inject, OnInit} from '@angular/core';
import {SubmissionUploadService, SubmUploadResults} from './submission-upload.service';
import {TreeViewConfig, TreeViewCustomNodeComponent} from './results/tree-view.component';

@Component({
    selector: 'submit-log-node',
    template: `
    <span [ngClass]="{
             'text-info': info,          
             'text-danger': error,
             'text-warning': warn,     
             'text-success': success}">
        <i *ngIf="error" class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>&nbsp;
        {{message}}
    </span>       
`
})
export class SubmitLogNodeComponent implements TreeViewCustomNodeComponent {
    private __message: string = '';
    private __logLevel: string = '';

    onNodeData(data: any): void {
        this.__message = data.message || '';
        this.__logLevel = (data.level || 'info').toLowerCase();
    }

    get message(): string {
        return this.__message;
    }

    get error(): boolean {
        return this.logLevelEquals('error');
    }

    get warn(): boolean {
        return this.logLevelEquals('warn');
    }

    get success(): boolean {
        return this.logLevelEquals('success');
    }

    get info(): boolean {
        return this.logLevelEquals('info');
    }

    private logLevelEquals(level: string): boolean {
        return this.__logLevel === level;
    }
}


@Component({
    selector: 'subm-upload',
    template: `
<div class="row-offcanvas row-offcanvas-left">
    <subm-upload-sidebar *ngIf="!readonly"
                (upload)="onUpload($event)"
                (toggle)="onToggle($event)"
                [collapsed]="collapseLeftSide">
    </subm-upload-sidebar>
    
    <div class="container-fluid">
        <aside class="right-side content" [ngClass]="{'collapse-left' : collapseLeftSide}">
            <div *ngIf="!results"
                 class="panel text-center" 
                 style="border-color:#bbb;color:#aaa;padding:20px; margin:20px">
               Please use the form on the left to upload submission file. 
               It will be validated and, if the validation is successful, automatically submitted to BioStudies. 
               The results appear here shortly after.
            </div>
            <div *ngIf="results">
                <div class="panel"
                     [ngClass]="{'panel-danger': results.failed, 
                                 'panel-success': results.successful,
                                 'panel-info': results.inprogress}">
                     <div class="panel-heading">
                         <div class="row">
                             <div class="col-xs-1 text-center">
                                 <i style="margin-top:10%" 
                                    class="fa fa-2x" aria-hidden="true"
                                    [ngClass]="{'fa-exclamation-triangle': results.failed,
                                    'fa-check': results.successful,
                                    'fa-circle-o-notch fa-spin': results.inprogress                                    
                                    }"></i>
                             </div>
                             <div class="col-xs-10">
                                 <h4 class="panel-title">{{results.filename}}</h4>
                                 <h6><em>Content-Type: {{results.contentType}}, Created: {{results.created | date:'short'}}</em></h6>
                             </div>
                             <div class="col-xs-1">
                                 <button type="button" class="close">
                                     <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                 </button>
                             </div>
                         </div>
                     </div>
                     <div class="panel-body container-fluid">
                         <div *ngIf="results.inprogress">
                            Loading...                       
                         </div>
                         <div *ngIf="results.failed">
                            <tree-view [data]="results.log"
                                       [config]="treeViewConfig"></tree-view>
                         </div> 
                     </div>                            
                </div>
            </div>
        </aside>
    </div>
</div>
`
})
export class SubmissionUploadComponent implements OnInit {
    private collapseLeftSide: boolean = false;
    private results: SubmUploadResults = undefined;
    private treeViewConfig: TreeViewConfig = {
        children(data: any): any[] {
            return data.subnodes ? data.subnodes : [];
        },
        nodeComponentClass: SubmitLogNodeComponent
    };


    constructor(@Inject(SubmissionUploadService) private submUploadService: SubmissionUploadService) {
    }

    ngOnInit(): void {
        this.submUploadService
            .lastResults()
            .subscribe(res => {
                this.results = res
            });
    }

    onToggle(ev): void {
        this.collapseLeftSide = !this.collapseLeftSide;
    }

    onUpload(ev): void {

    }
}