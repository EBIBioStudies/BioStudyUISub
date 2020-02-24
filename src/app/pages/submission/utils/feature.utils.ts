import { Feature, Section, Sections } from '../submission-shared/model/submission';

export function flatFeatures(section: Section): Feature[] {
  let result = [...section.features.list()];

  section.sections.list().forEach((sectionItem) => {
    result = result.concat(sectionItem.features.list());

    if (sectionItem.sections.length > 0) {
      const nestedSections: Section[] = sectionItem.sections.list();

      nestedSections.forEach((nestedSection) => {
        result = result.concat(flatFeatures(nestedSection));
      });
    }
  });

  return result;
}
