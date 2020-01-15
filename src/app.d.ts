declare interface StringConstructor {
  isString(string: any): boolean;

  isDefined(s: string | undefined | null): boolean;

  isNotDefinedOrEmpty(s: string | undefined | null): boolean;

  isDefinedAndNotEmpty(s: string | undefined | null): boolean;
}

declare interface String {
  isEqualIgnoringCase(value: string): boolean;

  isEmpty(): boolean;
}

declare interface Array<T> {
  isEmpty(): boolean;

  uniqueValues(): Array<T>;

  flatMap<U>(mapFunc: (x: T) => U[]): Array<U>;
}

declare type Dictionary<T> = { [key: string]: T | undefined }

declare type Nullable<T> = T | null | undefined

declare interface FullPathFile extends File {
  webkitRelativePath: string;
}
