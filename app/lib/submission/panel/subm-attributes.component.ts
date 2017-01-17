import {Component, Inject, Input, OnInit, OnDestroy, ViewChild, forwardRef} from '@angular/core';
import {NgForm, FormGroup, FormControl} from '@angular/forms';

import * as _ from 'lodash';

import {Attributes, DictionaryService} from '../index';
import {TypeaheadValuesForItem} from './typeahead-values';

@Component({
    selector: 'subm-attributes',
    template: `
<form id="attributes-form" novalidate name="attrForm" role="form"
       (ngSubmit)="$event.preventDefault();" #attrForm="ngForm">
<table class="table table-condensed">
    <thead>
    <tr>
        <th>Key</th>
        <th>Value</th>    
    </tr>
    </thead>
    <tbody>
    <tr *ngFor="let attr of attributes.attributes; let idx=index">
        <td class="col-md-3 nopadding border-none form-group-sm"
            [ngClass]="{'has-error' : !attr.required 
                                       && attrForm.controls['name_' + attr.id] 
                                       && attrForm.controls['name_' + attr.id].invalid}">

            <input *ngIf="!attr.required"
                   type="text" class="form-control control-label input-sm"
                   [name]="'name_' + attr.id"
                   placeholder="Type a key"
                   tooltip="Empty or duplicated value"
                   [isDisabled]="attrForm.controls['name_' + attr.id] && attrForm.controls['name_' + attr.id].valid"
                   placement="top-left"
                   [typeahead]="typeaheadAttrNames()"
                   typeaheadAppendToBody="true"
                   typeaheadMinLength="0"
                   typeaheadOptionsLimit="30"                
                   [readonly]="readonly"
                   [(ngModel)]="attr.name"
                   (ngModelChange)="onAttrNameChange()"
                   [uniqueAttrName]="attributes.attributes"
                   required>

            <p *ngIf="attr.required" class="form-control-static pull-right">{{attr.name}}</p>
        </td>
        <td class="col-md-9 nopadding border-none form-group-sm"
            [ngClass]="{'has-error' : attr.required 
                                      && attrForm.controls['value_' + attr.id] 
                                      && attrForm.controls['value_' + attr.id].invalid}">
            <div [ngClass]="{'input-group' : !readonly && !attr.required}">
            
                 <input *ngIf="attr.type === 'text'"
                       type="text" class="form-control input-sm"
                       [name]="'value_' + attr.id"
                       placeholder="Enter a value"
                       tooltip="This field is required"
                       [isDisabled]="attrForm.controls['value_' + attr.id] && attrForm.controls['value_' + attr.id].valid"
                       placement="top-left"
                       [typeahead]="typeaheadAttrValues(attr.name)"
                       typeaheadAppendToBody="true"
                       typeaheadMinLength="0"
                       typeaheadOptionsLimit="30"  
                       [readonly]="readonly"
                       [(ngModel)]="attr.value"
                       [required]="attr.required">
<!--
                       uib-typeahead="value for value in typeaheadValues(attr.name, item.$index) | filter:$viewValue:$emptyOrMatch | limitTo:10"
                       typeahead-append-to-body="true"
                       typeahead-show-hint="true"
                       typeahead-min-length="0"
-->
                 <input-file *ngIf="attr.type === 'file'" 
                             [(ngModel)]="attr.value"
                             [name]="'value_' + attr.id"
                             [required]="attr.required"
                             [readonly]="readonly">                             
                 </input-file>
            
                 <span *ngIf="!readonly && !attr.required" class="input-group-btn">
                      <button type="button"
                           class="btn btn-sm btn-danger btn-flat"
                           (click)="onRemoveAttrClick(idx);"
                           [tooltip]="removeAttrTooltip"
                           placement="bottom">
                           <i class="fa fa-trash-o"></i>
                      </button>
                 </span>
            </div>
        </td>
    </tr>

    <tr *ngIf="!readonly && addNewAttrLabel">
        <td colspan="2">
            <p class="pull-right">
                <button type="button" 
                        class="btn btn-default btn-xs"
                        (click)="onAddNewAttrClick()">{{addNewAttrLabel}}
                </button>
            </p>
        </td>
    </tr>
    </tbody>
</table>
</form>
`
})
export class SubmissionAttributesComponent implements OnInit, OnDestroy {
    @Input() attributes: Attributes;
    @Input() type: string; // should be a enum??
    @Input() readonly: boolean;
    @Input() parentForm: FormGroup;
    @Input() typeaheadValues?: TypeaheadValuesForItem;

    @ViewChild('attrForm') private attrForm: NgForm;

    private addNewAttrLabel: string;
    private removeAttrTooltip: string;

    private __typeaheadNames: string[];
    private cName: string;

    constructor(@Inject(DictionaryService) private dictService: DictionaryService) {
    }

    ngAfterContentInit() {
        let cName = `attrsForm_${this.type}`;
        while (this.parentForm.controls.hasOwnProperty(cName)) {
            cName += '0';
        }
        this.parentForm.addControl(cName, this.attrForm.form);
        this.cName = cName;
    }

    ngOnDestroy() {
        this.parentForm.removeControl(this.cName);
    }

    get valid() {
        return !this.attrForm || this.attrForm.valid;
    }

    onAddNewAttrClick(): void {
        this.attributes.addNew();
    }

    onRemoveAttrClick(idx: number): void {
        this.attributes.remove(idx);
        this.triggerFormValidation();
    }

    onAttrNameChange() {
        this.triggerFormValidation();
    }

    triggerFormValidation() {
        _.forOwn(this.attrForm.form.controls, (v: FormControl, k: string) => {
            v.updateValueAndValidity();
        });
    }

    ngOnInit() {
        let dict = this.dictService.byKey(this.type);
        this.addNewAttrLabel = dict.actions.addAttr ? dict.actions.addAttr.title : undefined;
        this.removeAttrTooltip = dict.actions.deleteAttr.popup;
        this.__typeaheadNames = _.map(_.filter(dict.attributes, {required: false}), 'name');
    }

    typeaheadAttrNames():string[] {
        return _.filter(this.__typeaheadNames, (name) => !this.attributes.contains(name));
    }

    typeaheadAttrValues(attrName: string): string[] {
        if (this.typeaheadValues) {
            return this.typeaheadValues.typeaheadValues(attrName);
        }
        return [];
    }

}