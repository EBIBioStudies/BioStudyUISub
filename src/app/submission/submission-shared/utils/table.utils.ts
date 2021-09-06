import { compose } from 'app/utils/function.utils';
import { isValueEmpty } from 'app/utils/validation.utils';
import { PageTabSection, PtAttribute, Section, Table } from '../model';
import { extractTableAttributes } from './attribute.utils';
import { contactsToSection, protocolsToSection } from './section.utils';

export function tableSectionsToSections(tables: Table[], isSanitise: boolean, isSubsection: boolean): PageTabSection[] {
  let tableSections: PageTabSection[] = [];
  tables.forEach((table) => {
    tableSections = [
      ...tableSections,
      ...tableToSections<PageTabSection>(
        (attrs, currentTable) => [
          { type: currentTable?.typeName || '', attributes: attrs.filter((attr) => !isValueEmpty(attr.value)) }
        ],
        (currentSection) => currentSection!.attributes!.length > 0,
        isSanitise,
        table
      )
    ];
  });

  if (isSubsection) {
    return protocolsToSection(tableSections);
  }

  return compose(contactsToSection, protocolsToSection)(tableSections);
}

export function tableToSections<T>(
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
