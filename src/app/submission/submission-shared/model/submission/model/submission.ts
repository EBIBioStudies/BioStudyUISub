import { SectionType } from '../../templates';
import { NameAndValue, Tag } from '../../model.common';

export interface Section {
  id: string,
  sections: Section[],
  subsections: Section[],
  type: SectionType,
  removeSectionById(sectionId: string): boolean,
  sectionPath(id: string): Section[]
}

export interface AttributeData {
  name?: string;
  value?: string;
  reference?: boolean;
  terms?: NameAndValue[];
}

export interface FeatureData {
  type?: string;
  entries?: AttributeData[][];
}

export interface TaggedData {
  tags?: Tag[];
  accessTags?: string[];
}

export interface SectionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  features?: FeatureData[];
  sections?: SectionData[];
  subsections?: SectionData[];
  type?: string;
}

export interface SubmissionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  isRevised?: boolean;
  section?: SectionData;
}
