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

    /**
     * Removes the type name from the scope. Allows type names that were previously assigned to
     * submission items already deleted.
     */
    destroy(): void {
        this.scope.delete(this.typeName);
    }

    get canModify(): boolean {
        return !this.tmplBased;
    }
}

/* Fields are always required by default. User can't add/change/delete fields. Only changing its value is allowed.
 * In PageTab it's selected by name attribute from an 'attributes' section.
 */
export type ValueType = 'text' | 'textblob' | 'date' | 'file';

export class FieldType extends BaseType {
    readonly required: boolean;
    readonly valueType: ValueType;
    readonly minlength: number;
    readonly maxlength: number;
    readonly icon: string;

    constructor(name, obj?: any, scope?: Map<string, any>) {
        super(name, true, scope);
        obj = obj || {};
        this.valueType = obj.valueType || 'text';
        this.minlength = obj.minlength || -1;
        this.maxlength = obj.maxlength || -1;

        //Sets required to false if not present. If the field has a mininum length, it must be required.
        if (obj.hasOwnProperty('required')) {
            this.required = obj.required;
        } else if (this.minlength > 0) {
            this.required = true;
        } else {
            this.required = false;
        }

        //Normalises the icon for the present type.
        if (obj.hasOwnProperty('icon')) {
            this.icon = obj.icon;
        } else {
            this.icon = 'fa-pencil-square-o';
        }
    }
}

/**
 * Provides information likely to be processed, or at least considered, separately. Thus, it corresponds to a section
 * in PageTab's model but without any subsections or list of attributes. It is rendered as a widget
 * consisting of either a list –actually, this is used internally for the – or a grid, both with add buttons allowing
 * the addition of new columns or rows.
 */
export class FeatureType extends BaseType {
    private columnScope: Map<string, any> = new Map();

    readonly singleRow: boolean;
    readonly required: boolean;
    readonly title: string;
    readonly description: string;
    readonly icon: string;

    /**
     * Instantiates a feature widget type with a pre-defined set of sub-type elements.
     * @param {string} name - Effectively, the widget's name to be displayed in the app.
     * @param {boolean} singleRow - If true, the feature will be rendered as a list where each column is actually a row.
     * @param {Object} typeObj - Contains all the sub-type parameters defining this feature widget.
     * @param {Map<string, any>} scope - Set of already existing featureType instances.
     */
    constructor(name: string, singleRow: boolean, typeObj?: any, scope?: Map<string, any>) {
        super(name, typeObj !== undefined, scope);
        this.singleRow = singleRow === true;

        typeObj = typeObj || {};
        this.required = typeObj.required === true;
        this.title = typeObj.title || 'Add ' + this.name;
        this.description = typeObj.description || '';

        //Normalises the icon for the present type
        if (typeObj.hasOwnProperty('icon')) {
            this.icon = typeObj.icon;
        } else if (this.singleRow) {
            this.icon = 'fa-list';
        } else {
            this.icon = 'fa-th';
        }

        (typeObj.columnTypes || [])
            .forEach(ct => {
                const colType = new ColumnType(ct.name, ct, this.columnScope);
            });
    }

    /**
     * Convenience static factory method for features without pre-defined parameters.
     * @param {string} name - Name to be displayed as the feature's.
     * @param {boolean} [singleRow] - Optional list mode.
     * @param {Map<string, any>} [scope] - Optional set of already existing featureType instances.
     * @returns {FeatureType} Newly instantiated feature widget.
     */
    static createDefault(name: string, singleRow?: boolean, scope?: Map<string, any>): FeatureType {
        return new FeatureType(name, singleRow === true, undefined, scope);
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

/**
 * All annotations are features with the "singleRow" flag set to true so that the controls
 * for adding rows/columns are not shown.
 */
export class AnnotationsType extends FeatureType {
    constructor(other?: any, scope?: Map<string, any>) {
        super('Annotation', true, other, scope);
    }
}

export class ColumnType extends BaseType {
    readonly required: boolean;     //required data-wise: its fields should have data associated with it to be valid
    readonly displayed: boolean;    //required render-wise: should be visually available regardless of its fields being required or not
    readonly valueType: ValueType;  //type of data for the fields under this column

    static createDefault(name: string, scope?: Map<string, any>): ColumnType {
        return new ColumnType(name, undefined, scope);
    }

    constructor(name: string, other?: any, scope?: Map<string, any>) {
        super(name, other !== undefined, scope);

        other = other || {};
        this.valueType = other.valueType || 'text';
        this.required = other.required === true;
        this.displayed = other.displayed || false;
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

    /**
     * Instantiates a submission type with a pre-defined set of sub-type definitions. Note that a single sectionType
     * is assumed at root level. However, that section may in turn consist of multiple sections (so-called "subsections).
     * @param {string} name - Name of the submission's only section. Not in use at present.
     * @param {Object} typeObj - Contains all the sub-type parameters defining this submission.
     * @param {Map<string, any>} [scope] - Optional set of already existing SubmissionType instances.
     */
    constructor(name: string, typeObj: any, scope?: Map<string, any>) {
        super('Submission', typeObj !== undefined, scope);
        if (typeObj.sectionType === undefined) {
            throw Error('sectionType is not defined in the template');
        }
        this.sectionType = new SectionType(typeObj.sectionType.name, typeObj.sectionType, new Map());
    }
}

export class TemplateType extends BaseType {
    readonly submissionType: SubmissionType;

    constructor(name: string, obj?: any, scope?: Map<string, any>) {
        super(name, obj !== undefined, scope);
        this.submissionType = new SubmissionType('Submission', obj, new Map());
    }

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
}

export function invalidateGlobalScope() {
    GlobalScope.clear();
}
