import { NameValue, TaggedData } from 'app/submission/submission-shared/model/submission-common-types';

export interface ExtAttribute {
  name: string;
  value?: string | string[];
  reference?: boolean;
  nameAttrs?: NameValue[];
  valueAttrs?: NameValue[];
}

export interface ExtLink {
  url: string;
  attributes: ExtAttribute[];
  extType: string;
}

export interface ExtFileList {
  fileName: string | null;
  files?: ExtFile[];
}

export interface ExtFile {
  attributes: ExtAttribute[];
  file?: string;
  fileName: string;
  path: string;
  extType: string;
  type: string;
  size?: number;
}

export interface ExtCollection {
  accNo: string;
}

export interface ExtSection {
  accNo?: string | null;
  attributes: ExtAttribute[];
  fileList?: ExtFileList | null;
  files?: ExtFile[];
  links?: ExtLink[];
  sections?: ExtSection[];
  type: string;
  extType?: string;
}

export interface ExtSubmission extends TaggedData {
  accNo: string;
  collections?: ExtCollection[];
  attributes?: ExtAttribute[];
  releaseTime: string;
  title: string;
  section: ExtSection;
}
