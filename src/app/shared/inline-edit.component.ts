import {
    Component,
    Input,
    Output,
    forwardRef,
    EventEmitter
} from '@angular/core';

import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
    selector: 'inline-edit',
    templateUrl: './inline-edit.component.html',
    styleUrls: ['./inline-edit.component.css'],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InlineEditComponent), multi: true}
    ]
})
export class InlineEditComponent implements ControlValueAccessor {
    @Input() required?: boolean = false;
    @Input() disableEdit?: boolean = false;
    @Input() emptyValue?: string = '';
    @Input() placeholder?: string = '';
    @Output() remove: EventEmitter<any> = new EventEmitter<any>();

    editing: boolean = false;
    onChange: any = () => {};
    onTouched: any = () => {};

    private _value: string = '';

    get value(): any {
        return this._value;
    }

    set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    writeValue(value: any): void {
        this._value = value;
    }

    public registerOnChange(fn: () => {}): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    private get canEdit(): boolean {
        return !this.required && !this.disableEdit;
    }

    private startEditing(): void {
        this.editing = true;
    }

    private stopEditing(): void {
        this.editing = false;
    }

    private onRemoveClick(ev): void {
        this.remove.emit();
    }

    private onEditBoxBlur(ev): void {
        if (!this.value.length) {
            this.value = this.emptyValue;
        }
        this.stopEditing();
    }

    private onEditBoxKeyUp(ev: KeyboardEvent): void {
        if (ev.key === 'Enter') {
            this.stopEditing();
        }
    }
}