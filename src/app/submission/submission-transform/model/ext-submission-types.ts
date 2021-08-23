import { AccessTag } from 'app/submission/submission-shared/model/submission-common-types';
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
  filesUrl?: string;
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
  accessTags?: AccessTag[];
  attributes?: ExtAttribute[];
  collections?: ExtCollection[];
  creationTime?: string;
  method?: string;
  modificationTime?: string;
  owner?: string;
  relPath?: string;
  releaseTime?: string;
  released?: boolean;
  rootPath?: string | null;
  secretKey?: string;
  section: ExtSection;
  stats?: NameValue[];
  status?: 'PROCESSED' | 'PROCESSING' | 'REQUESTED';
  submitter?: string;
  tags?: NameValue[];
  title: string;
  version?: number;
}
