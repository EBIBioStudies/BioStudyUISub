import {Component, Inject} from '@angular/core';

@Component({
    selector: 'subm-upload',
    template: `
<div class="row-offcanvas row-offcanvas-left">
    <subm-upload-sidebar *ngIf="!readonly"
                (toggle)="collapseLeftSide=!collapseLeftSide"
                [collapsed]="collapseLeftSide">
    </subm-upload-sidebar>
    
    <div class="container-fluid">
        <aside class="right-side content" [ngClass]="{'collapse-left' : collapseLeftSide}">
            <div class="panel text-center" style="border-color:#bbb;color:#aaa;padding:20px; margin:20px">
               Please use the form on the left to browse and upload submission file. 
               The submission results appear here shortly after.
            </div>
        </aside>
    </div>
</div>
`
})
export class SubmissionUploadComponent {
    private collapseLeftSide: boolean = false;

}