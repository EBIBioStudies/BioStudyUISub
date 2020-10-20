import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileTreeStore } from './file-tree.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'st-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true}
  ]
})
export class FileSelectComponent implements ControlValueAccessor, OnDestroy {
  isEmpty = false;
  isOpen = false;
  @Input() inputId = '';
  @Input() readonly = false;
  @Input() isInputGroup: boolean = false;
  // tslint:disable-next-line: no-input-rename
  @Input('value')
  private selected = '';
  private unsubscribe = new Subject();

  constructor(private fileStore: FileTreeStore) {}

  get value(): string {
    return this.selected;
  }

  set value(value: string) {
    this.selected = value;
    this.onChange(value);
  }

  doNothing(event: Event): boolean {
    event.preventDefault();
    return false;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.fileStore.clearCache();
  }

  onFileDropdownClose(): void {
    this.isOpen = false;
  }

  onFileSelect(path: string): void {
    this.value = path;
  }

  onInputClick(): void {
    setTimeout(() => { this.isOpen = true; }, 100);
  }

  onUploadFile($event): void {
    this.value = $event.fileName;
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(): void { }

  setDisabledState(): void {}

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

  private onChange: any = () => { };
}
