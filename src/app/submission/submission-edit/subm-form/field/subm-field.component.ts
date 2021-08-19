import { Component, Input, OnDestroy } from '@angular/core';
import { FieldType, ValueType, TextValueType } from 'app/submission/submission-shared/model';
import { isStringEmpty } from 'app/utils';
import { FieldControl } from '../../shared/model/field-control.model';

class ValueLength {
  static unknown: ValueLength = new ValueLength();

  constructor(readonly min = -1, readonly max = -1) {}

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
  templateUrl: './subm-field.component.html'
})
export class SubmFieldComponent implements OnDestroy {
  @Input() fieldControl!: FieldControl;
  @Input() readonly = false;

  private valueLen?: ValueLength;

  ngOnDestroy(): void {
    if (this.fieldControl) {
      this.fieldControl.unsubscribe();
    }
  }

  get fieldType(): FieldType {
    return this.fieldControl.type;
  }

  get fieldName(): string {
    return this.fieldType.title || this.fieldControl.name;
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

  get fieldHelpLink(): string {
    return this.fieldType.helpLink;
  }

  get isEmpty(): boolean {
    if (Array.isArray(this.fieldControl!.control.value)) {
      return this.fieldControl!.control.value.length === 0;
    }

    return isStringEmpty(this.fieldControl!.control.value as string);
  }

  get isRequired(): boolean {
    return this.fieldType.displayType.isRequired;
  }

  get isReadonly(): boolean {
    return this.readonly || this.fieldType.displayType.isReadonly;
  }

  get isInvalid(): boolean {
    return this.fieldControl.control.invalid;
  }

  get isValid(): boolean {
    return this.fieldControl.control.valid;
  }

  get isTouched(): boolean {
    return this.fieldControl.control.touched;
  }

  get hasErrors(): boolean {
    return this.isRequired && this.isInvalid && this.isTouched;
  }

  get hasHelpText(): boolean {
    return this.fieldHelpText.length > 0;
  }

  get hasHelpLink(): boolean {
    return this.fieldHelpLink.length > 0;
  }

  get errors(): string[] {
    return this.fieldControl.errors;
  }

  get valueLength(): ValueLength {
    if (this.valueLen === undefined) {
      const vt = this.valueType;
      if (vt.isText()) {
        const min = (vt as TextValueType).minlength;
        const max = (vt as TextValueType).maxlength;
        this.valueLen = new ValueLength(min, max);
      } else {
        this.valueLen = ValueLength.unknown;
      }
    }
    return this.valueLen;
  }
}
