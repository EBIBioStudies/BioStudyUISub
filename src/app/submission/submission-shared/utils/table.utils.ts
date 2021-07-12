import { ExtAttributeType } from './../model/ext-submission-types';
import { Section, Table } from './../model/submission/submission.model';
import { extractTableAttributes } from './attribute.utils';

export function flatTables(section: Section): Table[] {
  let result = [...section.tables.list()];

  section.sections.list().forEach((sectionItem) => {
    result = result.concat(sectionItem.tables.list());

    if (sectionItem.sections.length > 0) {
      const nestedSections: Section[] = sectionItem.sections.list();

      nestedSections.forEach((nestedSection) => {
        result = result.concat(flatTables(nestedSection));
      });
    }
  });

  return result;
}

export function tableToSections<T>(
  formatter: (attr: ExtAttributeType[], table?: Table) => T[],
  validator: (attr: T) => boolean,
  isSanitise: boolean,
  table?: Table
): T[] {
  if (table === undefined) {
    return [];
  }

  const tableAttributes: ExtAttributeType[][] = extractTableAttributes(table, isSanitise);
  const fileAttributes: T[] = tableAttributes.reduce(
    (result, attr) => [...formatter(attr, table), ...result],
    [] as T[]
  );

  return fileAttributes.filter(validator);
}
