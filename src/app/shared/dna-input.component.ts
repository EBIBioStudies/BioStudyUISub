import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as DecoupledEditor from '@biostudies/ckeditor5-build-balloon';
import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';

const dnaColorScheme = [
  {
    color: 'hsl(241.44, 88.19%, 53.53%)',
    label: 'Blue'
  },
  {
    color: 'hsl(45.14, 95.61%, 55.29%)',
    label: 'Yellow'
  },
  {
    color: 'hsl(123.33, 46.39%, 38.04%)',
    label: 'Green'
  },
  {
    color: 'hsl(358.33, 88.52%, 47.84%)',
    label: 'Red'
  }
];

@Component({
  selector: 'st-dna-input',
  templateUrl: './dna-input.component.html',
  styleUrls: ['./dna-input.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DNAInputComponent),
    multi: true
  }]
})
export class DNAInputComponent implements ControlValueAccessor {
  config = {
    fontColor: {
      colors: dnaColorScheme
    },
    toolbar: [ 'bold', 'italic', 'fontColor' ]
  };
  dnaSequence = '';
  editor = DecoupledEditor;
  @Input() readonly: boolean = false;
  private dnaRawSequence = '';

  onEditorChange({ editor }: ChangeEvent): void {
    setTimeout(() => {
      this.dnaRawSequence = viewToPlainText(editor.editing.view.document.getRoot());
      this.onChange({ value: this.dnaSequence, raw: this.dnaRawSequence });
    }, 10);
  }

  onEditorReady(editor): void {
    this.dnaRawSequence = viewToPlainText(editor.editing.view.document.getRoot());
    this.onChange({ value: this.dnaSequence, raw: this.dnaRawSequence });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  writeValue(data: any): void {
    if (data) {
      if (typeof data === 'string') {
        this.dnaSequence = data;
      } else {
        const { value, raw } = data;

        this.dnaRawSequence = raw;
        this.dnaSequence = value;
      }
    }
  }

  // placeholder for handler propagating changes outside the custom control
  private onChange: any = (_: any) => {};
}
