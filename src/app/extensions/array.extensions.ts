interface Array<T> {
    isEmpty(): boolean;

    uniqueValues(): Array<T>;

    flatMap<U>(mapFunc: (x: T) => U[]): Array<U>;
}

Array.prototype.isEmpty = function () {
    return this.length === 0;
};

Array.prototype.uniqueValues = function () {
    return this.filter((x, i, a) => a.indexOf(x) == i);
};

Array.prototype.flatMap = function (mapFunc) {
    return this.reduce((rv, next) => [...mapFunc(next), ...rv], []);
};