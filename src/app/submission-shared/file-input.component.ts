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
    templateUrl: './file-input.component.html',
    styleUrls:['./file-input.component.css'],
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
    private onChange: any = () => {};
    private onTouched: any = () => {};
    private validateFn: any = () => {};

    constructor(fileService: FileService) {
        fileService
            .getFiles('/User')
            .map(data => data.files)
            .map(files => files.map(f => f.path.replace(/^\/User\//, '')))
            .subscribe((files) => {
                this.files = files;
            });
    }

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

    //TODO: this tries to cater for an edge case when the selected file no longer exists. The control should then be invalid but is not behaving like so.
    validate(control: FormControl) {
        if (this.selected && this.files.length == 0) {
            control.setErrors({'required': true});
        } else {
            return this.validateFn(control);
        }
    }

    /**
     * Handler for blur events. Normalises the behaviour of the "touched" flag.
     */
    onBlur() {
        this.onTouched();
    }
}