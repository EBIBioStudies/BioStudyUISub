import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileNode } from 'app/file/file-select/file-tree.model';
import { FileService } from '../../shared/file.service';
import { PathInfo } from '../../shared/file-rest.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'st-directory-sidebar',
  templateUrl: './directory-sidebar.component.html',
  styleUrls: ['./directory-sidebar.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DirectorySidebarComponent), multi: true }]
})
export class DirectorySidebarComponent implements OnInit, ControlValueAccessor {
  @Input() collapsed?: boolean = false;
  groups: FileNode[] = [];
  homeDir: FileNode = new FileNode(true, '/', 'home');
  @Output() directorySidebarSelect = new EventEmitter();
  selectedPath: string = '';
  @Output() toggle = new EventEmitter();

  constructor(private fileService: FileService) {}

  get value(): string {
    return this.selectedPath;
  }

  set value(val) {
    this.selectedPath = val;
    this.onChange(val);
  }

  ngOnInit(): void {
    const homeDir: PathInfo = this.fileService.getUserDir();

    this.homeDir = new FileNode(true, homeDir.path, homeDir.name);

    this.fileService
      .getUserGroups()
      .pipe(map((groups) => groups.map((group) => new FileNode(true, 'groups', group.name))))
      .subscribe((groups) => {
        this.groups = groups;
      });
  }

  onDirSelect(directory): void {
    this.value = directory.path;

    if (this.directorySidebarSelect) {
      this.directorySidebarSelect.emit(directory.path);
    }
  }

  onToggle(e): void {
    e.preventDefault();
    if (this.toggle) {
      this.toggle.emit();
    }
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  validate(c: FormControl): any {
    return this.validateFn(c);
  }

  writeValue(value: any): void {
    if (value) {
      this.selectedPath = value;
    }
  }

  private onChange: any = () => {};
  private validateFn: any = () => {};
}
