import { PageTabSection, PtAttribute, Section, Table } from '../model';
import { contactsToSection, protocolsToSection } from './section.utils';

import { compose } from 'app/utils/function.utils';
import { extractTableAttributes } from './attribute.utils';
import { isValueEmpty } from 'app/utils/validation.utils';

function rowsAsSections(table, isSanitise): PageTabSection[] {
  return tableRowToSections<PageTabSection>(
    (attrs, currentTable) => [
      { type: currentTable?.typeName || '', attributes: attrs.filter((attr) => !isValueEmpty(attr.value)) }
    ],
    (currentSection) => currentSection!.attributes!.length > 0,
    isSanitise,
    table
  );
}

export function tableToSectionItem(tables: Table[], isSanitise: boolean, isSubsection: boolean): PageTabSection[] {
  let tableSections: PageTabSection[] = [];
  tables.forEach((table) => {
    tableSections = [...tableSections, ...rowsAsSections(table, isSanitise)];
  });

  if (isSubsection) {
    return protocolsToSection(tableSections);
  }

  return compose(contactsToSection, protocolsToSection)(tableSections);
}

export function tableToPtTable(tables: Table[], isSanitise): PageTabSection[][] {
  return tables.map((table) => rowsAsSections(table, isSanitise));
}

export function tableRowToSections<T>(
  formatter: (attr: PtAttribute[], table?: Table) => T[],
  validator: (attr: T) => boolean,
  isSanitise: boolean,
  table?: Table
): T[] {
  if (table === undefined) {
    return [];
  }

  const tableAttributes: PtAttribute[][] = extractTableAttributes(table, isSanitise);
  const fileAttributes: T[] = tableAttributes.reduce(
    (result, attr) => [...formatter(attr, table), ...result],
    [] as T[]
  );

  return fileAttributes.filter(validator);
}

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
