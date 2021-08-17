import { TaggedData, NameValueType } from './submission-common-types';

export interface ExtAttributeType {
  name: string;
  value?: string | string[];
  reference?: boolean;
  nameAttrs?: NameValueType[];
  valueAttrs?: NameValueType[];
}

export interface ExtLinkType {
  url: string;
  attributes: ExtAttributeType[];
  extType: string;
}

export interface ExtFileType {
  attributes: ExtAttributeType[];
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

export interface ExtSectionType {
  accNo?: string | null;
  attributes: ExtAttributeType[];
  fileList?: string;
  files?: ExtFileType[];
  links?: ExtLinkType[];
  sections?: ExtSectionType[];
  type: string;
  extType?: string;
}

export interface ExtSubmissionType extends TaggedData {
  accNo: string;
  collections?: ExtCollection[];
  attributes?: ExtAttributeType[];
  releaseTime: string;
  title: string;
  section: ExtSectionType;
}
