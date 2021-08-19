export interface Dictionary<T> {
  [key: string]: T | undefined;
}

export type Nullable<T> = T | null | undefined;

export interface Tag {
  name: string;
  value: string;
}

export interface AccessTag {
  name: string;
}

export interface TaggedData {
  accessTags?: AccessTag[];
  tags?: Tag[];
}

export interface NameValue {
  name: string;
  value: string;
}

export interface Attribute {
  name: string;
  reference: boolean;
  nameAttrs?: NameValue[];
  valueAttrs?: NameValue[];
  value: string | string[];
}
