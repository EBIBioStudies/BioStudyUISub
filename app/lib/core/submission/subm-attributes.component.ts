import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';

import {Attributes, Attr} from '../../submission/submission.model';
import {NgForm} from '@angular/forms';

//import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
    selector: 'subm-attributes',
    template: `
<form id="attributes-form" novalidate name="attrForm" role="form"
                      (submit)="$event.preventDefault();" #attrForm="ngForm">
<table class="table table-condensed">
    <thead>
    <th>Key</th>
    <th>Value</th>
    </thead>
    <tbody>
    <!--pubmedid-search *ngIf="type === 'publication'"></pubmedid-search-->
    <!-- {{pubMedSearchTmplUrl}} -->
    
    <tr *ngFor="let attr of attributes.attributes; let idx=index"><!-- [formGroup]="form" -->
        <td class="col-md-3 nopadding border-none form-group-sm">
<!--
            [ngClass]="{'has-error' : form.controls['name_' + idx].invalid}">
-->
            <input *ngIf="!attr.required"
                   type="text" class="form-control control-label input-sm"
                   placeholder="Type a key"
                   tooltip="Empty or duplicate value"
                   placement="top-left"
                   [readonly]="readonly"
                   [(ngModel)]="attr.name"
                   (onModelChange)="onAttributeChange()" 
                   name="{{'name_' + idx}}"

                   >
                   
                   <!--[formControlName]="'name_' + idx" -->
<!--
                   uib-typeahead="key for key in typeaheadKeys | filterDifference:typeaheadKeys:item.attributes.attributes | filter:$viewValue:$emptyOrMatch | limitTo:30"
                   typeahead-append-to-body="true"
                   typeahead-show-hint="true"
                   typeahead-min-length="0"
                   ms-duplicate="item.attributes.attributes"
                   tooltipEnable="attrItemForm['attrKey_' + $index].$invalid"
                   
                   [ngModelOptions]="{allowInvalid: true}"

-->
            <p *ngIf="attr.required" class="form-control-static pull-right">{{attr.name}}</p>
        </td>
        <td class="col-md-9 nopadding border-none form-group-sm"
            [ngClass]="{'has-error' : attr.required }"> <!-- && form.controls['value_' + idx].invalid -->
            <div [ngClass]="{'input-group' : !readonly && !attr.required}">
            
                 <input type="text" class="form-control input-sm"
                       *ngIf="attr.type === 'text'"
                       placeholder="Enter a value"
                       tooltip="This field is required"
                       placement="top-left"
                       [readonly]="readonly"
                       [(ngModel)]="attr.value"
                       (ngModelChange)="onAttributeChange()"
                       name="{{'value_' + idx}}">
<!--
                       uib-typeahead="value for value in typeaheadValues(attr.name, item.$index) | filter:$viewValue:$emptyOrMatch | limitTo:10"
                       typeahead-append-to-body="true"
                       typeahead-show-hint="true"
                       typeahead-min-length="0"
                       tooltipEnable="attrItemForm['attrValue_' + $index].$invalid"
                       [ngModelOtions]="{allowInvalid: true}"
-->
                 <input-file 
                      *ngIf="attr.type === 'file'" 
                      [(ngModel)]="attr.value"
                      #attrValue="ngModel"></input-file>
            
                 <span class="input-group-btn" *ngIf="!readonly && !attr.required">
                      <button type="button"
                           class="btn btn-sm btn-danger btn-flat"
                           (click)="item.attributes.remove($index)"
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
       console.log(this.attrForm);
    }

    onAttributeChange(){}



}