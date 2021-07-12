import { Tag } from './submission-common-types';

export class NameAndValue {
  constructor(readonly name: string = '', readonly value: string = '') {}
}

export class SubmissionTag implements Tag {
  constructor(readonly name: string = '', readonly tag: string = '') {}

  get value(): string {
    return this.name.toLowerCase() + ':' + this.tag.toLowerCase();
  }

  equals(other: SubmissionTag): boolean {
    return this.value === other.value;
  }
}

export const PAGE_TAG = new SubmissionTag('SubmissionElement', 'page');
