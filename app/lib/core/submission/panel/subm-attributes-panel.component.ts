import {Component, Inject, Input, OnChanges, SimpleChange, ContentChild, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

import {Attributes} from '../../../submission/submission';
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
       [readonly]="readonly"
       [parentForm]="parentForm"></subm-attributes>   
</subm-panel>
`
})
export class SubmissionAttributesPanelComponent implements OnChanges {

    @Input() attributes: Attributes;
    @Input() parentForm: FormGroup;
    @Input() type: string;
    @Input() readonly: boolean;

    @ViewChild(SubmissionAttributesComponent) private submAttrCmp: SubmissionAttributesComponent;

    private attributesInfo: AttributesInfo;

    ngOnChanges(changes: {[ propName: string]: SimpleChange}) {
        this.attributesInfo = new AttributesInfo(this.attributes);
    }

    get valid(): boolean {
        return this.submAttrCmp.valid;
    }
}
