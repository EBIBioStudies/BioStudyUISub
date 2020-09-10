interface String {
  isDefined(s: string | undefined | null): boolean;
  isEmpty(): boolean;
  isEqualIgnoringCase(value: string): boolean;
}

interface StringConstructor {
  isDefined(s: string | undefined | null): boolean;
  isEmpty(): boolean;
  isEqualIgnoringCase(): boolean;
  isString(value: any): boolean;
}

String.prototype.isEqualIgnoringCase = function (value: string) {
  return this.toLowerCase() === value.toLowerCase();
};

String.prototype.isEmpty = function () {
  return this.trim().length === 0;
};

String.isString = function (s: any) {
  return typeof s === 'string';
};

String.isDefined = function (s: string | undefined | null) {
  return String.isString(s) && s !== undefined && s !== null;
};
