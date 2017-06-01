import * as dict from './default.template';

export class SubmissionTemplate {
    constructor(private dict: any) {
    }

    requiredAttributes(itemType) {
        let attrs = (this.dict[itemType] || {attributes: []}).attributes;
        return attrs.filter(a => a.required === true);
    }

    static createDefault(): SubmissionTemplate {
        return new SubmissionTemplate(dict);
    }
}