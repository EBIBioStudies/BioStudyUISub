import {Component, Input, OnInit, OnDestroy, ViewChild, forwardRef} from '@angular/core';
import {NgForm, FormGroup, FormControl} from '@angular/forms';

import * as _ from 'lodash';

import {Attributes} from '../submission';
import {DictionaryService} from '../dictionary.service';
import {TypeaheadValuesForItem} from './typeahead-values';

@Component({
    selector: 'subm-attributes',
    templateUrl: './subm-attributes.component.html'
})
export class SubmissionAttributesComponent implements OnInit, OnDestroy {
    @Input() attributes: Attributes;
    @Input() type: string; // should be a enum??
    @Input() readonly: boolean;
    @Input() parentForm: FormGroup;
    @Input() typeaheadValues?: TypeaheadValuesForItem;

    @ViewChild('attrForm') private attrForm: NgForm;

    private removeAttrTooltip: string;
    private __typeaheadNames: string[];
    private cName: string;

    addNewAttrLabel: string;

    constructor(private dictService: DictionaryService) {
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
        return this.attrForm === undefined || this.attrForm.valid;
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