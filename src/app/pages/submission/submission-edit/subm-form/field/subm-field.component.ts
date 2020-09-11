import { Component, Input } from '@angular/core';
import { FieldType, ValueType, TextValueType } from 'app/pages/submission/submission-shared/model/templates';
import { isStringEmpty } from 'app/utils';
import { RichTextFieldValue } from './../../../submission-shared/model/submission/submission.model';
import { FieldControl } from '../../shared/model/field-control.model';

class ValueLength {
  static unknown: ValueLength = new ValueLength();

  constructor(readonly min = -1, readonly max = -1) {
  }

  get isDefined(): boolean {
    return this.min > 0 || this.max > 0;
  }

  get isBetween(): boolean {
    return this.min > 0 && this.max > 0;
  }

  get isAtLeast(): boolean {
    return this.min > 0 && this.max < 0;
  }

  get isAtMost(): boolean {
    return this.min < 0 && this.max > 0;
  }
}

@Component({
  selector: 'st-subm-field',
  templateUrl: './subm-field.component.html',
  styleUrls: ['./subm-field.component.css']
})
export class SubmFieldComponent {
  @Input() fieldControl?: FieldControl;
  @Input() readonly = false;

  private valueLen?: ValueLength;

  constructor() {
  }

  get fieldType(): FieldType {
    return this.fieldControl!.type;
  }

  get fieldName(): string {
    return this.fieldControl!.name;
  }

  get valueType(): ValueType {
    return this.fieldType.valueType;
  }

  get fieldIcon(): string {
    return this.fieldType.icon;
  }

  get fieldHelpText(): string {
    return this.fieldType.helpText;
  }

  get isEmpty(): boolean {
    if (this.fieldType.valueType.isRich()) {
      const fieldValue: RichTextFieldValue = <RichTextFieldValue>this.fieldControl!.control.value;

      return isStringEmpty(fieldValue.raw);
    }

    return isStringEmpty(<string>this.fieldControl!.control.value);
  }

  get isRequired(): boolean {
    return this.fieldType.displayType.isRequired;
  }

  get isReadonly(): boolean {
    return this.readonly || this.fieldType.displayType.isReadonly;
  }

  get isInvalid(): boolean {
    return this.fieldControl!.control.invalid;
  }

  get isValid(): boolean {
    return this.fieldControl!.control.valid;
  }

  get isTouched(): boolean {
    return this.fieldControl!.control.touched;
  }

  get hasErrors(): boolean {
    return this.isRequired && this.isInvalid && this.isTouched;
  }

  get hasHelpText(): boolean {
    return this.fieldHelpText.length > 0;
  }

  get errors(): string[] {
    return this.fieldControl!.errors;
  }

  get valueLength() {
    if (this.valueLen === undefined) {
      const vt = this.valueType;
      if (vt.isText()) {
        const min = (<TextValueType>vt).minlength;
        const max = (<TextValueType>vt).maxlength;
        this.valueLen = new ValueLength(min, max);
      } else {
        this.valueLen = ValueLength.unknown;
      }
    }
    return this.valueLen;
  }
}
