import { Feature, Section } from '../submission-shared/model/submission';

export function flatFeatures(section: Section): Feature[] {
  let result = [...section.features.list()];

  section.sections.list().forEach((sectionItem) => {
    result = result.concat(sectionItem.features.list());

    if (sectionItem.sections.length > 0) {
      result = result.concat(this.flatFeatures(sectionItem.sections));
    }
  });

  return result;
}
