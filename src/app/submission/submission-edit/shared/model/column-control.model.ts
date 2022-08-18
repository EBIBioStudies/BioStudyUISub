import { Attribute, ValueType } from 'app/submission/submission-shared/model';
import { ErrorMessages, SubmFormValidators } from '../form-validators';

import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Observable } from 'rxjs';
import { typeaheadSource } from '../typeahead.utils';
import { DocItem } from '../../field-docs-modal/field-docs-modal.component';

export class ColumnControl {
  readonly control: CustomFormControl;

  private typeahead: Observable<string[]> | undefined;

  constructor(private column: Attribute, ref: ControlRef) {
    this.control = new CustomFormControl(column.name, SubmFormValidators.forColumn(column)).withRef(ref);
    this.control.valueChanges.subscribe((v) => {
      column.name = v;
    });
  }

  get autosuggest(): boolean {
    return this.column.autosuggest;
  }

  get isRemovable(): boolean {
    return this.column.displayType.isRemovable;
  }

  get isRequired(): boolean {
    return this.column.displayType.isRequired;
  }

  get canEditName(): boolean {
    return this.column.canEditName;
  }

  get isReadonly(): boolean {
    return this.column.displayType.isReadonly;
  }

  get id(): string {
    return this.column.id;
  }

  get name(): string {
    return this.column.name;
  }

  get valueType(): ValueType {
    return this.column.valueType;
  }

  get hasErrors(): boolean {
    return this.control.invalid && this.control.touched;
  }

  get errors(): string[] {
    return ErrorMessages.map(this.control);
  }

  get helpText(): string {
    return this.column.helpText;
  }

  get helpLink(): string {
    return this.column.helpLink;
  }

  get helpContextual(): DocItem | undefined {
    return this.column.helpContextual;
  }

  typeaheadSource(sourceFunc: () => string[]): Observable<string[]> {
    if (this.typeahead === undefined) {
      this.typeahead = typeaheadSource(sourceFunc, this.control.valueChanges);
    }

    return this.typeahead;
  }
}
