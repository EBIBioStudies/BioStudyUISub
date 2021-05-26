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

export interface NameValueType {
  name: string;
  value: string;
}

export interface AttributeType {
  name: string;
  reference: boolean;
  nameAttrs?: NameValueType[];
  valueAttrs?: NameValueType[];
  value: string | string[];
}
