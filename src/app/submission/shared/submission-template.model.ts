import {DefaultTemplate} from './default.template';

export class FieldType {
    readonly name: string;
    readonly valueType: string;
    readonly required: boolean;
    readonly minlength: number;
    readonly maxlength: number;

    constructor(name, obj: any = {}) {
        this.name = name;
        this.valueType = obj.valueType || 'textline';
        this.required = obj.required === true;
        this.minlength = obj.minlength || -1;
        this.maxlength = obj.maxlength || -1;
    }

    static createDefault(name: string): FieldType {
        return new FieldType(name);
    }
}

export class FeatureType {
    readonly name: string;
    readonly singleRow: boolean;
    readonly required: boolean;
    readonly title: string;
    readonly description: string;
    readonly columnTypes: ColumnType[];

    constructor(name: string, obj: any = {}) {
        this.name = name;
        this.singleRow = obj.singleRow === true;
        this.required = obj.required === true;
        this.title = obj.title || 'Add a ' + this.name.toLowerCase();
        this.description = obj.description || '';
        this.columnTypes = (obj.columnTypes || [])
            .map(c => new ColumnType(c));
    }

    getColumnTemplate(name: string): ColumnType {
        return this.columnTypes.find(c => c.name === name)
            || ColumnType.createDefault(name);
    }

    static createDefault(name: string, singleRow: boolean): FeatureType {
        return new FeatureType(name, {singleRow: singleRow});
    }
}

export class ColumnType {
    readonly name: string;
    readonly required: boolean;
    readonly valueType: string;

    constructor(name: string, obj: any = {}) {
        this.name = name;
        this.valueType = obj.valueType || 'textline';
        this.required = obj.required === true;
    }

    static createDefault(name: string): ColumnType {
        return new ColumnType(name);
    }
}

export class SectionType {
    readonly name: string;
    readonly required: boolean;
    readonly fieldTypes: FieldType[];
    readonly featureTypes: FeatureType[];
    readonly sectionTypes: SectionType[];

    constructor(name: string, obj: any = {}) {
        this.name = name;
        this.required = obj.required === true;
        this.fieldTypes = (obj.fieldTypes || [])
            .map(f => new FieldType(f.name, f));
        this.featureTypes = (obj.featureTypes || [])
            .map(f => new FeatureType(f.name, f));
        this.sectionTypes = (obj.sectionTypes || [])
            .map(s => new SectionType(s.name, s));
    }

    getFieldType(name: string): FieldType {
        return this.fieldTypes.find(f => f.name === name)
            || FieldType.createDefault(name);
    }

    getFeatureType(name: string, singleRow: boolean): FeatureType {
        return this.featureTypes.find(s => s.name === name && s.singleRow === singleRow)
            || FeatureType.createDefault(name, singleRow);
    }

    getSectionType(name: string): SectionType {
        return this.sectionTypes.find(s => s.name === name)
            || SectionType.createDefault(name);
    }

    sectionType(names: string[]) {
        if (names.length > 1) {
            const types = this.sectionTypes
                .map(s => s.sectionType(names.slice(1)))
                .filter(t => t !== undefined);
            if (types.length > 0) {
                return types[0];
            }
        } else if (names.length === 1 && names[0] === this.name) {
            return this;
        }
        return undefined;
    }

    static createDefault(name: string): SectionType {
        return new SectionType(name);
    }
}

export class SubmissionType {
    readonly sectionTypes: SectionType[];

    constructor(obj: any) {
        this.sectionTypes =
            (obj.sectionTypes || [])
                .map(s => new SectionType(s.name, s));
    }

    sectionType(names: string[]): SectionType {
        if (names.length > 0) {
            const types = this.sectionTypes
                .map(s => s.sectionType(names))
                .filter(t => t !== undefined);
            if (types.length > 0) {
                return types[0];
            }
        }
        return undefined;
    }

    static createDefault(): SubmissionType {
        return new SubmissionType(DefaultTemplate);
    }
}