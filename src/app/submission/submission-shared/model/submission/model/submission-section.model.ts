import { SectionType, FeatureType } from '../../templates';
import { Section, SectionData } from './submission';
import Feature from './submission-feature.model';
import Features from './submission-features.model';
import Fields from './submission-fields.model';
import Tags from './submission-tags.model';

class Counter {
  private count = 0;

  get next(): number {
      return ++this.count;
  }
}

const nextId = (function () {
  const counter = new Counter();

  return function () {
      return `id${counter.next}`;
  };
})();

class SubmissionSection implements Section {
  readonly id: string;
  readonly type: SectionType;
  readonly annotations: Feature;
  readonly fields: Fields;
  readonly features: Features;
  readonly sections: SubmissionSection[] = [];
  readonly subsections: SubmissionSection[] = [];
  readonly tags: Tags;
  readonly data: SectionData;
  private _accno: string;
  private nextIdx: number = 0;

  constructor(type: SectionType, data: SectionData = <SectionData>{}, accno: string = '') {
      this.tags = Tags.create(data);
      this.id = `section_${nextId()}`;
      this.type = type;
      this._accno = data.accno || accno;
      this.fields = new Fields(type, data.attributes);
      // Any attribute names from the server that do not match top-level field names are added as annotations.
      this.annotations = Feature.create(
          type.annotationsType,
          (data.attributes || []).filter((attribute) => (
              (attribute).name &&
              type.getFieldType(attribute.name || '') === undefined &&
              type.getFeatureType(attribute.name || '') === undefined
          ))
      );
      this.data = data;
      this.features = new Features(type, data.features);

      // Create sections.
      this.sections = this.createSectionsFromSectionData(type, data.sections);

      // Create subsections.
      this.subsections = this.createSectionsFromSectionData(type, data.subsections);
  }

  get accno(): string {
      return this._accno;
  }

  set accno(accno: string) {
      this._accno = accno;
  }

  get typeName(): string {
      return this.type.name;
  }

  set typeName(name: string) {
      this.type.name = name;
  }

  isRequired(): boolean {
      return this.type.displayType.isRequired;
  }

  sectionPath(id: string): SubmissionSection[] {
      if (id === this.id) {
          return [this];
      }
      const path = this.sections
          .map(s => s.sectionPath(id))
          .filter(p => p.length > 0);

      return (path.length > 0) ? ([] as SubmissionSection[]).concat([this], path[0]) : [];
  }

  createSection(sectionType: SectionType, sectionData?: SectionData, accno?: string): SubmissionSection {
    const newSection = new SubmissionSection(
      sectionType,
      sectionData,
      accno || `${sectionType.name}-${this.nextIdx++}`
    );

    return newSection;
  }

  addSection(sectionType: SectionType, sectionData?: SectionData, accno?: string): SubmissionSection {
    const newSection = this.createSection(sectionType, sectionData, accno);
    this.sections.push(newSection);

    return newSection;
  }

  addSubSection(sectionType: SectionType, sectionData?: SectionData, accno?: string): SubmissionSection {
    const newSection = this.createSection(sectionType, sectionData, accno);
    this.subsections.push(newSection);

    return newSection;
  }

  createSectionsFromSectionData(type: SectionType, sectionsData: Array<SectionData> = []) {
    const sections: SubmissionSection[] = [];

    type.sectionTypes.forEach((sectionType) => {
      const sectionData = sectionsData.filter((section) => (section.type === sectionType.name));

      sectionData.forEach((sectionDataItem) => sections.push(this.createSection(type, sectionDataItem)));

      if (sectionType.displayType.isShownByDefault && sectionData.length < sectionType.minRequired) {
          Array(sectionType.minRequired - sectionData.length)
            .fill(0)
            .forEach(() => sections.push(this.createSection(sectionType, {})));
      }
    });

    const definedTypes = type.sectionTypes.map((sectionType) => sectionType.name);

    sectionsData
      .filter((sectionDataItem) => (
        sectionDataItem.type === undefined || !definedTypes.includes(sectionDataItem.type)
      ))
      .forEach((sectionData) => {
          const accno = sectionData.accno;
          const sectionType = type.getSectionType(sectionData.type || 'UnknownSectionType');

          sections.push(this.createSection(sectionType, sectionData, accno));
      });

    return sections;
  }

  removeSectionById(sectionId: string) {
    const section = this.sections.find((sectionItem) => (sectionItem.id === sectionId));

    return section !== undefined ? this.removeSection(section) : false;
  }

  getSectionsByType(typeName: string): SubmissionSection[] {
    return this.sections.filter((section) => (section.type.name === typeName));
  }

  private removeSection(section: SubmissionSection): boolean {
      const sections = this.sections;
      const index = sections.indexOf(section);

      if (index >= 0) {
          sections.splice(index, 1);
          return true;
      }

      return false;
  }
}

export default SubmissionSection;
