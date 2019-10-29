import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileTreeStore } from './file-tree.store';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'st-file-select',
    templateUrl: './file-select.component.html',
    styleUrls: ['./file-select.component.css'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true}
    ]
})
export class FileSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
    // tslint:disable-next-line: no-input-rename
    @Input('value') private selected = '';

    isOpen = false;
    isEmpty = false;
    isLoading = true;

    private unsubscribe = new Subject();

    constructor(private fileStore: FileTreeStore) {
    }

    private onChange: any = () => {
    }

    ngOnInit(): void {
        this.fileStore.isEmpty()
            .pipe(takeUntil(this.unsubscribe))
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

    onInputClick(): void {
        setTimeout(() => { this.isOpen = true; }, 100);
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
                .pipe(takeUntil(this.unsubscribe))
                .subscribe(path => {
                    this.selected = path;
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

    registerOnTouched() {}

    setDisabledState(): void {
    }

    onFileSelect(path: string) {
        this.value = path;
    }

    onFileDropdownClose() {
        this.isOpen = false;
    }
}
