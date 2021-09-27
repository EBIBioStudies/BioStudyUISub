import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AppConfig } from 'app/app.config';
import { isStringEmpty } from 'app/utils/validation.utils';
import { typeaheadSource } from '../../shared/typeahead.utils';

@Component({
  selector: 'st-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InlineEditComponent), multi: true }]
})
export class InlineEditComponent implements ControlValueAccessor {
  editing: boolean = false;
  suggestLength: number;
  @Input() canEdit = false;
  @Input() emptyValue = '';
  @Input() isOptional = false;
  @Input() placeholder = '';
  @Input() readonly = false;
  @Input() removable = true;
  @Input() suggestThreshold = 0;
  @Output() remove = new EventEmitter<any>();
  readonly columnOptions: Observable<string[]>;

  @ViewChild('inlineEditBox', { static: true })
  private inlineEditBox!: ElementRef;

  private inlineEditValue: string = '';
  private valueChanges$: Subject<string> = new BehaviorSubject<string>('');

  /**
   * Sets the max number of suggestions shown at any given time.
   * @param appConfig - Global configuration object with app-wide settings.
   */
  constructor(private appConfig: AppConfig) {
    this.suggestLength = this.appConfig.maxSuggestLength;
    this.columnOptions = typeaheadSource(() => {
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
    if (isStringEmpty(this.value)) {
      this.value = this.emptyValue;
    }
    this.stopEditing();
  }

  // tslint:disable-next-line: variable-name
  onChange(_value: string): void {}

  onEdit(): void {
    this.startEditing();
    this.inlineEditBox.nativeElement.focus();
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
}
