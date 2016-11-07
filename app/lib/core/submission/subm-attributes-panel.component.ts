import {Component, Inject, Input, OnChanges, SimpleChange, ContentChild, ViewChild } from '@angular/core';

import {Attributes} from '../../submission/submission.model';
import {AttributesInfo} from './panel-info';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {SubmissionAttributesComponent} from './subm-attributes.component';

@Component({
    selector: 'subm-attributes-panel',
    template: `
<subm-panel
    [info]="attributesInfo"
    [valid]="valid">
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

    //childForm: FormGroup;
    attributesInfo:AttributesInfo;

    constructor() {
    }

    ngOnInit() {
        //
    }

    ngAfterContentInit() {
        this.form.controls["test"]= this.submAttrCmp.attrForm;
    }


    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        console.log(changes);
        console.log(this.attributes);
        let title = this.type;
        let addNewLabel = 'Add ' + this.type;
        this.attributesInfo = new AttributesInfo(this.attributes, title, addNewLabel);

        console.log("Attributes", this.attributes);

/*
        let group: any = {};
        let index = 0;
        for (let attr of this.attributes.attributes) {
            if (!attr.required) {
                group["name_" + index] = new FormControl(attr.name, Validators.required);
            }
            group["value_" + index] = new FormControl(attr.value,
                (attr.required ? Validators.required : undefined));
            index++;
        }

        this.childForm = new FormGroup(group);
        console.log("childForm: ", this.childForm);
        this.form.controls["test"] = this.childForm
*/
    }

    get valid() {
        return this.submAttrCmp.attrForm.valid;
    }
}
