interface Array<T> {
  flatMap<U>(mapFunc: (x: T) => U[]): Array<U>;
  isEmpty(): boolean;
  uniqueValues(): Array<T>;
}

Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.uniqueValues = function (): any[] {
  return this.filter((x, i, a) => a.indexOf(x) === i);
};

Array.prototype.flatMap = function (mapFunc): any[] {
  return this.reduce((rv, next) => [...mapFunc(next), ...rv], []);
};
