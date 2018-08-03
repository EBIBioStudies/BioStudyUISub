import {Component, ElementRef, forwardRef, HostListener, Input, ViewChild} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'file-select',
    templateUrl: './file-select.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true}
    ],
    host: {
        '(document:click)': 'onOutsideClick($event)',
    },
})
export class FileSelectComponent implements ControlValueAccessor {
    @ViewChild("dropdown") ddRef: ElementRef;
    @ViewChild("inputbox") inRef: ElementRef;

    @Input('value') private selected: string = '';

    isOpen: boolean = false;

    private onChange: any = () => {};
    private onTouched: any = () => {};

    onInputClick(event: Event): void {
        this.isOpen = true;
    }

    onOutsideClick(event: Event): void {
        if (!this.ddRef) {
            return;
        }
        if (!this.ddRef.nativeElement.contains(event.target)
            && !this.inRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    doNothing(event: Event): boolean {
        event.preventDefault();
        return false;
    }

    get value() {
        return this.selected;
    }

    set value(value: any) {
        this.selected = value;
        this.onChange(value);
    }

    writeValue(value: any): void {
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

    setDisabledState(isDisabled: boolean): void {
    }

    onFileSelect(path: string) {
        this.value = path;
        this.isOpen = false;
    }
}