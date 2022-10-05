import { nextId } from './submission.model.counter';
import { AttributeValue } from './submission.model.attribute-value';
import { PtNameAndValue } from '../pagetab';

export class ValueMap {
  readonly id: string;
  private valueMap: Map<string, AttributeValue> = new Map();

  constructor(keys?: string[]) {
    this.id = nextId();
    (keys || []).forEach((key) => this.add(key));
  }

  add(key: string, value?: string, valqual?: PtNameAndValue[]): void {
    if (this.valueMap.has(key)) {
      return;
    }

    const v = new AttributeValue(value, valqual);
    this.valueMap.set(key, v);
  }

  keys(): string[] {
    return Array.from(this.valueMap.keys());
  }

  remove(key: string): void {
    if (!this.valueMap.has(key)) {
      return;
    }

    this.valueMap.delete(key);
  }

  update(key: string, value: string, valqual?: PtNameAndValue[]): void {
    if (!this.valueMap.has(key)) {
      return;
    }

    const attributeValue = new AttributeValue(value, valqual);
    this.valueMap.set(key, attributeValue);
  }

  valueFor(key: string): AttributeValue {
    return this.valueMap.get(key) || new AttributeValue('');
  }

  values(keys?: string[]): (AttributeValue | undefined)[] {
    return (keys || this.keys()).map((key) => this.valueMap.get(key));
  }
}
