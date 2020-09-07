import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConfig } from 'app/app.config';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { typeaheadSource } from '../../shared/typeahead.utils';

@Component({
  selector: 'st-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InlineEditComponent), multi: true}
  ]
})
export class InlineEditComponent implements ControlValueAccessor {
  editing: boolean = false;
  @Input() emptyValue = '';
  @Input() placeholder = '';
  @Input() readonly = false;
  @Input() removable = true;
  @Output() remove = new EventEmitter<any>();
  suggestLength: number;
  @Input() suggestThreshold = 0;
  readonly typeahead: Observable<string[]>;

  private inlineEditValue: string = '';
  private valueChanges$: Subject<string> = new BehaviorSubject<string>('');

  /**
   * Sets the max number of suggestions shown at any given time.
   * @param appConfig - Global configuration object with app-wide settings.
   */
  constructor(private appConfig: AppConfig) {
    this.suggestLength = this.appConfig.maxSuggestLength;
    this.typeahead = typeaheadSource(() => {
      return this.autosuggestSource();
    }, this.valueChanges$);
  }

  get value(): any {
    return this.inlineEditValue;
  }

  set value(value: any) {
    if (value !== this.inlineEditValue) {
      this.inlineEditValue = value;
      this.onChange(value);
    }
  }

  get canEdit(): boolean {
    return !this.readonly;
  }

  get canRemove(): boolean {
    return this.canEdit && this.removable;
  }

  @Input() autosuggestSource: () => string[] = () => [];

  /**
   * Determines if the field's contents are longer than the actual field's dimensions by probing the DOM directly.
   * @param element - DOM element for the field.
   * @returns True if the text's length is greater than its container.
   */
  isOverflow(element: Element): boolean {
    return element.scrollWidth > element.clientWidth;
  }

  onBlur(): void {
    if ((this.value as string).isEmpty()) {
      this.value = this.emptyValue;
    }
    this.stopEditing();
  }

  // tslint:disable-next-line: variable-name
  onChange(_value: string): void { }

  onEdit(): void {
    this.startEditing();
  }

  /**
   * Handler for enter key press event. It cancels the press event's propagation and makes the component
   * go into display mode if the event is not resulting from the selection of a suggested column name.
   * @param event - DOM event object.
   * @param isSuggestOpen - If true, the autosuggest typeahead list is being displayed.
   */
  onEnterKey(event: Event, isSuggestOpen: boolean): void {
    event.stopPropagation();
    if (!isSuggestOpen) {
      this.stopEditing();
    }
  }

  onKeyDown(): void {
    this.valueChanges$.next(this.value);
  }

  onRemove(): void {
    this.remove.emit();
  }

  onTouched(): void {}

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.inlineEditValue = value;
  }

  private startEditing(): void {
    this.editing = this.canEdit;
  }

  private stopEditing(): void {
    this.editing = false;
  }

  /**
   * Handler for select event from auto-suggest typeahead. Fixes the lack of a change event when selecting
   * a value without any character being typed (typically in combination with typeaheadMinLength = 0).
   * The closest input element descendant will be the event's target.
   * TODO: this might be sorted in newer versions of the ngx-bootstrap plugin. Duplicate events may occur due to the
   * repeated calling of "set value(value)" above (cannot keep track of the last value and, by extension, can't detect change).
   * @param selection - Object for the currently selected value.
   */

  /*onSuggestSelect(selection: any) {
    this.rootEl.nativeElement.getElementsByTagName('input')[0].dispatchEvent(new Event('change', {bubbles: true}));
  }*/
}
