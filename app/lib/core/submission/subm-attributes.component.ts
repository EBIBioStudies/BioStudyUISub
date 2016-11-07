import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';

import {Attributes, Attr} from '../../submission/submission.model';
import {NgForm} from '@angular/forms';

//import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'subm-attributes',
    template: `
<form id="attributes-form" novalidate name="attrForm" role="form"
       (ngSubmit)="$event.preventDefault();" #attrForm="ngForm">
<table class="table table-condensed">
    <thead>
    <th>Key</th>
    <th>Value</th>
    </thead>
    <tbody>
    <!--pubmedid-search *ngIf="type === 'publication'"></pubmedid-search-->
    <!-- {{pubMedSearchTmplUrl}} -->
    
    <tr *ngFor="let attr of attributes.attributes; let idx=index">
        <td class="col-md-3 nopadding border-none form-group-sm"
            [ngClass]="{'has-error' : !attr.required 
                                       && attrForm.form.controls['name_' + idx] 
                                       && attrForm.form.controls['name_' + idx].invalid}">

            <input *ngIf="!attr.required"
                   type="text" class="form-control control-label input-sm"
                   name="{{'name_' + idx}}"
                   placeholder="Type a key"
                   tooltip="Empty or duplicate value"
                   [tooltipEnable]="attrForm.form.controls['name_' + idx] && attrForm.form.controls['name_' + idx].invalid"
                   placement="top-left"
                   [readonly]="readonly"
                   [(ngModel)]="attr.name"
                   (onModelChange)="onAttributeChange()" 
                   required>
<!--
                   uib-typeahead="key for key in typeaheadKeys | filterDifference:typeaheadKeys:item.attributes.attributes | filter:$viewValue:$emptyOrMatch | limitTo:30"
                   typeahead-append-to-body="true"
                   typeahead-show-hint="true"
                   typeahead-min-length="0"
                   ms-duplicate="item.attributes.attributes"
                   
                   
                   [ngModelOptions]="{allowInvalid: true}"

-->
            <p *ngIf="attr.required" class="form-control-static pull-right">{{attr.name}}</p>
        </td>
        <td class="col-md-9 nopadding border-none form-group-sm"
            [ngClass]="{'has-error' : attr.required 
                                      && attrForm.form.controls['value_' + idx] 
                                      && attrForm.form.controls['value_' + idx].invalid}">
            <div [ngClass]="{'input-group' : !readonly && !attr.required}">
            
                 <input *ngIf="attr.type === 'text'"
                       type="text" class="form-control input-sm"
                       name="{{'value_' + idx}}"
                       placeholder="Enter a value"
                       tooltip="This field is required"
                       [tooltipEnable]="attrForm.form.controls['value_' + idx] && attrForm.form.controls['value_' + idx].invalid"
                       placement="top-left"
                       [readonly]="readonly"
                       [(ngModel)]="attr.value"
                       (ngModelChange)="onAttributeChange()"
                       [required]="attr.required">
<!--
                       uib-typeahead="value for value in typeaheadValues(attr.name, item.$index) | filter:$viewValue:$emptyOrMatch | limitTo:10"
                       typeahead-append-to-body="true"
                       typeahead-show-hint="true"
                       typeahead-min-length="0"
                       [ngModelOtions]="{allowInvalid: true}"
-->
                 <input-file *ngIf="attr.type === 'file'" 
                      [(ngModel)]="attr.value"
                      #attrValue></input-file>
            
                 <span class="input-group-btn" *ngIf="!readonly && !attr.required">
                      <button type="button"
                           class="btn btn-sm btn-danger btn-flat"
                           (click)="attributes.remove(idx)"
                           [tooltip]="deleteTooltip">
                           <i class="fa fa-trash-o"></i>
                      </button>
                 </span>
            </div>
        </td>
    </tr>

    <tr *ngIf="!readonly">
        <td colspan="2">
            <p class="pull-right">
                <button type="button" class="btn btn-default btn-xs"
                        (click)="addNew()"
                        [tooltip]="addNewTooltip"
                        placement="bottom">{{addNewLabel}}
                </button>
            </p>
        </td>
    </tr>
    </tbody>
</table>
</form>
`
})
export class SubmissionAttributesComponent implements OnInit {
    @Input() attributes: Attributes;
    @Input() type: string; // should be a enum??
    @Input() readonly: boolean;

    @ViewChild('attrForm') public attrForm: NgForm;
    //@Input() form: FormGroup;

    addNewLabel: string; // dict.actions.addAttr.title
    addNewTooltip: string; //{{dict.actions.addAttr.popup}}

    deleteTooltip: string; //{{dict.actions.deleteAttr.popup}}

    addNew() {
        this.attributes.addNew();
    }

    ngOnInit() {
       console.log("attrForm:", this.attrForm);
    }

    onAttributeChange(){}



}