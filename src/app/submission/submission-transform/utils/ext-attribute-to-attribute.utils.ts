import {
  AttributeData,
  NameAndValue,
  SelectValueType,
  ValueType,
  ValueTypeName
} from 'app/submission/submission-shared/model';
import { ExtAttribute } from '../model/ext-submission-types';

export function extAttrToAttrData(attributes: ExtAttribute[], valueTypes: ValueType[]): AttributeData[] {
  return formatAttributes(attributes, valueTypes);
}

function formatAttributes(attrs: ExtAttribute[], valueTypes: ValueType[]): AttributeData[] {
  const attributesData: AttributeData[] = [];
  const selectValueType: ValueType[] = valueTypes.filter((valueType) => valueType.is(ValueTypeName.select));
  const multiValueAttributeNames: string[] = selectValueType
    .filter((valueType) => (valueType as SelectValueType).multiple)
    .map((valueType) => valueType.name.toString());

  const singleValueAttributes = attrs.filter((attr) => !multiValueAttributeNames.includes(attr.name || ''));

  multiValueAttributeNames.forEach((multiValueAttributeName) => {
    const multiValueAttributes = attrs.filter(
      (attr) => attr.name === multiValueAttributeName && attr.value !== undefined
    );

    if (multiValueAttributes.length > 0) {
      const firstAttribute = multiValueAttributes[0];
      const values = multiValueAttributes.map((attr) => attr.value) as string[];

      attributesData.push(toAttrData({ ...firstAttribute, value: values }));
    }
  });

  singleValueAttributes.forEach((attr) => {
    attributesData.push(toAttrData(attr));
  });

  return attributesData;
}

function toAttrData(attribute: ExtAttribute): AttributeData {
  return {
    name: attribute.name || '',
    reference: attribute.reference || false,
    valueAttrs: (attribute.valueAttrs || []).map((t) => new NameAndValue(t.name, t.value)),
    nameAttrs: (attribute.nameAttrs || []).map((t) => new NameAndValue(t.name, t.value)),
    value: attribute.value
  };
}
