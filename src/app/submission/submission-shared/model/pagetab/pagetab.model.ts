import { ExtAttributeType } from 'app/submission/submission-shared/model/ext-submission-types';
import { SubmissionTag } from '../model.common';
import { NameValueType } from '../submission-common-types';

export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export interface PtTag {
  classifier?: string;
  tag?: string;
}

export interface PtAttribute {
  accno?: string;
  isReference?: boolean;
  name?: string;
  reference?: boolean;
  valqual?: NameValueType[];
  value?: string | string[];
}

export interface PtLink {
  attributes?: PtAttribute[];
  url?: string;
}

export interface PtFile {
  attributes?: PtAttribute[];
  path?: string;
}

export interface PageTabSection {
  accessTags?: string[];
  accno?: string;
  attributes?: PtAttribute[];
  files?: PtFile[];
  libraryFile?: string;
  links?: PtLink[];
  subsections?: PageTabSection[];
  tags?: PtTag[];
  type?: string;
}

export interface PageTab {
  accessTags?: string[];
  accno?: string;
  attributes?: ExtAttributeType[];
  section?: PageTabSection;
  tags?: SubmissionTag[];
  type?: string;
}

export class PageTabSubmission implements PageTab {
  accessTags?: string[];
  accno?: string;
  attributes?: ExtAttributeType[];
  section?: PageTabSection;
  tags?: SubmissionTag[];
  type?: string;

  constructor(pageTab: PageTab) {
    this.accessTags = pageTab.accessTags || [];
    this.accno = pageTab.accno;
    this.attributes = pageTab.attributes || [];
    this.section = pageTab.section;
    this.tags = pageTab.tags || [];
    this.type = pageTab.type;
  }

  findAttributeByName(name: string): PtAttribute | undefined {
    return this.attributes?.find((attr) => attr.name?.toLowerCase() === name);
  }
}
