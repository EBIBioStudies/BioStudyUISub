interface Array<T> {
  flatMap<U>(mapFunc: (x: T) => U[]): Array<U>;
}

Array.prototype.flatMap = function (mapFunc) {
  return this.reduce((rv, next) => [...mapFunc(next), ...rv], []);
};
