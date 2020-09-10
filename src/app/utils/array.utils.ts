export function flatArray<T>(array: T[]): T[] {
  return array
    .map((element) => Array.isArray(element) ? element : [element])
    .reduce((previousElement, currentElement) => [...previousElement, ...currentElement], <T[]>[]);
}

export function isArrayEmpty(array: any[]): boolean {
  return array.length === 0;
}

export function arrayUniqueValues(array: any[]): Array<any> {
  return array.filter((x, i, a) => a.indexOf(x) === i);
}
