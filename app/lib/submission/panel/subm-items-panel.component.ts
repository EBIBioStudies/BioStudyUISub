import {Component, Inject, Input, OnChanges, SimpleChange, ContentChild, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Items} from '../../../submission/index';
import {ItemsInfo} from './panel-info';

import {SubmissionItemsComponent} from './subm-items.component';

@Component({
    selector: 'subm-items-panel',
    template: `
<subm-panel
    [info]="itemsInfo"
    [valid]="valid"
    [readonly]="readonly"
    [type]="type">
    <subm-items
       [items]="items"
       [type]="type"
       [readonly]="readonly"
       [parentForm]="parentForm"></subm-items>   
</subm-panel>
`
})
export class SubmissionItemsPanelComponent implements OnChanges {
    @Input() items: Items;
    @Input() parentForm: FormGroup;
    @Input() type: string;
    @Input() readonly: boolean;

    @ViewChild(SubmissionItemsComponent) private submItemsCmp: SubmissionItemsComponent;

    itemsInfo: ItemsInfo;

    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        this.itemsInfo = new ItemsInfo(this.items);
    }

    get valid(): boolean {
        return this.submItemsCmp.valid;
    }
}
