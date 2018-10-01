import {Component, Input} from '@angular/core';
import {FieldControl} from '../section-form';
import {FieldType, TextValueType, ValueType} from '../../../shared/submission-type.model';

class ValueLength {
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

    static unknown: ValueLength = new ValueLength();
}

@Component({
    selector: 'subm-field',
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
        return this.fieldControl!.field.type;
    }

    get fieldName(): string {
        return this.fieldControl!.field.name;
    }

    get valueType(): ValueType {
        return this.fieldType.valueType;
    }

    get isRequired(): boolean {
        return this.fieldType.required;
    }

    get isReadonly(): boolean {
        return this.readonly || this.fieldType.readonly;
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

    onValueChange(event) {
        //TODO
    }
}