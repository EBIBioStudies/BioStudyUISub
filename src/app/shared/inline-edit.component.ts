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
    @Input() required?: boolean = false;        //flag indicating if the field must have a value
    @Input() disableEdit?: boolean = false;     //flag indicating if changing and removing the field is not allowed
    @Input() disableChange?: boolean = false;   //flag indicating if changing the field's initial value is allowed
    @Input() disableRemove?: boolean = false;   //flag indicating if removing the field is not allowed
    @Input() emptyValue?: string = '';          //default value for the field if left empty
    @Input() placeholder?: string = '';         //indicative text inside the field if not in focus
    @Input() autosuggest: any[] = [];           //typeahead list of suggested values
    @Input() suggestThreshold: number = 0;      //the typeahead is meant to act as a reminder of other fields too
    @Input() suggestLength: number = 30;        //max number of suggested values to be displayed at once
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

    public get canEdit(): boolean {
        return !this.required && !this.disableEdit;
    }

    public startEditing(): void {
        this.editing = true;
    }

    private stopEditing(): void {
        this.editing = false;
    }

    private onRemoveClick(ev): void {
        this.remove.emit();
    }

    /**
     * Handler for the blur event triggered by the input part of the edit box.
     * Returns the box to its non-edit state and normalises the input value to the default if empty.
     * @param {Event} event - DOM event for the click action.
     */
    public onEditBoxBlur(event: Event): void {
        this.value = this.value.trim();
        if (!this.value.length) {
            this.value = this.emptyValue;
        }
        this.stopEditing();
    }

    /**
     * Handler for enter key press event. It cancels the press event's propagation and makes the component
     * go into display mode if the event is not resulting from the selection of a suggested column name.
     * @param {Event} event - DOM event object.
     * @param {boolean} isSuggestOpen - If true, the autosuggest typeahead list is being displayed.
     */
    public onEditBoxEnter(event: Event, isSuggestOpen: boolean): void {
        event.stopPropagation();
        if (!isSuggestOpen) {
            this.stopEditing();
        }
    }

    /**
     * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
     * @param {Element} element - DOM element for the field.
     * @returns {boolean} True if the text's length is greater than its container.
     */
    public isOverflow(element: Element): boolean {
        return element.scrollWidth > element.clientWidth;
    }
}