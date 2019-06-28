import {
  ValueType,
  DisplayType,
  ValueTypeFactory
} from '../../templates';
import { identifierGenerator } from '../utils/identifier-generator';

class Attribute {
  readonly id: string;

  constructor(private _name: string = '',
              readonly valueType: ValueType = ValueTypeFactory.DEFAULT,
              readonly displayType: DisplayType = DisplayType.Optional,
              readonly isTemplateBased: boolean = false) {
      this.id = `attr_${identifierGenerator()}`;
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

export default Attribute;
