import {Component, Inject, Input, OnChanges, SimpleChange, ContentChild, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Items} from '../../../submission/submission.model';
import {ItemsInfo} from './panel-info';

import {SubmissionItemsComponent} from './subm-items.component';

@Component({
    selector: 'subm-items-panel',
    template: `
<subm-panel
    [info]="itemsInfo"
    [valid]="valid">
    <subm-items
       [items]="items"
       [type]="type"
       [readonly]="readonly"></subm-items>   
</subm-panel>
`
})
export class SubmissionItemsPanelComponent implements OnChanges {

    @Input() items: Items;
    @Input() form: FormGroup;
    @Input() type: string;
    @Input() readonly: boolean;

    @ViewChild(SubmissionItemsComponent) private submItemsCmp: SubmissionItemsComponent;

    itemsInfo: ItemsInfo;

    constructor() {
    }

    ngOnInit() {
        //
    }

    ngAfterContentInit() {
        //TODO
        this.form.controls["test1"] = this.submItemsCmp.itemsForm;
    }

    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        console.log(changes);
        console.log(this.items);
        let title = this.type;
        //TODO from dict
        let addNewLabel = 'Add ' + this.type;
        this.itemsInfo = new ItemsInfo(this.items, title, addNewLabel);
    }

    get valid() {
        return this.submItemsCmp.itemsForm.valid;
    }
}
