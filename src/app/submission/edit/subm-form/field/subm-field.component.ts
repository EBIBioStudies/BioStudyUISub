import {Component, Input} from '@angular/core';
import {FieldControl} from '../section-form';
import {FieldType} from '../../../shared/submission-type.model';

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
})
export class SubmFieldComponent {
    @Input() fieldControl?: FieldControl;
    @Input() readonly = false;

    valueLength = ValueLength.unknown;

    constructor() {
    }

    get fieldType(): FieldType {
        return this.fieldControl!.fieldType;
    }

    get isRequired(): boolean {
        return this.fieldType.required;
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

    hasErrors() {
        return this.isRequired && this.isInvalid && this.isTouched;
    }
}