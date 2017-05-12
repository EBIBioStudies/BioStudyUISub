import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {
    TreeViewConfig,
    TreeViewCustomNodeComponent
} from 'app/submission-shared/index';

import {
    DirectSubmitService,
    DirectSubmitRequest
} from './direct-submit.service';

@Component({
    selector: 'result-log-node',
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
export class ResultLogNodeComponent implements TreeViewCustomNodeComponent {
    private _message: string = '';
    private _logLevel: string = '';

    onNodeData(data: any): void {
        this._message = data.message || '';
        this._logLevel = (data.level || 'info').toLowerCase();
    }

    get message(): string {
        return this._message;
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
        return this._logLevel === level;
    }
}

@Component({
    selector: 'direct-submit',
    template: `
<div class="row-offcanvas row-offcanvas-left">
    <direct-submit-sidebar
                (toggle)="onToggle($event)"
                [collapsed]="collapseSideBar">
    </direct-submit-sidebar>
    
    <div class="container-fluid">
        <aside class="right-side content" [ngClass]="{'collapse-left' : collapseSideBar}">
            <div *ngIf="!request"
                 class="panel text-center" 
                 style="border-color:#bbb;color:#aaa;padding:20px; margin:20px">
               Please use the form on the left to upload submission file. 
               It will be validated and, if the validation is successful, automatically submitted to BioStudies. 
               The results appear here shortly after.
            </div>
            <div *ngIf="request">
                <div class="panel"
                     [ngClass]="{'panel-danger': request.failed, 
                                 'panel-success': request.successful,
                                 'panel-info': request.inprogress}">
                     <div class="panel-heading">
                         <div class="row">
                             <div class="col-xs-1 text-center">
                                 <i style="margin-top:10%" 
                                    class="fa fa-2x" aria-hidden="true"
                                    [ngClass]="{'fa-exclamation-triangle': request.failed,
                                    'fa-check': request.successful,
                                    'fa-circle-o-notch fa-spin': request.inprogress                                    
                                    }"></i>
                             </div>
                             <div class="col-xs-10">
                                 <h4 class="panel-title">{{request.filename}}</h4>
                                 <h6><em>Format: {{request.formatText}}, Created: {{request.created | date:'short'}}</em></h6>
                             </div>
                             <div class="col-xs-1">
                                 <button type="button" class="close">
                                     <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                 </button>
                             </div>
                         </div>
                     </div>
                     <div class="panel-body container-fluid">
                         <div *ngIf="request.inprogress">
                            Loading...                       
                         </div>
                         <div *ngIf="request.failed">
                            <tree-view [data]="request.log"
                                       [config]="treeViewConfig"></tree-view>
                         </div> 
                         <div *ngIf="request.successful">
                             <div class="alert alert-success">
                                 The study was submitted <strong>successfully</strong>! It should appear in the list of 'Submitted' studies. Thanks! 
                             </div>
                             <tree-view [data]="request.log"
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
export class DirectSubmitComponent implements OnInit, OnDestroy {
    private sb: Subscription;
    private treeViewConfig: TreeViewConfig = {
        children(data: any): any[] {
            return data.subnodes ? data.subnodes : [];
        },
        nodeComponentClass: ResultLogNodeComponent
    };

    request: DirectSubmitRequest;
    collapseSideBar: boolean = false;

    constructor(private submitService: DirectSubmitService) {
    }

    ngOnInit(): void {
        this.sb = this.submitService.newRequest$.subscribe((index: number) => {
            this.request = this.submitService.request(index);
        });
    }

    ngOnDestroy(): void {
        this.sb.unsubscribe();
    }

    onToggle(ev): void {
        this.collapseSideBar = !this.collapseSideBar;
    }
}