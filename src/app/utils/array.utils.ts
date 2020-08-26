export function flatArray<T>(array: T[]): T[] {
  return array
    .map((element) => Array.isArray(element) ? element : [element])
    .reduce((previousElement, currentElement) => [...previousElement, ...currentElement], [] as T[]);
}
