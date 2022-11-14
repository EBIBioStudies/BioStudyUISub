import { Tag } from '../model.common';

interface AttrException {
  name: string;
  rootLevel: boolean;
  studyLevel: boolean;
  systemOnly: boolean;
  unique: boolean;
}

/* Here are the attributes which we have to deal with exceptionally (unfortunately):
 * AttachTo:     It's updated/created when submission attached to a project; it can have multiple values (multiple projects).
 *               It's not visible to the user and could be changed only by the system. Always stays at the root level.
 * ReleaseDate:  It's moved to the Study section attributes (of the model) to be visible/editable by the user and then
 *               moved back to the submission level attributes when submit. The attribute name is unique.
 * Title:        Can be the submission level or on study level attribute. It's copied to the submission level when study is
 *               submitted.
 */
export class AttrExceptions {
  private static allAttrs: Array<AttrException> = [
    { name: 'AttachTo', rootLevel: true, studyLevel: false, systemOnly: true, unique: false },
    { name: 'ReleaseDate', rootLevel: true, studyLevel: false, systemOnly: false, unique: true },
    { name: 'AccNoPattern', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'AccNoTemplate', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'Template', rootLevel: true, studyLevel: false, systemOnly: true, unique: true },
    { name: 'Title', rootLevel: true, studyLevel: true, systemOnly: false, unique: false }
  ];

  private static editableAttr: Array<string> = AttrExceptions.allAttrs
    .filter((at) => (at.rootLevel || at.studyLevel) && !at.systemOnly)
    .map((at) => at.name);

  private static editableAndRootOnlyAttr: Array<string> = AttrExceptions.allAttrs
    .filter((at) => at.rootLevel && !at.studyLevel && !at.systemOnly)
    .map((at) => at.name);

  private static uniqueAttr: Array<string> = AttrExceptions.allAttrs.filter((at) => at.unique).map((at) => at.name);

  static get editable(): string[] {
    return this.editableAttr;
  }

  static get editableAndRootOnly(): string[] {
    return this.editableAndRootOnlyAttr;
  }

  static get unique(): string[] {
    return this.uniqueAttr;
  }
}

export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export interface PtTag {
  classifier?: string;
  tag?: string;
}

export interface PtNameAndValue {
  name?: string;
  value?: string;
}

export interface PtAttribute {
  accno?: string;
  isReference?: boolean;
  name?: string;
  reference?: boolean;
  valqual?: PtNameAndValue[];
  value?: string | string[] | PtNameAndValue | PtNameAndValue[];
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
  links?: PtLink[];
  subsections?: PageTabSection[];
  tags?: PtTag[];
  type?: string;
}

export interface PageTab {
  accessTags?: string[];
  accno?: string;
  attributes?: PtAttribute[];
  section?: PageTabSection;
  tags?: Tag[];
  type?: string;
}

export interface DraftPayload {
  content: PageTab;
  key: string;
}

export class PageTabSubmission implements PageTab {
  accessTags?: string[];
  accno?: string;
  attributes?: PtAttribute[];
  section?: PageTabSection;
  tags?: Tag[];
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
