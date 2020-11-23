/**
 * This is just a helper to have a consecutive set of numbers.
 * It's used to set ids, count elements and name columns.
 */
export class Counter {
  private static instance: Counter;
  private count = 0;

  private constructor() {}

  static getInstance(): Counter {
    if (Counter.instance === undefined) {
      Counter.instance = new Counter();
    }

    return Counter.instance;
  }

  get next(): number {
    return ++this.count;
  }
}

export const nextId = () => {
  const counter = Counter.getInstance();

  return `id${counter.next}`;
};
