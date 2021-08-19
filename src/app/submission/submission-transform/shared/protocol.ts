import { Dictionary } from 'app/submission/submission-shared/model/submission-common-types';
import { isNotDefinedOrEmpty } from 'app/utils';
import { ExtAttribute } from '../model/ext-submission-types';

export class Protocols {
  private static instance: Protocols;
  private refs: Dictionary<string> = {};

  private constructor() {}

  static getInstance(): Protocols {
    if (!Protocols.instance) {
      Protocols.instance = new Protocols();
    }

    return Protocols.instance;
  }

  getRefKeyByValue(value?: string): string {
    return Object.keys(this.refs).find((key) => this.refs[key] === value) || '';
  }

  getRefValueByKey(accno?: string): string {
    if (!accno) {
      return '';
    }

    return this.refs[accno] || '';
  }

  refFor(value: string, accno: string): string {
    this.refs[accno] = value;

    return accno;
  }

  toReference(attr: ExtAttribute): ExtAttribute {
    const attributeValue: string = attr.value as string;

    if (isNotDefinedOrEmpty(attributeValue) || attr.name !== 'Protocol') {
      return { name: attr.name, value: attr.value };
    }

    const refKeyForValue = this.getRefKeyByValue(attributeValue);
    return {
      name: 'Protocol',
      value: refKeyForValue,
      reference: true
    };
  }
}
