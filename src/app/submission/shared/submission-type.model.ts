import {DefaultTemplate} from './default.template';
import {HecatosTemplate} from './hecatos.template';
import {EutoxriskTemplate} from "./eutoxrisk.template";

const defined = (val: string) => {
    return val !== undefined && val.length > 0;
};

const GlobalScope: Map<string, any> = new Map();

class BaseType {
    readonly tmplBased?: boolean;

    constructor(private typeName: string,
                tmplBased: boolean,
                private scope: Map<string, any> = GlobalScope) {

        //Aborts if no name given or the type already exists
        if (!defined(typeName)) {
            console.warn(`Error: Type name is undefined ${typeName}`);
            return;
        }
        if (scope.has(typeName)) {
            console.warn(`Error: Type with name ${typeName} already exists in the scope`);
            return;
        }

        scope.set(typeName, this);
        this.tmplBased = tmplBased;
    }

    get name(): string {
        return this.typeName;
    }

    set name(name: string) {
        if (!this.tmplBased && !this.scope.has(name)) {
            this.scope!.delete(this.typeName);
            this.typeName = name;
            this.scope!.set(name, this);
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

/* Top-level fields are always required by default. User can't add/change/delete fields. Only changing
 * its value is allowed. In PageTab, it's selected by name attribute from an 'attributes' section.
 */
export type ValueType = 'text' | 'textblob' | 'date' | 'file';

export class FieldType extends BaseType {
    required: boolean;              //NOTE: externally modified if the field is part of a validation group
    readonly valueType: ValueType;
    readonly readonly: boolean;
    readonly values: string[];      //suggested values for the field
    readonly minlength: number;
    readonly maxlength: number;
    readonly allowPast: boolean;
    readonly icon: string;

    constructor(name, other?: any, scope?: Map<string, any>) {
        super(name, true, scope);
        other = other || {};
        this.valueType = other.valueType || 'text';
        this.values = other.values || [];
        this.readonly = other.readonly === true;
        this.minlength = other.minlength || -1;
        this.maxlength = other.maxlength || -1;

        //Sets "required" to false if not present. If the field has a mininum length, it must be required.
        if (other.hasOwnProperty('required')) {
            this.required = other.required;
        } else if (this.minlength > 0) {
            this.required = true;
        } else {
            this.required = false;
        }

        //Sets field's icon to a default one if not present.
        if (other.hasOwnProperty('icon')) {
            this.icon = other.icon;
        } else {
            this.icon = 'fa-pencil-square-o';
        }

        //Sets the ability of setting past dates to true by default.
        if (this.valueType == 'date' && other.hasOwnProperty('allowPast')) {
            this.allowPast = other.allowPast;
        } else {
            this.allowPast = true;
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

    required: boolean;              //NOTE: externally modified if the feature is part of a validation group
    readonly singleRow: boolean;
    readonly uniqueCols: boolean;
    readonly title: string;
    readonly description: string;
    readonly icon: string;

    /**
     * Instantiates a feature widget type with a pre-defined set of sub-type elements.
     * @param {string} name - Effectively, the widget's name to be displayed in the app.
     * @param {boolean} singleRow - If true, the feature will be rendered as a list where each column is actually a row.
     * @param {boolean} uniqueCols - If true, columns with duplicate names will be flagged up during validation.
     * @param {Object} typeObj - Contains all the sub-type parameters defining this feature widget.
     * @param {Map<string, any>} scope - Set of already existing featureType instances.
     */
    constructor(name: string, singleRow: boolean, uniqueCols: boolean, typeObj?: any, scope?: Map<string, any>) {
        super(name, typeObj !== undefined, scope);
        this.singleRow = singleRow === true;
        this.uniqueCols = uniqueCols === true;

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
     * @param {boolean} [uniqueCols] - Optional unique columns mode.
     * @param {Map<string, any>} [scope] - Optional set of already existing featureType instances.
     * @returns {FeatureType} Newly instantiated feature widget.
     */
    static createDefault(name: string, singleRow?: boolean, uniqueCols?: boolean, scope?: Map<string, any>): FeatureType {
        return new FeatureType(name, singleRow === true, uniqueCols === true, undefined, scope);
    }

    get columnTypes(): ColumnType[] {
        return Array.from(this.columnScope.values()).filter(ct => ct.tmplBased);

    }

    /**
     * Gets the column type corresponding to a certain given name, creating a new one if so required.
     * @param {string} name - Name of the column whose type object is required.
     * @param {boolean} [isCreate = true] - Flag to enable the automatic creation of types for unknown columns.
     * @returns {ColumnType} Type object for the searched column. Null if creation disabled.
     */
    getColumnType(name: string, isCreate: boolean = true): ColumnType | undefined {
        if (this.columnScope.has(name)) {
            return this.columnScope.get(name);
        }

        if (isCreate) {
            return ColumnType.createDefault(name, this.columnScope);
        }

        return undefined;
    }
}

/**
 * All annotations are features with the "singleRow" flag set to true so that the controls
 * for adding columns are not shown. Additionally, duplicate keys are implicitly allowed
 * unless stated otherwise.
 */
export class AnnotationsType extends FeatureType {
    constructor(other?: any, scope?: Map<string, any>) {
        let isUniqueCols;

        if (other && other.hasOwnProperty('uniqueCols')) {
            isUniqueCols = other.uniqueCols;
        } else {
            isUniqueCols = false;
        }

        super('Annotation', true, isUniqueCols, other, scope);
    }
}

export class ColumnType extends BaseType {
    readonly required: boolean;     //required data-wise: its fields should have data associated with it to be valid
                                    //NOTE: A required column's name cannot be changed.
    readonly displayed: boolean;    //required render-wise: should be visually available regardless of its fields being required or not
                                    //NOTE: This guaranteed rendering implies that the column's name cannot be changed.
    readonly readonly: boolean;     //renders the column and its member fields as a readonly inputs
                                    //NOTE: Notice that BOTH the column field and member fields will be readonly.
    readonly removable: boolean;    //renders the column without removal controls (useful for un-required yet un-removable columns).
    readonly allowPast: boolean;    //enables past dates on calendar picker if applicable
    readonly valueType: ValueType;  //type of data for the fields under this column
    readonly values: string[];      //suggested values for the field

    static createDefault(name: string, scope?: Map<string, any>): ColumnType {
        return new ColumnType(name, undefined, scope);
    }

    constructor(name: string, other?: any, scope?: Map<string, any>) {
        super(name, other !== undefined, scope);

        other = other || {};
        this.valueType = other.valueType || 'text';
        this.required = other.required === true;
        this.readonly = other.readonly === true;
        this.displayed = other.displayed || false;
        this.values = other.values || [];

        //All columns are removable unless stated otherwise.
        if (other.hasOwnProperty('removable')) {
            this.removable = other.removable;
        } else {
            this.removable = true;
        }

        //Sets the ability of setting past dates to true by default.
        if (this.valueType == 'date' && other.hasOwnProperty('allowPast')) {
            this.allowPast = other.allowPast;
        } else {
            this.allowPast = true;
        }
    }
}

export class SectionType extends BaseType {
    readonly required: boolean;
    readonly annotationsType: AnnotationsType;
    readonly group: string[];             //lists the names of any fields/features belonging to the same validation group
                                          //NOTE: validation groups are valid if at least one member feature is.
    readonly groupTypes: any[] = [];      //Lookup table of types for validation group members

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

        //Normalises the group property to an array.
        if (Array.isArray(other.group)) {
            this.group =  other.group;
        } else {
            this.group = [];
        }


        this.annotationsType = new AnnotationsType(other.annotationsType, new Map());
        (other.fieldTypes || [])
            .forEach(f => new FieldType(f.name, f, this.fieldScope));
        (other.featureTypes || [])
            .forEach(f => new FeatureType(f.name, f.singleRow, f.uniqueCols, f, this.featureScope));
        (other.sectionTypes || [])
            .forEach(s => new SectionType(s.name, s, this.sectionScope));


        //Traverses the list of validation group members, finding the type for the available ones and forcing it to be
        //set as "required". This simplifies UI feedback later when highlighting fields/features correctly.
        this.group.forEach((name) => {
            let memberType: FieldType | FeatureType;

            if (name == 'Annotation') {
                memberType = this.annotationsType;
            } else {
                memberType = this.getFieldType(name);
                if (!memberType) {
                    memberType = this.getFeatureType(name);
                }
            }
            if (memberType) {
                this.groupTypes.push(memberType);
                memberType.required = true;
            }
        });

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

    getFeatureType(name: string, singleRow: boolean = false, uniqueCols: boolean = false): FeatureType {
        if (this.featureScope.has(name)) {
            return this.featureScope.get(name);
        }
        return FeatureType.createDefault(name, singleRow, uniqueCols, this.featureScope);
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

    static defaultTmplName() {
        return DefaultTemplate.name;
    }

    static createDefault(): SubmissionType {
        return SubmissionType.fromTemplate('');
    }

    /**
     * Creates a new submission using the type definitions present in a given project template.
     * @param {string | Object} tmpl - ID of the template containing the type definitions or the template itself.
     * @returns {SubmissionType} New submission.
     */
    static fromTemplate(tmpl: string | Object): SubmissionType {
        if (typeof tmpl === 'string') {
            switch (tmpl.toLowerCase()) {
                case 'eu-toxrisk':
                    return TemplateType.create(EutoxriskTemplate).submissionType;
                case 'hecatos':
                    return TemplateType.create(HecatosTemplate).submissionType;
                default:
                    return TemplateType.create(DefaultTemplate).submissionType;
            }
        } else {
            return TemplateType.create(tmpl).submissionType;
        }
    }

    /**
     * Retrieves the names of all the templates available in the app.
     * @returns {string[]} Array of template names, with the default template's always first.
     */
    static listTmplNames(): any[] {
        return [DefaultTemplate, EutoxriskTemplate, HecatosTemplate].map(tmpl => tmpl.name);
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

        //Submission types are not tracked (no existing scope passed in)
        this.submissionType = new SubmissionType('Submission', obj, new Map());
    }

    static create(tmpl: any): TemplateType {
        const tmplName = tmpl.name;
        if (tmplName === undefined) {
            throw Error('name is not defined for the template');
        }

        //Template types are not tracked (no existing scope passed in)
        return new TemplateType(tmplName, tmpl, new Map());
    }
}

export function invalidateGlobalScope() {
    GlobalScope.clear();
}
