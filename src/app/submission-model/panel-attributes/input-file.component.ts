import {
    Component,
    Input,
    forwardRef
} from '@angular/core';

import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from '@angular/forms';

import {FileService} from 'app/file/index';

import * as _ from 'lodash';

@Component({
    selector: 'input-file',
    template: `
    <select  *ngIf="files.length > 0"
             class="form-control input-sm"
             [name]="name"
             [(ngModel)]="value"
             [required]="required"
             [disabled]="readonly">
             <option *ngFor="let file of files" [value]="file">{{file}}</option>
    </select>
    <a *ngIf="files.length == 0"
        [routerLink]="['/files',{bb:'1'}]"
        class="btn btn-link">Go to File Upload</a>
`,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputFileComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => InputFileComponent), multi: true}
    ]
})
export class InputFileComponent implements ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() name: string;

    @Input('value') private selected: string = '';
    files: Array<string> = [];

    constructor(fileService: FileService) {
        fileService
            .getFiles('/User')
            .map(data => data.files)
            .map(files => _.map(files, f => f.path.replace(/^\/User\//, '')))
            .subscribe((files) => {
                this.files = files;
            });
    }

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };
    private validateFn: any = () => {
    };

    get value() {
        return this.selected;
    }

    set value(val) {
        this.selected = val;
        this.onChange(val);
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.selected = value;
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