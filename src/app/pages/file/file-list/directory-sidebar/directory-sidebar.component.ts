import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileService } from '../../shared/file.service';
import { PathInfo } from '../../shared/file-rest.model';
import { FileNode } from 'app/pages/file/file-select/file-tree.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'st-directory-sidebar',
  templateUrl: './directory-sidebar.component.html',
  styleUrls: ['./directory-sidebar.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DirectorySidebarComponent), multi: true}
  ]
})
export class DirectorySidebarComponent implements OnInit, ControlValueAccessor {
  @Input() collapsed?: boolean = false;
  groups: FileNode[] = [];
  @Output() select = new EventEmitter();
  @Output() toggle = new EventEmitter();
  userDirs: FileNode[] = [];

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
    const userDir: PathInfo = this.fileService.getUserDir();

    this.userDirs = [new FileNode(true, userDir.path, userDir.name)];

    this.fileService.getUserGroups().pipe(
      map((groups) => groups.map((group) => new FileNode(true, 'groups', group.name)))
    ).subscribe((groups) => {
      this.groups = groups;
      this.collapsed = groups.length === 0;
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
