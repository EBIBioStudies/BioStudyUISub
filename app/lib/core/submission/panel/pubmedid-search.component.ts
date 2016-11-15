import {Component, Inject, Input, Output, OnChanges, forwardRef, EventEmitter} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor} from '@angular/forms';

import * as _ from 'lodash';
import {PubMedSearchService} from '../../../submission/pubMedSearch.service';

@Component({
    selector: 'pubmedid-search',
    template: `
    <input type="text" class="form-control input-sm"
           placeholder="Enter Pub Med Id" 
           [name]="name"
           [(ngModel)]="pubMedId"
           (ngModelChange)="ngOnChanges()"
           [readonly]="readonly">
`, providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PubMedIdSearchComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => PubMedIdSearchComponent), multi: true}
    ]
})
export class PubMedIdSearchComponent implements ControlValueAccessor, OnChanges {
    @Input() readonly?: boolean = false;
    @Input() name: string;
    @Input('value') private pubMedId: string;

    @Output() found: EventEmitter = new EventEmitter<any>();

    private debouncedSearch = _.debounce(this.pubMedSearch, 1000);

    constructor(@Inject(PubMedSearchService) private pubMedSearchService: PubMedSearchService) {
    }

    ngOnChanges() {
        if (this.pubMedId) {
            this.debouncedSearch();
        }
    }

    pubMedSearch() {
        this.pubMedSearchService
            .search(this.pubMedId)
            .subscribe((resp) => {
                console.log("pubMedId search:", resp);
                if (resp.status === "OK" && resp.data.hasOwnProperty('title')) {
                    this.found.emit(this.uppercaseProperties(resp.data));
                }
            });
    }

    uppercaseProperties(obj) {
        let res = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key.charAt(0).toUpperCase() + key.substring(1)] = obj[key];
            }
        }
        console.log("upperCaseProperties:", res);
        return res;
    }

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    get value() {
        return this.pubMedId;
    }

    set value(val) {
        this.pubMedId = val;
        this.onChange(val);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.pubMedId = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn) {
        this.onChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }

}