import { FieldType, ValueType } from '../../templates';
import { identifierGenerator } from '../utils/identifier-generator';

class Field {
  readonly id: string;
  readonly type: FieldType;

  private _value: string;

  constructor(type: FieldType,
              value: string = '') {
      this.id = `field_${identifierGenerator()}`;
      this.type = type;
      this._value = value;
  }

  get name(): string {
      return this.type.name;
  }

  get valueType(): ValueType {
      return this.type.valueType;
  }

  get readonly(): boolean {
      return this.type.displayType.isReadonly;
  }

  get value(): string {
      return this._value;
  }

  set value(v: string) {
      if (this._value !== v) {
          this._value = v;
      }
  }
}

export default Field;
