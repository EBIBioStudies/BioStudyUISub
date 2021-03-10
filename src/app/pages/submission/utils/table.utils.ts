import { Table, Section } from '../submission-shared/model/submission';

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
