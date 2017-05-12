import {
    Component,
    Input,
    Output,
    OnChanges,
    forwardRef,
    EventEmitter
} from '@angular/core';

import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from '@angular/forms';

import * as _ from 'lodash';

import {PubMedSearchService} from './pubmedid-search.service';

@Component({
    selector: 'pubmedid-search',
    template: `
    <input type="text" class="form-control input-sm"
           placeholder="Enter Pub Med Id" 
           [(ngModel)]="value"
           (ngModelChange)="ngOnChanges()"
           [readonly]="readonly">
`, providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PubMedIdSearchComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => PubMedIdSearchComponent), multi: true}
    ]
})
export class PubMedIdSearchComponent implements ControlValueAccessor, OnChanges {
    @Input() readonly?: boolean = false;

    @Output() found: EventEmitter<any> = new EventEmitter<any>();

    private pubMedId: string;

    private debouncedSearch = _.debounce(this.pubMedSearch, 1000);

    constructor(private pubMedSearchService: PubMedSearchService) {
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
                if (resp.hasOwnProperty('title')) {
                    this.found.emit(this.uppercaseProperties(resp));
                }
            });
    }

    uppercaseProperties(obj) {
        let res = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key.charAt(0).toUpperCase() + key.substring(1)] = obj[key];
            }
        }
        console.log("upperCaseProperties:", res);
        return res;
    }

    private changed = new Array<(value: string) => void>();
    private touched = new Array<() => void>();
    private validateFn: any = () => {
    };


    get value() {
        return this.pubMedId;
    }

    set value(val) {
        if (this.pubMedId !== val) {
            this.pubMedId = val;
            this.changed.forEach(f => f(val));
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.pubMedId = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: (value: string) => void) {
        this.changed.push(fn);
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }
}