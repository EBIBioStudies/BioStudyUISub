import {Component, Inject, Input, OnChanges, SimpleChange, ContentChild, ViewChild } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Attributes} from '../../../submission/submission.model';
import {AttributesInfo} from './panel-info';

import {SubmissionAttributesComponent} from './subm-attributes.component';

@Component({
    selector: 'subm-attributes-panel',
    template: `
<subm-panel
    [info]="attributesInfo"
    [valid]="valid"
    [readonly]="readonly"
    [type]="type">
    <subm-attributes
       [attributes]="attributes"
       [type]="type"
       [readonly]="readonly"></subm-attributes>   
</subm-panel>
`
})
export class SubmissionAttributesPanelComponent implements OnChanges  {

    @Input() attributes:Attributes;
    @Input() form:FormGroup;
    @Input() type:string;
    @Input() readonly:boolean;

    @ViewChild(SubmissionAttributesComponent) private submAttrCmp: SubmissionAttributesComponent;

    attributesInfo:AttributesInfo;

    constructor() {
    }

    ngOnInit() {
        //
    }

    ngAfterContentInit() {
        //TODO
        this.form.controls["test"]= this.submAttrCmp.attrForm;
    }

    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        console.log(changes);
        console.log(this.attributes);
        let title = this.type;
        let addNewLabel = 'Add ' + this.type;
        this.attributesInfo = new AttributesInfo(this.attributes);

        console.log("Attributes", this.attributes);
    }

    get valid() {
        return this.submAttrCmp.attrForm.valid;
    }
}
