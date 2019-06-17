import { SectionType, FieldType } from '../../templates';
import Field from './submission-field.model';
import { AttributeData } from './submission';

class Fields {
  private fields: Field[];

  constructor(type: SectionType, attributes: Array<AttributeData> = []) {
      this.fields = [];

      const attrMap = attributes.filter(at => String.isDefined(at.name))
          .reduce((rv, attr) => {
              rv[attr.name!] = attr.value;
              return rv;
          }, {});

      type.fieldTypes.forEach(fieldType => {
          this.add(fieldType, attrMap[fieldType.name] || '');
      });
  }

  list(): Field[] {
      return this.fields.slice();
  }

  get length(): number {
      return this.fields.length;
  }

  private add(type: FieldType, value?: string): void {
      const field = new Field(type, value);
      this.fields.push(field);
  }

  /**
   * Retrieves the field object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param {string} value - Value of the required field's property.
   * @param {string} [property = 'id'] - Property name by which fields are looked up.
   * @returns {Field} Field fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Field | undefined {
      return this.fields.find((field) => (field[property] === value));
  }
}

export default Fields;
