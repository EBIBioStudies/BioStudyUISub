import {Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FileTreeStore} from "./file-tree.store";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'file-select',
    templateUrl: './file-select.component.html',
    styleUrls: ['./file-select.component.css'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true}
    ],
    host: {
        '(document:click)': 'onOutsideClick($event)',
    },
})
export class FileSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @ViewChild("dropdown") ddRef: ElementRef;
    @ViewChild("inputbox") inRef: ElementRef;

    @Input('value') private selected = '';

    isOpen = false;
    isEmpty = false;
    isLoading = true;

    private unsubscribe = new Subject();

    private onChange: any = () => {
    };
    private onTouched: any = () => {
    };

    constructor(private fileStore: FileTreeStore) {
    }

    ngOnInit(): void {
        this.fileStore.isEmpty()
            .takeUntil(this.unsubscribe)
            .subscribe(fileNode => {
                this.isLoading = false;
                this.isEmpty = fileNode === undefined;
            });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.fileStore.clearCache();
    }

    onInputClick(event: Event): void {
        this.isOpen = true;
    }

    onOutsideClick(event: Event): void {
        if (!this.isOpen || !this.ddRef) {
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
            this.fileStore.findFile(value)
                .takeUntil(this.unsubscribe)
                .subscribe(path => {
                    this.selected = path || '';
                    // temporary fix: implicitly converting file path to /Groups/<group group_name>/..
                    if (path !== value) {
                        this.onChange(path);
                    }
                });
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