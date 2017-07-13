import {DefaultTemplate} from './default.template';

const defined = (val: string) => {
    return val !== undefined && val.length > 0;
};

class BaseType {
    constructor(private _name: string,
                private _canModify: boolean) {
        if (!defined(this._name)) {
            throw Error("Type name is undefined");
        }
    }

    get canModify() {
        return this._canModify;
    }

    get name(): string {
        return this._name;
    }

    set name(val: string) {
        if (this._canModify && defined(val)) {
            this._name = val;
        }
    }
}

/* Fields are always required. User can't add/change/delete fields. Only changing its value is allowed.
 * In PageTab it's a selected by name attribute from an 'attributes' section.
 */
export class FieldType extends BaseType {
    readonly valueType: string;
    readonly minlength: number;
    readonly maxlength: number;

    constructor(name, obj: any = {}) {
        super(name, false);
        this.valueType = obj.valueType || 'textline';
        this.minlength = obj.minlength || -1;
        this.maxlength = obj.maxlength || -1;
    }

    static createDefault(name: string): FieldType {
        return new FieldType(name);
    }
}

/* Feature contains similar defined PageTab section(s) without subsections or a list of attributes*/
export class FeatureType extends BaseType {
    readonly singleRow: boolean;
    readonly required: boolean;
    readonly title: string;
    readonly description: string;
    readonly columnTypes: ColumnType[];

    constructor(name: string, singleRow: boolean, other?: any) {
        super(name, other === undefined);
        this.singleRow  = singleRow;

        other = other || {};
        this.required = other.required === true;
        this.title = other.title || 'Add ' + this.name;
        this.description = other.description || '';
        this.columnTypes = (other.columnTypes || [])
            .map(c => new ColumnType(c));
    }

    getColumnTemplate(name: string): ColumnType {
        return this.columnTypes.find(c => c.name === name)
            || ColumnType.createDefault(name);
    }

    static createDefault(name: string, singleRow: boolean): FeatureType {
        return new FeatureType(name, singleRow);
    }
}

export class AnnotationsType extends FeatureType {
    constructor(name: string, other: any) {
        super(name, true, other);
    }
}

export class ColumnType extends BaseType {
    readonly required: boolean;
    readonly valueType: string;

    constructor(name: string, other?: any) {
        super(name, other === undefined);

        other = other || {};
        this.valueType = other.valueType || 'textline';
        this.required = other.required === true;
    }

    static createDefault(name: string): ColumnType {
        return new ColumnType(name);
    }
}

export class SectionType extends BaseType {
    readonly required: boolean;
    readonly fieldTypes: FieldType[];
    readonly featureTypes: FeatureType[];
    readonly sectionTypes: SectionType[];

    constructor(name: string, other?: any) {
        super(name, other === undefined);

        other = other || {};
        this.required = other.required === true;
        this.fieldTypes = (other.fieldTypes || [])
            .map(f => new FieldType(f.name, f));
        this.featureTypes = (other.featureTypes || [])
            .map(f => new FeatureType(f.name, f));
        this.sectionTypes = (other.sectionTypes || [])
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