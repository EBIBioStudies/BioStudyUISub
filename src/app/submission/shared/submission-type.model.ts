import {DefaultTemplate} from './default.template';

const defined = (val: string) => {
    return val !== undefined && val.length > 0;
};

const GlobalScope: Map<string, any> = new Map();

class BaseType {
    private scope: Map<string, any>;
    private typeName: string;

    readonly tmplBased: boolean;

    constructor(name: string,
                tmplBased: boolean,
                scope: Map<string, any> = GlobalScope) {
        if (!defined(name)) {
            throw Error(`Type name is undefined ${name}`);
        }
        if (scope.has(name)) {
            throw Error(`Type with name ${name} already exists in the scope`);
        }
        scope.set(name, this);
        this.typeName = name;
        this.tmplBased = tmplBased;
        this.scope = scope;
    }

    get name(): string {
        return this.typeName;
    }

    set name(name: string) {
        if (!this.tmplBased && !this.scope.has(name)) {
            this.scope.delete(this.typeName);
            this.typeName = name;
            this.scope.set(name, this);
        }
    }

    get canModify(): boolean {
        return !this.tmplBased;
    }
}

/* Fields are always required. User can't add/change/delete fields. Only changing its value is allowed.
 * In PageTab it's a selected by name attribute from an 'attributes' section.
 */
export type ValueType = 'text' | 'textblob' | 'date';

export class FieldType extends BaseType {
    readonly valueType: ValueType;
    readonly minlength: number;
    readonly maxlength: number;

    constructor(name, obj?: any, scope?: Map<string, any>) {
        super(name, true, scope);
        obj = obj || {};
        this.valueType = obj.valueType || 'text';
        this.minlength = obj.minlength || -1;
        this.maxlength = obj.maxlength || -1;
    }
}

/* Feature contains similar defined PageTab section(s) without subsections or a list of attributes*/
export class FeatureType extends BaseType {
    private columnScope: Map<string, any> = new Map();

    readonly singleRow: boolean;
    readonly required: boolean;
    readonly title: string;
    readonly description: string;

    static createDefault(name: string, singleRow?: boolean, scope?: Map<string, any>): FeatureType {
        return new FeatureType(name, singleRow === true, undefined, scope);
    }

    constructor(name: string, singleRow: boolean, other?: any, scope?: Map<string, any>) {
        super(name, other !== undefined, scope);
        this.singleRow = singleRow === true;

        other = other || {};
        this.required = other.required === true;
        this.title = other.title || 'Add ' + this.name;
        this.description = other.description || '';

        (other.columnTypes || [])
            .forEach(ct => {
                const colType = new ColumnType(ct.name, ct, this.columnScope);
            });
    }

    get columnTypes(): ColumnType[] {
        return Array.from(this.columnScope.values()).filter(ct => ct.tmplBased);

    }

    getColumnType(name: string): ColumnType {
        if (this.columnScope.has(name)) {
            return this.columnScope.get(name);
        }
        return ColumnType.createDefault(name, this.columnScope);
    }
}

export class AnnotationsType extends FeatureType {
    constructor(other?: any, scope?: Map<string, any>) {
        super('Annotation', true, other, scope);
    }
}

export class ColumnType extends BaseType {
    readonly required: boolean;
    readonly valueType: ValueType;

    static createDefault(name: string, scope?: Map<string, any>): ColumnType {
        return new ColumnType(name, undefined, scope);
    }

    constructor(name: string, other?: any, scope?: Map<string, any>) {
        super(name, other !== undefined, scope);

        other = other || {};
        this.valueType = other.valueType || 'text';
        this.required = other.required === true;
    }
}

export class SectionType extends BaseType {
    readonly required: boolean;
    readonly annotationsType: AnnotationsType;

    private fieldScope: Map<string, any> = new Map();
    private featureScope: Map<string, any> = new Map();
    private sectionScope: Map<string, any> = new Map();

    static createDefault(name: string, scope?: Map<string, any>): SectionType {
        return new SectionType(name, undefined, scope);
    }

    constructor(name: string, other?: any, scope?: Map<string, any>) {
        super(name, other !== undefined, scope);

        other = other || {};
        this.required = other.required === true;
        this.annotationsType = new AnnotationsType(other.annotationsType, new Map());
        (other.fieldTypes || [])
            .forEach(f => new FieldType(f.name, f, this.fieldScope));
        (other.featureTypes || [])
            .forEach(f => new FeatureType(f.name, f.singleRow, f, this.featureScope));
        (other.sectionTypes || [])
            .forEach(s => new SectionType(s.name, s, this.sectionScope));
    }

    get fieldTypes(): FieldType[] {
        return Array.from(this.fieldScope.values()).filter(ft => ft.tmplBased);
    }

    get featureTypes(): FeatureType[] {
        return Array.from(this.featureScope.values()).filter(ft => ft.tmplBased);
    }

    get sectionTypes(): SectionType[] {
        return Array.from(this.sectionScope.values()).filter(st => st.tmplBased);
    }

    getFieldType(name: string): FieldType {
        return this.fieldScope.get(name);
    }

    getFeatureType(name: string, singleRow: boolean = false): FeatureType {
        if (this.featureScope.has(name)) {
            return this.featureScope.get(name);
        }
        return FeatureType.createDefault(name, singleRow, this.featureScope);
    }

    getSectionType(name: string): SectionType {
        if (this.sectionScope.has(name)) {
            return this.sectionScope.get(name);
        }
        return SectionType.createDefault(name, this.sectionScope);
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
}

export class SubmissionType extends BaseType {
    readonly sectionType: SectionType;

    static createDefault(): SubmissionType {
        return SubmissionType.fromTemplate(DefaultTemplate);
    }

    static fromTemplate(tmpl: any): SubmissionType {
        return TemplateType.create(tmpl).submissionType;
    }

    constructor(name: string, obj: any, scope?: Map<string, any>) {
        super('Submission', obj !== undefined, scope);
        if (obj.sectionType === undefined) {
            throw Error('sectionType is not defined in the template');
        }
        this.sectionType = new SectionType(obj.sectionType.name, obj.sectionType, new Map());
    }
}

export class TemplateType extends BaseType {
    readonly submissionType: SubmissionType;

    static create(tmpl: any): TemplateType {
        const tmplName = tmpl.name;
        if (tmplName === undefined) {
            throw Error('name is not defined for the template');
        }
        if (GlobalScope.has(tmplName)) {
            return GlobalScope.get(tmplName);
        }
        return new TemplateType(tmplName, tmpl, GlobalScope);
    }

    constructor(name: string, obj?: any, scope?: Map<string, any>) {
        super(name, obj !== undefined, scope);
        this.submissionType = new SubmissionType('Submission', obj, new Map());
    }
}

export function invalidateGlobalScope() {
    GlobalScope.clear();
}
