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
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileInputComponent), multi: true}
    ]
})
export class FileInputComponent implements ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @Input() name: string;
    @Input('value') private selected: string = '';

    files: string[] = [];
    isFound: boolean = false;        //flags a selected file name that is indeed among the existing

    private onChange: any = () => {};
    private onTouched: any = () => {};

    constructor(private fileService: FileService) {}

    get value() {
        return this.selected;
    }

    /**
     * Updates the selected value together with the found status. The latter is done to make sure it is changed
     * even if the field was initially set to a non-existent file.
     * @param {string} newValue - New selected file's path.
     */
    set value(newValue: any) {
        this.selected = newValue;
        this.isFound = this.files.indexOf(this.selected) != -1;
        this.onChange(newValue);
    }

    /**
     * Grabs the list of files in the user folder and checks whether the pre-selected file exists, if applicable.
     */
    ngOnInit() {
        this.fileService
            .getFiles('/User')
            .map(data => data.files)
            .map(files => files.map(f => f.path.replace(/^\/User\//, '')))
            .subscribe((files) => {
                this.files = files;

                //A file has already been selected => must be among the user files
                if (this.selected) {
                    this.isFound = this.files.indexOf(this.selected) != -1;
                }

                //When the selected file no longer exists, the selection should be reset.
                if (!this.isFound) {
                    this.value = '';
                }
            });
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property.
     * @see {@link ControlValueAccessor}
     * @param {string} newValue - Value to be set as selected file's path.
     */
    writeValue(newValue: string) {
        if (newValue) {
            this.selected = newValue;
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }

    /**
     * Registers a handler specifically for when a control receives a touch event.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler for touch events.
     */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}