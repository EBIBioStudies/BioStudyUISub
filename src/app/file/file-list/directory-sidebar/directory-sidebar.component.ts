import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
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
    dirs: FileNode[] = [];
    @Output() select = new EventEmitter();
    @Output() toggle = new EventEmitter();

    private selectedPath?: string;

    constructor(private fileService: FileService) {}

    get value() {
        return this.selectedPath;
    }

    set value(val) {
        this.selectedPath = val;
        this.onChange(val);
    }

    ngOnInit() {
        this.fileService.getUserDirs().pipe(
            map((dirs) => dirs.map((dir) => new FileNode(true, dir.path, dir.name)))
        ).subscribe((dirs) => {
            this.dirs = dirs;
        });
    }

    onDirSelect(directory) {
        this.value = directory.path;

        if (this.select) {
            this.select.emit(directory.path);
        }
    }

    onToggle(e) {
        e.preventDefault();
        if (this.toggle) {
            this.toggle.emit();
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

    // From ControlValueAccessor interface
    writeValue(value: any) {
        if (value) {
            this.selectedPath = value;
        }
    }

    private onChange: any = () => {};
    private validateFn: any = () => {};
}
