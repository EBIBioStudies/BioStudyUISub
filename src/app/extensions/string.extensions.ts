interface String {
  isEmpty(): boolean;
  isEqualIgnoringCase(value: string): boolean;
}

interface StringConstructor {
  isDefined(s: string | undefined | null): boolean;
  isDefinedAndNotEmpty(s: string | undefined | null): boolean;
  isNotDefinedOrEmpty(s: string | undefined | null): boolean;
  isString(value: any): boolean;
}

String.prototype.isEqualIgnoringCase = function (value: string): boolean {
  return this.toLowerCase() === value.toLowerCase();
};

String.prototype.isEmpty = function (): boolean {
  return this.trim().length === 0;
};

// tslint:disable-next-line: only-arrow-functions
String.isString = function (s: any): boolean {
  return typeof s === 'string';
};

// tslint:disable-next-line: only-arrow-functions
String.isDefined = function (s: string | undefined | null): boolean {
  return String.isString(s) && s !== undefined && s !== null;
};

// tslint:disable-next-line: only-arrow-functions
String.isNotDefinedOrEmpty = function (s: string | undefined | null): boolean {
  return !String.isDefinedAndNotEmpty(s);
};

// tslint:disable-next-line: only-arrow-functions
String.isDefinedAndNotEmpty = function (s: string | undefined | null): boolean {
  return String.isString(s) && s !== undefined && s !== null && !s.isEmpty();
};
