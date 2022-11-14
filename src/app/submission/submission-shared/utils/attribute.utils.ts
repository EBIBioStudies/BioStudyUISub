import { PtFile, PtLink } from './../model/pagetab/pagetab.model';
import { isArrayEmpty, isPtAttributeValueEmpty } from 'app/utils/validation.utils';
import { Table, Field, PtAttribute } from 'app/submission/submission-shared/model';
import { isEqualIgnoringCase, isStringDefined } from 'app/utils/validation.utils';
import { SectionNames } from 'app/submission/utils/constants';
import { toTyped } from './link.utils';

export function isAttributeEmpty(attribute: PtAttribute): boolean {
  if (Array.isArray(attribute.value)) {
    return attribute.value.length === 0;
  }

  return isPtAttributeValueEmpty(attribute.value);
}

export function extractTableAttributes(table: Table, isSanitise: boolean): PtAttribute[][] {
  const mappedTables: PtAttribute[][] = table.rows.map((row) => {
    const attributes: PtAttribute[] = table.columns.map((column) => {
      const rowValue = row.valueFor(column.id);
      const ptAttribute = {
        name: column.name,
        value: rowValue && rowValue.value
      } as PtAttribute;
      if (!isArrayEmpty(rowValue.valqual || [])) {
        ptAttribute.valqual = rowValue.valqual!.slice();
      }

      return ptAttribute;
    });

    return attributes.filter((attr) => (isSanitise && !isPtAttributeValueEmpty(attr.value)) || !isSanitise);
  });

  return mappedTables.filter((mappedTable) => mappedTable.length > 0);
}

export function fieldAsAttribute(field: Field, displayType?: string): PtAttribute {
  if (displayType) {
    const ptAttribute = {
      name: field.name,
      reference: false,
      value: field.value,
      valueAttrs: [{ name: 'display', value: displayType }]
    } as PtAttribute;
    if (field?.valqual.length) {
      ptAttribute.valqual = field.valqual;
    }
    return ptAttribute;
  }

  return { name: field.name, value: field.value } as PtAttribute;
}

export function fieldsAsAttributes(fields: Field[], isSanitise: boolean): PtAttribute[] {
  const attributes: PtAttribute[] = [];

  fields.forEach((field) => {
    if (field.valueType.isRich()) {
      const fieldValue: string = String(field.value) || ''; // rich multivalued not allowed (yet)
      const [richValue] = fieldValue.split('@');

      attributes.push(
        fieldAsAttribute({ name: field.name, value: richValue, valqual: field?.valqual } as Field, 'html')
      );
    } else if (Array.isArray(field.value)) {
      field.value.forEach((value) => {
        attributes.push(fieldAsAttribute({ name: field.name, value, valqual: field?.valqual } as Field));
      });
    } else {
      const attr = { name: field.name, value: field.value, valqual: field?.valqual };
      if (!attr.valqual?.length) delete attr.valqual;
      attributes.push(attr);
    }
  });

  return attributes.filter((attr) => (isSanitise && !isPtAttributeValueEmpty(attr.value)) || !isSanitise);
}

export function attributesAsFile(attributes: PtAttribute[]): PtFile {
  const isPathAttr = (at: PtAttribute) => isStringDefined(at.name) && isEqualIgnoringCase(at.name!, SectionNames.FILE);
  const attr = attributes.find((at) => isPathAttr(at));
  const attrs = attributes.filter((at) => !isPathAttr(at) && !isPtAttributeValueEmpty(at.value));
  const path = (attr && attr.value) as string;

  return { path, attributes: attrs };
}

export function attributesAsLink(attributes: PtAttribute[]): PtLink {
  return toTyped(attributes);
}
