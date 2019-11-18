import { EMPTY_TEMPLATE_NAME, findSubmissionTemplateByName } from './submission.templates';

/*
*  Type scopes are used to check if the types with a given name already exists in the scope
*  (SubmissionScope, SectionScope, FeatureScope, FieldsScope.. etc.). Each type must be in a scope.
* */
class TypeScope<T extends TypeBase> {
    private map: Map<String, T> = new Map();

    has(typeName: string) {
        return this.map.has(typeName);
    }

    set(typeName: string, value: T) {
        this.map.set(typeName, value);
    }

    get(typeName: string): T | undefined {
        return this.map.get(typeName);
    }

    getOrElse(typeName: string, elseFunc: () => T): T {
        if (this.has(typeName)) {
            return this.get(typeName)!;
        }
        return elseFunc();
    }

    values(): T[] {
        return Array.from(this.map.values());
    }

    filterValues(predicate: (T) => boolean): T[] {
        return this.values().filter(predicate);
    }

    rename(oldName: string, newName: string): boolean {
        if (this.has(newName)) {
            console.warn('rename (${oldName}): Type with the name ${newName} already exists');
            return false;
        }

        if (this.has(oldName)) {
            const value = this.get(oldName)!;
            this.set(newName, value);
            this.del(oldName);
            return true;
        }

        return false;
    }

    del(typeName: string) {
        if (this.has(typeName)) {
            this.map.delete(typeName);
        }
    }

    clear() {
        this.map.clear();
    }
}

const GLOBAL_TYPE_SCOPE: TypeScope<TypeBase> = new TypeScope<TypeBase>();

export abstract class TypeBase {
    constructor(private typeName: string,
                readonly tmplBased: boolean,
                private scope: TypeScope<TypeBase> = GLOBAL_TYPE_SCOPE) {

        this.typeName = String.isDefined(typeName) ? typeName.trim() : '';

        if (this.typeName.isEmpty()) {
            console.warn(`Error: Type name is empty`);
            return;
        }

        if (scope.has(this.typeName)) {
            console.warn(`Error: Type with name ${this.typeName} already exists in the scope`);
            return;
        }

        scope.set(this.typeName, this);
    }

    get name(): string {
        return this.typeName;
    }

    set name(name: string) {
        if (this.tmplBased) {
            return;
        }

        if (this.scope.rename(this.typeName, name)) {
            this.typeName = name;
        }
    }

    destroy(): void {
        this.scope.del(this.typeName);
    }

    get canModify(): boolean {
        return !this.tmplBased;
    }
}

export class DisplayType {
    public static Required = new DisplayType('required');
    public static Desirable = new DisplayType('desirable');
    public static Readonly = new DisplayType('readonly');
    public static Optional = new DisplayType('optional');

    public static all = [
        DisplayType.Required,
        DisplayType.Desirable,
        DisplayType.Readonly,
        DisplayType.Optional
    ];

    readonly name: string;

    public static create(name: string = 'optional'): DisplayType {
        return DisplayType.all.find(t => t.name === name) || DisplayType.Optional;
    }

    private constructor(name: string) {
        this.name = name;
    }

    public get isRequired(): boolean {
        return this === DisplayType.Required;
    }

    public get isReadonly(): boolean {
        return this === DisplayType.Readonly;
    }

    public get isDesirable(): boolean {
        return this === DisplayType.Desirable;
    }

    public get isOptional(): boolean {
        return this === DisplayType.Optional;
    }

    public get isShownByDefault(): boolean {
        return this.isRequired || this.isDesirable;
    }

    public get isRemovable(): boolean {
        return !this.isShownByDefault;
    }
}

export enum ValueTypeName {
    text,
    largetext,
    date,
    select,
    file,
    link,
    idlink,
    orcid,
    pubmedid
}

export abstract class ValueType {
    constructor(readonly name: ValueTypeName) {
    }

    is(...names: ValueTypeName[]): boolean {
        return names.includes(this.name);
    }

    isText(): boolean {
        return this.is(ValueTypeName.text, ValueTypeName.largetext);
    }
}

export class TextValueType extends ValueType {
    readonly minlength: number;
    readonly maxlength: number;

    constructor(data: Partial<TextValueType> = {}, valueTypeName?: ValueTypeName) {
        super(valueTypeName || ValueTypeName.text);
        this.minlength = data.minlength || -1;
        this.maxlength = data.maxlength || -1;
    }
}

export class DateValueType extends ValueType {
    readonly allowPast: boolean;

    constructor(data: Partial<DateValueType> = {}) {
        super(ValueTypeName.date);
        this.allowPast = data.allowPast === true;
    }
}

export class SelectValueType extends ValueType {
    readonly values: string[];

    constructor(data: Partial<SelectValueType> = {}) {
        super(ValueTypeName.select);
        this.values = data.values || [];
    }
}

export class ValueTypeFactory {
    static DEFAULT = ValueTypeFactory.create();

    static create(data: Partial<ValueType> = {}): ValueType {
        const typeName: ValueTypeName = ValueTypeName[data.name || ''] || ValueTypeName.text;
        switch (typeName) {
            case ValueTypeName.date:
                return new DateValueType(data);
            case ValueTypeName.select:
                return new SelectValueType(data);
            default:
                return new TextValueType(data, typeName);
        }
    }
}

export class FieldType extends TypeBase {
    readonly display: string;
    readonly displayType: DisplayType;
    readonly valueType: ValueType;
    readonly icon: string;

    constructor(name: string, data: Partial<FieldType> = {}, scope?: TypeScope<TypeBase>) {
        super(name, true, scope);

        this.valueType = ValueTypeFactory.create(data.valueType || {});
        this.icon = data.icon || 'fa-pencil-square-o';

        this.displayType = DisplayType.create(data.display);
        this.display = this.displayType.name;
    }
}

export class FeatureType extends TypeBase {
    readonly display: string;
    readonly displayType: DisplayType;
    readonly singleRow: boolean;
    readonly uniqueCols: boolean;
    readonly allowCustomCols: boolean;
    readonly title: string;
    readonly description: string;
    readonly icon: string;

    private columnScope: TypeScope<ColumnType> = new TypeScope<ColumnType>();

    static createDefault(name: string, singleRow?: boolean, uniqueCols?: boolean, scope?: TypeScope<TypeBase>): FeatureType {
        return new FeatureType(name, {singleRow: singleRow, uniqueCols: uniqueCols}, scope, false);
    }

    constructor(name: string, data?: Partial<FeatureType>, scope?: TypeScope<TypeBase>, isTemplBased: boolean = true) {
        super(name, isTemplBased, scope);

        data = data || {};
        this.title = data.title || 'Add ' + this.name;
        this.description = data.description || '';
        this.singleRow = data.singleRow === true;
        this.uniqueCols = data.uniqueCols === true;
        this.allowCustomCols = data.allowCustomCols !== false;

        this.displayType = DisplayType.create(data.display);
        this.display = this.displayType.name;

        this.icon = data.icon || (this.singleRow ? 'fa-list' : 'fa-th');

        (data.columnTypes || [])
            .forEach(ct => {
                new ColumnType(ct.name, ct, this.columnScope);
            });
    }

    get columnTypes(): ColumnType[] {
        return this.columnScope.filterValues(ct => ct.tmplBased);
    }

    getColumnType(name: string, createDefault: boolean = true): ColumnType | undefined {
        if (this.columnScope.has(name)) {
            return this.columnScope.get(name);
        }

        if (createDefault) {
            return ColumnType.createDefault(name, this.columnScope);
        }

        return undefined;
    }
}

export class AnnotationsType extends FeatureType {
    constructor(data?: Partial<FeatureType>, scope?: TypeScope<TypeBase>, isTemplBased: boolean = true) {
        const d = Object.assign(data || {}, {singleRow: true});
        super('Annotation', d, scope, isTemplBased);
    }
}

export class ColumnType extends TypeBase {
    readonly display: string;
    readonly displayType: DisplayType;
    readonly valueType: ValueType;

    static createDefault(name: string, scope?: TypeScope<ColumnType>): ColumnType {
        return new ColumnType(name, {}, scope, false);
    }

    constructor(name: string, data?: Partial<ColumnType>, scope?: TypeScope<ColumnType>, isTemplBased: boolean = true) {
        super(name, isTemplBased, scope as TypeScope<TypeBase>);

        data = data || {};
        this.valueType = ValueTypeFactory.create(data.valueType || {});
        this.displayType = DisplayType.create(data.display);
        this.display = this.displayType.name;
    }

    get isRequired(): boolean {
        return this.displayType.isRequired;
    }

    get isDesirable(): boolean {
        return this.displayType.isDesirable;
    }

    get isReadonly(): boolean {
        return this.displayType.isReadonly;
    }
}

export class SectionType extends TypeBase {
    readonly display: string;
    readonly displayType: DisplayType;
    readonly annotationsType: AnnotationsType;
    readonly featureGroups: string[][];
    readonly minRequired: number;

    private fieldScope: TypeScope<FieldType> = new TypeScope<FieldType>();
    private featureScope: TypeScope<FeatureType> = new TypeScope<FeatureType>();
    private sectionScope: TypeScope<SectionType> = new TypeScope<SectionType>();

    static createDefault(name: string, scope?: TypeScope<TypeBase>): SectionType {
        return new SectionType(name, {}, scope, false);
    }

    constructor(name: string, data?: Partial<SectionType>, scope?: TypeScope<TypeBase>, isTemplBased: boolean = true) {
        super(name, isTemplBased, scope);

        data = data || {};
        this.displayType = DisplayType.create(data.display);
        this.display = this.displayType.name;
        this.featureGroups = (data.featureGroups || []).filter(gr => !gr.isEmpty());
        this.minRequired = data.minRequired || 1;

        this.annotationsType = new AnnotationsType(data.annotationsType, new TypeScope<AnnotationsType>(), isTemplBased);

        (data.fieldTypes || [])
            .forEach(f => new FieldType(f.name, f, this.fieldScope));
        (data.featureTypes || [])
            .forEach(f => new FeatureType(f.name, f, this.featureScope, isTemplBased));
        (data.sectionTypes || [])
            .forEach(s => new SectionType(s.name, s, this.sectionScope, isTemplBased));
    }

    get fieldTypes(): FieldType[] {
        return this.fieldScope.filterValues(ft => ft.tmplBased);
    }

    get featureTypes(): FeatureType[] {
        return this.featureScope.filterValues(ft => ft.tmplBased);
    }

    get sectionTypes(): SectionType[] {
        return this.sectionScope.filterValues(st => st.tmplBased);
    }

    getFieldType(name: string): FieldType | undefined {
        return this.fieldScope.get(name);
    }

    getFeatureType(name: string, singleRow: boolean = false, uniqueCols: boolean = false): FeatureType {
        return this.featureScope
            .getOrElse(name, () => (FeatureType.createDefault(name, singleRow, uniqueCols, this.featureScope)));
    }

    getSectionType(name: string): SectionType {
        return this.sectionScope
            .getOrElse(name, () => (SectionType.createDefault(name, this.sectionScope)));
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

export class SubmissionType extends TypeBase {
    readonly sectionType: SectionType;

    static fromTemplate(tmplName: string): SubmissionType {
        const tmpl = findSubmissionTemplateByName(tmplName);
        return new SubmissionType('Submission', tmpl, new TypeScope<TypeBase>());
    }

    static fromEmptyTemplate(): SubmissionType {
        return SubmissionType.fromTemplate(EMPTY_TEMPLATE_NAME);
    }

    constructor(name: string, typeObj: SubmissionType, scope?: TypeScope<TypeBase>) {
        super('Submission', true, scope);
        if (typeObj.sectionType === undefined) {
            throw Error('sectionType is not defined in the template');
        }
        this.sectionType = new SectionType(typeObj.sectionType.name, typeObj.sectionType, new TypeScope<TypeBase>());
    }
}

export function invalidateGlobalScope() {
    GLOBAL_TYPE_SCOPE.clear();
}
