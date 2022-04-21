import { PageTabSection, PtAttribute, Section, Table } from '../model';
import { contactsToSection, protocolsToSection } from './section.utils';
import { extractTableAttributes } from './attribute.utils';
import { isPtAttributeValueEmpty } from 'app/utils/validation.utils';

function rowsAsSections(tables, isSanitise): PageTabSection[] {
  let tableSections: PageTabSection[] = [];

  tables.forEach((table) => {
    const rowsSections = tableRowToSections<PageTabSection>(
      (attrs, currentTable) => [
        { type: currentTable?.typeName || '', attributes: attrs.filter((attr) => !isPtAttributeValueEmpty(attr.value)) }
      ],
      (currentSection) => currentSection!.attributes!.length > 0,
      isSanitise,
      table
    );

    tableSections = [...tableSections, ...rowsSections];
  });

  return tableSections;
}

export function tableToSectionItem(tables: Table[], isSanitise: boolean, isSubsection: boolean): PageTabSection[] {
  const tableSections: PageTabSection[] = rowsAsSections(tables, isSanitise);

  if (!isSubsection) {
    return contactsToSection(tableSections);
  }

  return tableSections;
}

export function tableToPtTable(tables: Table[], isSanitise): PageTabSection[][] {
  const tableSections: PageTabSection[] = rowsAsSections(tables, isSanitise);
  const sections = protocolsToSection(tableSections);

  const ptTablesMap = {};
  sections.forEach((section) => {
    if (section.type) {
      ptTablesMap[section.type] = [section, ...(ptTablesMap[section.type] ?? [])];
    }
  });

  return Object.keys(ptTablesMap).map((tableKey) => ptTablesMap[tableKey]);
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
    (result, attr) => [...result, ...formatter(attr, table)],
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
