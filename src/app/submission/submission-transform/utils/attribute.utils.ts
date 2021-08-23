import { Field, Table } from 'app/submission/submission-shared/model';
import { AttributeNames, SectionNames } from './../../utils/constants';
import { isDefinedAndNotEmpty, isEqualIgnoringCase, isStringDefined, isValueEmpty } from '../../../utils/string.utils';
import { toTyped } from './link.utils';
import { ExtAttribute, ExtFile, ExtLink } from '../model/ext-submission-types';

interface AttrException {
  name: string;
  rootLevel: boolean;
  studyLevel: boolean;
  systemOnly: boolean;
  unique: boolean;
}

/* Here are the attributes which we have to deal with exceptionally (unfortunately):
 * AttachTo:     It's updated/created when submission attached to a project; it can have multiple values (multiple projects).
 *               It's not visible to the user and could be changed only by the system. Always stays at the root level.
 * ReleaseDate:  It's moved to the Study section attributes (of the model) to be visible/editable by the user and then
 *               moved back to the submission level attributes when submit. The attribute name is unique.
 * Title:        Can be the submission level or on study level attribute. It's copied to the submission level when study is
 *               submitted.
 */
export class AttrExceptions {
  private static allAttrs: Array<AttrException> = [
    { name: AttributeNames.ATTACH_TO, rootLevel: true, studyLevel: false, systemOnly: true, unique: false },
    { name: AttributeNames.RELEASE_DATE, rootLevel: true, studyLevel: false, systemOnly: false, unique: true },
    { name: AttributeNames.TITLE, rootLevel: true, studyLevel: true, systemOnly: false, unique: true },
    { name: 'AccNoPattern', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'AccNoTemplate', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: AttributeNames.FILE_LIST, rootLevel: true, studyLevel: false, systemOnly: false, unique: true }
  ];

  private static editableAttr: Array<string> = AttrExceptions.allAttrs
    .filter((at) => (at.rootLevel || at.studyLevel) && !at.systemOnly)
    .map((at) => at.name);

  private static editableAndRootOnlyAttr: Array<string> = AttrExceptions.allAttrs
    .filter((at) => at.rootLevel && !at.studyLevel && !at.systemOnly)
    .map((at) => at.name);

  private static uniqueAttr: Array<string> = AttrExceptions.allAttrs.filter((at) => at.unique).map((at) => at.name);

  static get editable(): string[] {
    return this.editableAttr;
  }

  static get editableAndRootOnly(): string[] {
    return this.editableAndRootOnlyAttr;
  }

  static get unique(): string[] {
    return this.uniqueAttr;
  }

  static get attachToAttr(): string {
    return 'AttachTo';
  }
}

export function mergeAttributes(attrs1: ExtAttribute[], attrs2: ExtAttribute[]): ExtAttribute[] {
  const merged: ExtAttribute[] = [];
  const visited: { [key: string]: number } = {};

  attrs1.concat(attrs2).forEach((at) => {
    if (isDefinedAndNotEmpty(at.name) && AttrExceptions.unique.includes(at.name!)) {
      if (visited[at.name!] === undefined) {
        visited[at.name!] = merged.length;
        merged.push(at);
      } else {
        merged[visited[at.name!]] = at;
      }
    } else {
      merged.push(at);
    }
  });

  return merged.filter((attr) => !isValueEmpty(attr.value));
}

export function findAttributeByName(name: string, attributes: ExtAttribute[]): ExtAttribute | undefined {
  return attributes.find((attr) => attr.name.toLowerCase() === name.toLowerCase());
}

export function filterAttributesByName(name: string, attributes: ExtAttribute[]): ExtAttribute[] {
  return attributes.filter((attribute) => attribute.name === name);
}

export function attributesAsFile(attributes: ExtAttribute[]): ExtFile {
  const isPathAttr = (at: ExtAttribute) => isStringDefined(at.name) && isEqualIgnoringCase(at.name!, SectionNames.FILE);
  const attr = attributes.find((at) => isPathAttr(at));
  const attrs = attributes.filter((at) => !isPathAttr(at) && !isValueEmpty(at.value));
  const path = (attr && attr.value) as string;

  return { fileName: path, path, attributes: attrs, extType: SectionNames.FILE, type: SectionNames.FILE };
}

export function attributesAsLink(attributes: ExtAttribute[]): ExtLink {
  return toTyped(attributes);
}

export function extractTableAttributes(table: Table, isSanitise: boolean): ExtAttribute[][] {
  const mappedTables: ExtAttribute[][] = table.rows.map((row) => {
    const attributes: ExtAttribute[] = table.columns.map((column) => {
      const rowValue = row.valueFor(column.id);

      return { name: column.name, value: rowValue && rowValue.value, reference: false } as ExtAttribute;
    });

    return attributes.filter((attr) => (isSanitise && !isValueEmpty(attr.value)) || !isSanitise);
  });

  return mappedTables.filter((mappedTable) => mappedTable.length > 0);
}

export function fieldAsAttribute(field: Field, displayType?: string): ExtAttribute {
  if (displayType) {
    return {
      name: field.name,
      reference: false,
      value: field.value,
      valueAttrs: [{ name: 'display', value: displayType }]
    } as ExtAttribute;
  }

  return { name: field.name, value: field.value, reference: false } as ExtAttribute;
}

export function fieldsAsAttributes(fields: Field[], isSanitise: boolean): ExtAttribute[] {
  const attributes: ExtAttribute[] = [];

  fields.forEach((field) => {
    if (field.valueType.isRich()) {
      const fieldValue: string = field.value || '';
      const [richValue] = fieldValue.split('@');

      attributes.push(fieldAsAttribute({ name: field.name, value: richValue } as Field, 'html'));
    } else if (Array.isArray(field.value)) {
      field.value.forEach((value) => {
        attributes.push(fieldAsAttribute({ name: field.name, value } as Field));
      });
    } else {
      attributes.push({ name: field.name, value: field.value, reference: false });
    }
  });

  return attributes.filter((attr) => (isSanitise && !isValueEmpty(attr.value)) || !isSanitise);
}
