import {Component, Input, OnInit, Inject} from '@angular/core';
import {PanelInfo} from "./panel-info";

import {DictionaryService} from '../../../submission/dictionary.service';

@Component({
    selector: 'subm-panel',
    template: `
<div class="panel panel-info"
     [ngClass]="{'panel-danger': !valid, 'panel-info': valid}"
     *ngIf="info.size > 0">

    <div class="panel-heading clearfix">
        <h4 class="panel-title pull-left">{{title}}&nbsp;<span class="badge">{{info.size}}</span>
            <slide-out-tip tip="{{slideOutTip}}"></slide-out-tip>
        </h4>
        <div class="btn-toolbar pull-right" role="toolbar" *ngIf="!readonly">
            <div class="btn-group ">
                <button type="button"
                        class="btn btn-xs btn-default"
                        (click)="info.addNew()">{{addNewLabel}}</button>
            </div>
        </div>
    </div>
    <ng-content></ng-content>
</div>`
})
export class SubmissionPanelComponent implements OnInit{
    @Input() info: PanelInfo;
    @Input() readonly: boolean;
    @Input() valid: boolean;
    @Input() type: string;

    title: string;
    addNewLabel: string;
    slideOutTip: string;

    constructor(@Inject(DictionaryService) private dictService: DictionaryService){
    }

    ngOnInit() {
        let dict = this.dictService.byKey(this.type);
        this.title = dict.title;
        this.addNewLabel = dict.actions.add.title;
        this.slideOutTip = dict.description;
    }
}