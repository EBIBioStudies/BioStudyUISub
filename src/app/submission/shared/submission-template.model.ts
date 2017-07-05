import {DefaultTemplate} from './default.template';

import {
    Submission,
    Feature,
    Field,
    Attribute
} from './submission.model';

export class FieldTemplate {
    readonly name: string;
    readonly type: string;
    readonly required: boolean;
    readonly minlength: number;
    readonly maxlength: number;

    constructor(name: string,
                type: string = 'text',
                required: boolean = false,
                other: any = {}) {
        this.name = name;
        this.type = type;
        this.required = required;
        this.minlength = other.minlength || -1;
        this.maxlength = other.maxlength || -1;
    }

    static createDefault(name: string): FieldTemplate {
        return new FieldTemplate(name);
    }

    static create(obj: any): FieldTemplate {
        if (obj.name === undefined) {
            throw new Error("Fields's name is not provided");
        }
        return new FieldTemplate(obj.name, obj.type, obj.required === true, obj);
    }
}

export class FeatureTemplate {
    readonly type: string;
    readonly singleRow: boolean;
    readonly required: boolean;
    readonly title: string;
    readonly description: string;
    readonly columns: ColumnTemplate[];

    constructor(type: string, singleRow: boolean, required: boolean = false, other: any = {}) {
        this.type = type;
        this.singleRow = singleRow;
        this.required = required;
        this.title = other.title || 'Add a ' + this.type.toLowerCase();
        this.description = other.description;
        this.columns = (other.columns || [])
            .map(c => ColumnTemplate.create(c));
    }

    getColumnTemplate(column: Attribute): ColumnTemplate {
        return this.columns.find(c => c.name === column.name);
    }

    static create(obj: any) {
        if (obj.type === undefined) {
            throw new Error("Features's type is undefined");
        }
        return new FeatureTemplate(obj.type, obj.singleRow === true, obj.required === true, obj);
    }

    static createDefault(type: string, singleRow: boolean): FeatureTemplate {
        return new FeatureTemplate(type, singleRow);
    }
}

export class ColumnTemplate {
    readonly name: string;
    readonly required: boolean;
    readonly type: string;

    constructor(name: string, type: string = 'text', required: boolean = false) {
        this.name = name;
        this.type = type;
        this.required = required;
    }

    static createDefault(name: string): ColumnTemplate {
        return new ColumnTemplate(name);
    }

    static create(obj: any): ColumnTemplate {
        if (obj.name === undefined) {
            throw new Error("Columns's name is undefined");
        }
        return new ColumnTemplate(obj.name, obj.type, obj.required === true)
    }
}

export class SectionTemplate {
    readonly type: string;
    readonly required: boolean;
    readonly fields: FieldTemplate[];
    readonly features: FeatureTemplate[];
    readonly sections: SectionTemplate[];

    constructor(type: string, required: boolean = false, other: any = {}) {
        this.type = type;
        this.required = required;
        this.fields = (other.fields || [])
            .map(f => FieldTemplate.create(f));
        this.features = (other.features || [])
            .map(f => FeatureTemplate.create(f));
        this.sections = (other.sections || [])
            .map(s => SectionTemplate.create(s));
    }

    getFieldTemplate(field: Field): FieldTemplate {
        return  this.fields.find(f => f.name === field.name);
    }

    getFeatureTemplate(feature: Feature): FeatureTemplate {
        return this.features.find(s => s.type === feature.name);
    }

    getSectionTemplate(types: string[]): SectionTemplate {
        if (types.length == 0) {
            return this;
        }
        const sec = this.sections.find(s => s.type === types[0]);
        if (sec != undefined) {
            return sec.getSectionTemplate(types.slice(1));
        }
        return undefined;
    }

    static createDefault(type: string): SectionTemplate {
        return new SectionTemplate(type);
    }

    static create(obj: any): SectionTemplate {
        if (obj.type === undefined) {
            throw new Error("Section's type is not provided");
        }
        return new SectionTemplate(obj.type, obj.required === true, obj);
    }
}

export class SubmissionTemplate {
    readonly sections: SectionTemplate[];

    constructor(obj: any) {
        this.sections =
            (obj.sections || [])
                .map(s => SectionTemplate.create(s));
    }

    getSectionTemplate(types: string[]): SectionTemplate {
        let sec = this.sections.find(s => s.type === types[0]);
        if (sec !== undefined) {
            return sec.getSectionTemplate(types.slice(1));
        }
        return undefined;
    }

    static createDefault(): SubmissionTemplate {
        return new SubmissionTemplate(DefaultTemplate);
    }
}