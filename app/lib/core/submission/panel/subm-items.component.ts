import {Component, Inject, Input, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgForm, FormGroup} from '@angular/forms';

import {TypeaheadValues} from './typeahead-values';
import {DictionaryService, Items, Item} from '../../../submission/index';

import * as _ from 'lodash';

@Component({
    selector: 'subm-items',
    template: `

<tabset>
    <tab [heading]="previewTabHeading">
        <form novalidate 
              id="items-preview-form" 
              name="items-preview-form" 
              role="form"
             (ngSubmit)="$event.preventDefault();"
             #itemsPreviewForm="ngForm">
        <div class="table-responsive">
            <table class="table table-condensed" style="width:100%">
                <thead>
                <tr>
                   <th></th>
                   <th></th>
                   <th *ngFor="let attrName of attrNames">
                      <span class="text-muted has-error error">{{attrName}}</span>
                   </th>
                </tr>   
                </thead>
                <tbody>
                <tr *ngFor="let item of items.items; let idx=index">
                    <td>
                        {{idx+1}}
                    </td>
                    <td>
                        <button type="button"
                                class="btn btn-primary btn-sm"
                                (click)="activeTab = idx"
                                [tooltip]="editTooltip"><i class="fa fa-edit"></i>
                        </button>   
                        <button *ngIf="!readonly" type="button" 
                                class="btn btn-danger btn-sm"
                                (click)="items.remove(idx)"
                                [tooltip]="deleteTooltip"><i class="fa fa-trash"></i>
                        </button>
                    </td>
                    <td *ngFor="let attrName of attrNames" class="form-group-sm row" [ngClass]="colSizeCss">
                        <div *ngFor="let attr of (item.attributes.attributes | propFilter:{name: attrName})"
                             [ngClass]="{'has-error' : itemsPreviewForm.controls[attr.name + '_' + idx] &&
                                                       itemsPreviewForm.controls[attr.name + '_' + idx].invalid}">
<!--
                             previewItemForm['attrValuePreview_' + key].$invalid
-->
                            <input *ngIf="attr.type === 'text'"
                                   type="text" class="form-control input-sm form-control-auto" 
                                   [name]="attr.name + '_' + idx" 
                                   placeholder="Enter a value"
                                   [typeahead]="typeaheadValues(attr.name, idx)"
                                   typeaheadAppendToBody="true"
                                   typeaheadMinlength="0"
                                   typeaheadOptionsLimit="10"   
                                   tooltip="This field is required"
                                   placement="top-left"
                                   [isDisabled]="itemsPreviewForm.controls[attr.name + '_' + idx] && itemsPreviewForm.controls[attr.name + '_' + idx].valid"
                                   [required]="attr.required"
                                   [(ngModel)]="attr.value"
                                   [readonly]="readonly">
<!--
                                   ng-model-options="{ allowInvalid: true }">
-->
                            <input-file *ngIf="attr.type === 'file'"
                                        [name]="attr.name + '_' + idx" 
                                        [(ngModel)]="attr.value"
                                        [readonly]="readonly"
                                        [required]="attr.required">
                            </input-file>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        </form>    
    </tab>

    <tab *ngFor="let item of items.items; let idx=index" [active]="activeTab === idx">
        <template tabHeading>
          <span [ngClass]="{'text-danger': submAttr.attrForm.invalid}">{{tabHeading + (idx + 1)}}</span>
        </template>
        
        <p class="pull-right padding-right-small padding-top-small">
            <button *ngIf="!readonly"
                    type="button"
                    class="pull-right btn btn-danger btn-xs"
                    (click)="items.remove(idx);"
                    [tooltip]="deleteTooltip"
                    placement="bottom"><i class="fa fa-lg fa-trash"></i>
            </button>
        </p>
        <table *ngIf="type === 'publication'" class="table table-condensed" style="width:100%">
        <tr>
            <td><p class="form-control-static pull-right">Pub Med Id</p></td>
            <td>
               <pubmedid-search 
                   [(ngModel)]="item.pubMedId"
                   (found)="pubMedIdFound($event, item)"></pubmedid-search>    
            </td>    
        </tr>
        </table>

        <subm-attributes
             [attributes]="item.attributes"
             [type]="type"
             [readonly]="readonly"
             [parentForm]="itemsForm"
             [typeaheadValues]="typeaheadValuesFor(idx)"
             #submAttr>
        </subm-attributes>
    </tab>

</tabset>
`
})
export class SubmissionItemsComponent implements OnInit, OnDestroy {
    @Input() items: Items;
    @Input() type: string; // should be a enum??
    @Input() readonly: boolean;
    @Input() parentForm: FormGroup;

    editTooltip: string;
    deleteTooltip: string;
    tabHeading: string;
    previewTabHeading: string;
    activeTab: number = -1;

    private  __typeaheadValues: TypeaheadValues;
    private itemsForm: FormGroup;

    @ViewChild('itemsPreviewForm') private itemsPreviewForm: NgForm;

    constructor(@Inject(DictionaryService) private dictService: DictionaryService) {
    }

    ngOnInit() {
        this.itemsForm = new FormGroup({});

        let dict = this.dictService.byKey(this.type);
        this.editTooltip = dict.actions.edit.popup;
        this.deleteTooltip = dict.actions.delete.popup;
        this.tabHeading = dict.tabHeading;
        this.previewTabHeading = dict.previewTabHeading;
        this.__typeaheadValues = new TypeaheadValues(
            _.map(_.filter(dict.attributes, {typeahead: true}), 'name'),
            this.items);
    }

    ngAfterContentInit() {
        this.itemsForm.addControl('itemsPreviewForm', this.itemsPreviewForm.form);
        this.parentForm.addControl(`itemsForm_${this.type}`, this.itemsForm);
    }

    ngOnDestroy() {
        this.parentForm.removeControl(`itemsForm_${this.type}`);
    }

    get valid(): boolean {
        return !this.itemsForm || this.itemsForm.valid;
    }

    get attrNames(): string[] {
        let hash = {};
        _.forEach(this.items.items, function (item) {
            _.forEach(item.attributes.attributes, function (attr) {
                hash[attr.name] = 1;
            });
        });
        return _.keysIn(hash);
    }

    get colSizeCss(): string {
        let length = this.attrNames.length;
        if (length > 6) {
            length = 6;
        }
        return 'col-lg-' + Math.ceil(12 / length);
    }

    pubMedIdFound(data, item: Item) {
        console.log("pubMedIdFound", data);
        item.attributes.update(data);
    }

    typeaheadValues(attrName: string, itemIdx: number): string[] {
        return this.__typeaheadValues.typeaheadValues(attrName, itemIdx);
    }

    typeaheadValuesFor(itemIdx) {
        return this.__typeaheadValues.forItem(itemIdx);
    }
}