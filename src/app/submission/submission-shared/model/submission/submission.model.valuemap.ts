import { nextId } from './submission.model.counter';
import { AttributeValue } from './submission.model.attribute-value';

export class ValueMap {
  private valueMap: Map<string, AttributeValue> = new Map();
  readonly id: string;

  constructor(keys?: string[]) {
    this.id = nextId();
    (keys || []).forEach(key => this.add(key));
  }

  valueFor(key: string): AttributeValue | undefined {
    return this.valueMap.get(key);
  }

  add(key: string, value?: string): void {
    if (this.valueMap.has(key)) {
      console.warn(`adding multiple values for a key:${key}`);
      return;
    }
    const v = new AttributeValue(value);
    this.valueMap.set(key, v);
  }

  remove(key: string): void {
    if (!this.valueMap.has(key)) {
      console.warn(`remove: the key '${key}' does not exist in the map`);
      return;
    }
    this.valueMap.delete(key);
  }

  values(keys?: string[]): AttributeValue[] {
    return (keys || this.keys()).map(key => this.valueMap.get(key)!);
  }

  keys(): string[] {
    return Array.from(this.valueMap.keys());
  }
}
