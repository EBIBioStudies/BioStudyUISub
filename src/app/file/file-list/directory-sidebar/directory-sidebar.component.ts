import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PathInfo } from '../../shared/file-rest.model';
import { FileService } from '../../shared/file.service';
import { FileNode } from 'app/file/file-select/file-tree.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'st-directory-sidebar',
    templateUrl: './directory-sidebar.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DirectorySidebarComponent), multi: true}
    ]
})
export class DirectorySidebarComponent implements OnInit, ControlValueAccessor {
    @Input() collapsed?: boolean = false;
    @Output() toggle = new EventEmitter();
    @Output() select = new EventEmitter();

    private selectedPath?: string;

    dirs: FileNode[] = [];

    constructor(private fileService: FileService) {
    }

    private onChange: any = () => {};
    private validateFn: any = () => {};

    get value() {
        return this.selectedPath;
    }

    set value(val) {
        this.selectedPath = val;
        this.onChange(val);
    }

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.selectedPath = value;
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn) {
        this.onChange = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched() {}

    validate(c: FormControl) {
        return this.validateFn(c);
    }

    ngOnInit() {
        this.fileService.getUserDirs().pipe(
            map((dirs) => dirs.map((dir) => new FileNode(true, dir.path, dir.name)))
        ).subscribe((dirs) => {
            this.dirs = dirs;
        });
    }

    onToggle(e) {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
        }
    }

    onDirSelect(directory) {
        this.value = directory.path;

        if (this.select) {
            this.select.emit(directory.path);
        }
    }
}
