import { DisplayType, ValueType, ValueTypeFactory } from '../templates';
import { nextId } from './submission.model.counter';

export class Attribute {
  readonly id: string;

  constructor(
    private _name: string = '',
    readonly valueType: ValueType = ValueTypeFactory.DEFAULT,
    readonly displayType: DisplayType = DisplayType.OPTIONAL,
    readonly isTemplateBased: boolean = false,
    readonly dependencyColumn: string = '',
    readonly uniqueValues: boolean = false
  ) {
    this.id = `attr_${nextId()}`;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    if (this.canEditName && this._name !== name) {
      this._name = name;
    }
  }

  get canEditName(): boolean {
    return !this.isTemplateBased;
  }
}
