import { SectionNames } from './../../utils/constants';
import { isDefinedAndNotEmpty, isEqualIgnoringCase, isStringDefined, isValueEmpty } from '../../../utils/string.utils';
import { ExtAttributeType, ExtFileType, ExtLinkType } from '../model/ext-submission-types';
import { Field, Table } from '../model/submission/submission.model';
import { toTyped } from './link.utils';

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
    { name: 'AttachTo', rootLevel: true, studyLevel: false, systemOnly: true, unique: false },
    { name: 'ReleaseDate', rootLevel: true, studyLevel: false, systemOnly: false, unique: true },
    { name: 'Title', rootLevel: true, studyLevel: true, systemOnly: false, unique: true },
    { name: 'AccNoPattern', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'AccNoTemplate', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'File List', rootLevel: true, studyLevel: false, systemOnly: false, unique: true }
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

export function mergeAttributes(attrs1: ExtAttributeType[], attrs2: ExtAttributeType[]): ExtAttributeType[] {
  const merged: ExtAttributeType[] = [];
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

export function findAttributeByName(name: string, attributes: ExtAttributeType[]): ExtAttributeType | undefined {
  return attributes.find((attr) => attr.name.toLowerCase() === name.toLowerCase());
}

export function filterAttributesByName(name: string, attributes: ExtAttributeType[]): ExtAttributeType[] {
  return attributes.filter((attribute) => attribute.name === name);
}

export function attributesAsFile(attributes: ExtAttributeType[]): ExtFileType {
  const isPathAttr = (at: ExtAttributeType) =>
    isStringDefined(at.name) && isEqualIgnoringCase(at.name!, SectionNames.FILE);
  const attr = attributes.find((at) => isPathAttr(at));
  const attrs = attributes.filter((at) => !isPathAttr(at) && !isValueEmpty(at.value));
  const path = (attr && attr.value) as string;

  return { fileName: path, path, attributes: attrs, extType: SectionNames.FILE, type: SectionNames.FILE };
}

export function attributesAsLink(attributes: ExtAttributeType[]): ExtLinkType {
  return toTyped(attributes);
}

export function extractTableAttributes(table: Table, isSanitise: boolean): ExtAttributeType[][] {
  const mappedTables: ExtAttributeType[][] = table.rows.map((row) => {
    const attributes: ExtAttributeType[] = table.columns.map((column) => {
      const rowValue = row.valueFor(column.id);

      return { name: column.name, value: rowValue && rowValue.value } as ExtAttributeType;
    });

    return attributes.filter((attr) => (isSanitise && !isValueEmpty(attr.value)) || !isSanitise);
  });

  return mappedTables.filter((mappedTable) => mappedTable.length > 0);
}

export function fieldAsAttribute(field: Field, displayType?: string): ExtAttributeType {
  if (displayType) {
    return {
      name: field.name,
      value: field.value,
      valueAttrs: [{ name: 'display', value: displayType }]
    } as ExtAttributeType;
  }

  return { name: field.name, value: field.value } as ExtAttributeType;
}

export function fieldsAsAttributes(fields: Field[], isSanitise: boolean): ExtAttributeType[] {
  const attributes: ExtAttributeType[] = [];

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
