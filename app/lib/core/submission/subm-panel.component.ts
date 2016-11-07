import {Component, Input} from '@angular/core';
import {PanelInfo} from "./panel-info";

@Component({
    selector: 'subm-panel',
    template: `
<div class="panel panel-info"
     [ngClass]="{'panel-danger': !valid, 'panel-info': valid}"
     *ngIf="info.size > 0">

    <div class="panel-heading clearfix">
        <h4 class="panel-title pull-left">{{info.title}}&nbsp;<span class="badge">{{info.size}}</span>
            <!--span class="bs-slide-out-tip"
                  icon-class="fa fa-angle-right"
                  tip="{{dict.description}}"></span-->
        </h4>
        <div class="btn-toolbar pull-right" role="toolbar" *ngIf="!readonly">
            <div class="btn-group ">
                <button type="button"
                        class="btn btn-xs btn-default"
                        (click)="info.addNew()">{{info.addNewLabel}}</button>
            </div>
        </div>
    </div>
    <ng-content></ng-content>
</div>`
})
export class SubmissionPanelComponent {
    @Input() info: PanelInfo;
    @Input() readonly: boolean;
    @Input() valid: boolean;
}