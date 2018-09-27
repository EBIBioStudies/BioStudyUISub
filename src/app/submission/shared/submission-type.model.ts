import {EMPTY_TEMPLATE_NAME, findSubmissionTemplateByName} from './templates/submission.templates';
import {ValidatorFn} from '@angular/forms';

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

abstract class TypeBase {
    constructor(private typeName: string,
                readonly tmplBased: boolean,
                private scope: TypeScope<TypeBase> = GLOBAL_TYPE_SCOPE) {

        this.typeName = typeName.trim();

        if (typeName.isEmpty()) {
            console.warn(`Error: Type name is empty`);
            return;
        }

        if (scope.has(typeName)) {
            console.warn(`Error: Type with name ${typeName} already exists in the scope`);
            return;
        }

        scope.set(typeName, this);
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

export enum ValueTypeName {
    text,
    largetext,
    date,
    select,
    file,
    link,
    idLink
}

export abstract class ValueType {
    readonly required = false;

    constructor(readonly name: ValueTypeName) {
    }

    static create(data: Partial<ValueType> = {}): ValueType {
        const typeName = ValueTypeName[data.name || ValueTypeName.text] || ValueTypeName.text;
        switch (typeName) {
            case ValueTypeName.largetext:
                return new LargeTextValueType(data);
            case ValueTypeName.date:
                return new DateValueType(data);
            case ValueTypeName.select:
                return new SelectValueType(data);
            case ValueTypeName.file:
                return new FileValueType(data);
            default:
                return new TextValueType(data);
        }
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

export class LargeTextValueType extends TextValueType {
    constructor(data: Partial<LargeTextValueType> = {}) {
        super(data, ValueTypeName.largetext);
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

    constructor(name, data: Partial<SelectValueType> = {}) {
        super(ValueTypeName.select);
        this.values = data.values || [];
    }
}

export class FileValueType extends TextValueType {
    constructor(data: Partial<FileValueType> = {}) {
        super(data, ValueTypeName.file);
    }
}


export class FieldType extends TypeBase {
    readonly required: boolean;
    readonly readonly: boolean;
    readonly valueType: ValueType;
    readonly icon: string;

    constructor(name: string, data: Partial<FieldType> = {}, scope?: TypeScope<TypeBase>) {
        super(name, true, scope);

        this.valueType = ValueType.create(data.valueType || {});
        this.readonly = data.readonly === true;
        this.required = data.required === true;
        this.icon = data.icon || 'fa-pencil-square-o'
    }
}

export class FeatureType extends TypeBase {
    private columnScope: TypeScope<ColumnType> = new TypeScope<ColumnType>();

    readonly required: boolean;
    readonly singleRow: boolean;
    readonly uniqueCols: boolean;
    readonly title: string;
    readonly description: string;
    readonly icon: string;

    constructor(name: string, singleRow: boolean, uniqueCols: boolean, data?: Partial<FeatureType>, scope?: TypeScope<TypeBase>) {
        super(name, data !== undefined, scope);
        this.singleRow = singleRow;
        this.uniqueCols = uniqueCols;

        data = data || {};
        this.required = data.required === true;
        this.title = data.title || 'Add ' + this.name;
        this.description = data.description || '';

        this.icon = data.icon || (this.singleRow ? 'fa-list' : 'fa-th');

        (data.columnTypes || [])
            .forEach(ct => {
                new ColumnType(ct.name, ct, this.columnScope);
            });
    }

    static createDefault(name: string, singleRow?: boolean, uniqueCols?: boolean, scope?: TypeScope<TypeBase>): FeatureType {
        return new FeatureType(name, singleRow === true, uniqueCols === true, undefined, scope);
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
    constructor(data?: Partial<FeatureType>, scope?: TypeScope<TypeBase>) {
        const uniqueCols = data !== undefined && data.uniqueCols === true;
        super('Annotation', true, uniqueCols, data, scope);
    }
}

export class ColumnType extends TypeBase {
    readonly required: boolean;
    readonly displayed: boolean;
    readonly readonly: boolean;
    readonly removable: boolean;
    readonly valueType: ValueType;

    static createDefault(name: string, scope?: TypeScope<ColumnType>): ColumnType {
        return new ColumnType(name, undefined, scope);
    }

    constructor(name: string, data?: Partial<ColumnType>, scope?: TypeScope<ColumnType>) {
        super(name, data !== undefined, scope as TypeScope<TypeBase>);

        data = data || {};
        this.valueType = ValueType.create(data.valueType || {});
        this.required = data.required === true;
        this.readonly = data.readonly === true;
        this.displayed = data.displayed === true;
        this.removable = data.removable !== false;
    }
}

export class SectionType extends TypeBase {
    readonly required: boolean;
    readonly annotationsType: AnnotationsType;

    private fieldScope: TypeScope<FieldType> = new TypeScope<FieldType>();
    private featureScope: TypeScope<FeatureType> = new TypeScope<FeatureType>();
    private sectionScope: TypeScope<SectionType> = new TypeScope<SectionType>();

    static createDefault(name: string, scope?: TypeScope<TypeBase>): SectionType {
        return new SectionType(name, undefined, scope);
    }

    constructor(name: string, data?: Partial<SectionType>, scope?: TypeScope<TypeBase>) {
        super(name, data !== undefined, scope);

        data = data || {};
        this.required = data.required === true;

        this.annotationsType = new AnnotationsType(data.annotationsType, new TypeScope<AnnotationsType>());

        (data.fieldTypes || [])
            .forEach(f => new FieldType(f.name, f, this.fieldScope));
        (data.featureTypes || [])
            .forEach(f => new FeatureType(f.name, f.singleRow, f.uniqueCols, f, this.featureScope));
        (data.sectionTypes || [])
            .forEach(s => new SectionType(s.name, s, this.sectionScope));
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
        super('Submission', typeObj !== undefined, scope);
        if (typeObj.sectionType === undefined) {
            throw Error('sectionType is not defined in the template');
        }
        this.sectionType = new SectionType(typeObj.sectionType.name, typeObj.sectionType, new TypeScope<TypeBase>());
    }
}

export function invalidateGlobalScope() {
    GLOBAL_TYPE_SCOPE.clear();
}
