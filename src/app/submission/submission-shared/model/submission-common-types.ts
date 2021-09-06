export interface Dictionary<T> {
  [key: string]: T | undefined;
}

export type Nullable<T> = T | null | undefined;
