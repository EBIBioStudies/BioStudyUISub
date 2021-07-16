import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileTreeStore } from './file-tree.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UploadFileModalComponent } from '../upload-file-modal/upload-file-modal.component';

@Component({
  selector: 'st-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileSelectComponent), multi: true }]
})
export class FileSelectComponent implements ControlValueAccessor, OnDestroy {
  @Input() inputId = '';
  @Input() readonly = false;
  @Input() isInputGroup: boolean = false;
  // tslint:disable-next-line: no-input-rename
  @Input('value')
  private selected = '';
  private unsubscribe = new Subject();

  constructor(private fileStore: FileTreeStore, private modalService: BsModalService) {}

  get value(): string {
    return this.selected;
  }

  set value(value: string) {
    this.selected = value;
    this.onChange(value);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.fileStore.clearCache();
  }

  openFileSelectModal(): void {
    if (!this.readonly) {
      const modal = this.modalService.show(UploadFileModalComponent, { ignoreBackdropClick: true });

      (modal.content as UploadFileModalComponent).onClose.pipe(takeUntil(this.unsubscribe)).subscribe((fileName) => {
        this.value = fileName;
      });
    }
  }

  registerOnChange(fn): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState(): void {}

  writeValue(value: any): void {
    if (value) {
      this.fileStore
        .findFile(value)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((path) => {
          this.selected = path;
          // temporary fix: implicitly converting file path to /Groups/<group group_name>/..
          if (path !== value) {
            this.onChange(path);
          }
        });
    }
  }

  private onChange: any = () => {};
}
