
export class NameAndValue {
    constructor(readonly name: string = '', readonly value: string = '') {
    }
}

export class Tag {
    constructor(readonly classifier: string = '', readonly  tag: string = '') {
    }

    get value(): string {
        return this.classifier.toLowerCase() + ':' + this.tag.toLowerCase();
    }

    equals(other:Tag): boolean {
        return this.value === other.value;
    }
}

export const PAGE_TAG = new Tag('SubmissionElement', 'page');