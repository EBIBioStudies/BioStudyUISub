import { DisplayType, ValueType, ValueTypeFactory } from '../templates';
import { nextId } from './submission.model.counter';

export class Attribute {
  readonly id: string;

  constructor(
    private attributeName: string = '',
    readonly valueType: ValueType = ValueTypeFactory.DEFAULT,
    readonly displayType: DisplayType = DisplayType.OPTIONAL,
    readonly isTemplateBased: boolean = false,
    readonly dependencyColumn: string = '',
    readonly uniqueValues: boolean = false,
    readonly autosuggest: boolean = true
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
