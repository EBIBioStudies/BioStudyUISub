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

@Component({
    selector: 'file-input',
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
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileInputComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => FileInputComponent), multi: true}
    ]
})
export class FileInputComponent implements ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() name: string;

    @Input('value') private selected: string = '';
    files: string[] = [];

    constructor(fileService: FileService) {
        fileService
            .getFiles('/User')
            .map(data => data.files)
            .map(files => files.map(f => f.path.replace(/^\/User\//, '')))
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

    writeValue(value: any) {
        if (value) {
            this.selected = value;
        }
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    validate(c: FormControl) {
        return this.validateFn(c);
    }
}