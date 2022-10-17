import { DisplayType, ValueType, ValueTypeFactory, DependencyTypeTable, DependencyTypeSection } from '../templates';

import { nextId } from './submission.model.counter';
import { DocItem } from '../../../submission-edit/field-docs-modal/field-docs-modal.component';

export class Attribute {
  readonly id: string;

  constructor(
    private attributeName: string = '',
    readonly valueType: ValueType = ValueTypeFactory.DEFAULT,
    readonly displayType: DisplayType = DisplayType.OPTIONAL,
    readonly isTemplateBased: boolean = false,
    readonly uniqueValues: boolean = false,
    readonly autosuggest: boolean = true,
    readonly helpText: string = '',
    readonly helpLink: string = '',
    readonly helpContextual?: DocItem,
    readonly dependency?: DependencyTypeTable | DependencyTypeSection
  ) {
    this.id = `attr_${nextId()}`;
  }

  get name(): string {
    return this.attributeName;
  }

  set name(name: string) {
    if (this.canEditName && this.attributeName !== name) {
      this.attributeName = name;
    }
  }

  get canEditName(): boolean {
    return !this.isTemplateBased;
  }
}
