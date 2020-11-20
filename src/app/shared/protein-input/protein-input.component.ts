import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as DecoupledEditor from '@biostudies/ckeditor5-build-balloon';
import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';
import { isStringEmpty } from 'app/utils';

@Component({
  selector: 'st-protein-input',
  templateUrl: './protein-input.component.html',
  styleUrls: ['./protein-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProteinInputComponent),
    multi: true
  }]
})
export class ProteinInputComponent implements ControlValueAccessor {
  config = {
    toolbar: [ 'bold', 'italic', 'fontColor' ]
  };
  editor = DecoupledEditor;
  proteinSequence = '';
  @Input() readonly: boolean = false;
  @Input() isInputGroup: boolean = false;
  @Input() inputId: string = '';
  @Input() formControl!: FormControl;
  private proteinRawSequence = '';

  onEditorChange({ editor }: ChangeEvent): void {
    setTimeout(() => {
      this.proteinRawSequence = viewToPlainText(editor.editing.view.document.getRoot());
      this.informChange();
    }, 10);
  }

  onEditorReady(editor): void {
    this.proteinRawSequence = viewToPlainText(editor.editing.view.document.getRoot());
    this.informChange();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  writeValue(data: any): void {
    if (data) {
      if (typeof data === 'string') {
        this.proteinSequence = data;
      } else {
        const { value, raw } = data;

        this.proteinRawSequence = raw;
        this.proteinSequence = value;
      }
    }
  }

  private informChange(): void {
    if (!isStringEmpty(this.proteinSequence)) {
      this.onChange(`${this.proteinSequence}@${this.proteinRawSequence}`);
    } else {
      this.onChange();
    }
  }

  // placeholder for handler propagating changes outside the custom control
  private onChange: any = (_: any) => {};
}
