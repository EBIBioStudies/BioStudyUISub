import { EMPTY_TEMPLATE_NAME, findSubmissionTemplateByName } from './submission.templates';
import { isArrayEmpty, isStringDefined, isStringEmpty } from 'app/utils';

/*
 *  Type scopes are used to check if the types with a given name already exists in the scope
 *  (SubmissionScope, SectionScope, FeatureScope, FieldsScope.. etc.). Each type must be in a scope.
 * */
class TypeScope<T extends TypeBase> {
  private map: Map<string, T> = new Map();

  clear(): void {
    this.map.clear();
  }

  del(typeName: string): void {
    if (this.has(typeName)) {
      this.map.delete(typeName);
    }
  }

  filterValues(predicate: (T) => boolean): T[] {
    return this.values().filter(predicate);
  }

  get(typeName: string): T | undefined {
    return this.map.get(typeName);
  }

  getOrElse(typeName: string, elseFunc: () => T): T {
    const type = this.get(typeName);
    if (type) {
      return type;
    }

    return elseFunc();
  }

  has(typeName: string): boolean {
    return this.map.has(typeName);
  }

  rename(oldName: string, newName: string): boolean {
    if (this.has(newName)) {
      return false;
    }

    const value = this.get(oldName);
    if (value) {
      this.set(newName, value);
      this.del(oldName);
      return true;
    }

    return false;
  }

  set(typeName: string, value: T): void {
    this.map.set(typeName, value);
  }

  values(): T[] {
    return Array.from(this.map.values());
  }
}

const GLOBAL_TYPE_SCOPE: TypeScope<TypeBase> = new TypeScope<TypeBase>();

export abstract class TypeBase {
  constructor(
    public typeName: string,
    readonly tmplBased: boolean,
    private scope: TypeScope<TypeBase> = GLOBAL_TYPE_SCOPE
  ) {
    this.typeName = isStringDefined(typeName) ? typeName.trim() : '';

    if (isStringEmpty(this.typeName)) {
      return;
    }

    if (scope.has(this.typeName)) {
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
  static DESIRABLE = new DisplayType('desirable');
  static OPTIONAL = new DisplayType('optional');
  static READONLY = new DisplayType('readonly');
  static REQUIRED = new DisplayType('required');

  readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static create(name: string): DisplayType {
    return (
      [DisplayType.DESIRABLE, DisplayType.OPTIONAL, DisplayType.READONLY, DisplayType.REQUIRED].find(
        (type) => type.name === name
      ) || DisplayType.OPTIONAL
    );
  }

  get isRequired(): boolean {
    return this === DisplayType.REQUIRED;
  }

  get isReadonly(): boolean {
    return this === DisplayType.READONLY;
  }

  get isDesirable(): boolean {
    return this === DisplayType.DESIRABLE;
  }

  get isOptional(): boolean {
    return this === DisplayType.OPTIONAL;
  }

  get isShownByDefault(): boolean {
    return this.isRequired || this.isDesirable;
  }

  get isRemovable(): boolean {
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
  pubmedid,
  dna,
  protein
}

export abstract class ValueType {
  constructor(readonly name: ValueTypeName) {}

  is(...names: ValueTypeName[]): boolean {
    return names.includes(this.name);
  }

  isRich(): boolean {
    return this.is(ValueTypeName.dna, ValueTypeName.protein);
  }

  isText(): boolean {
    return this.is(ValueTypeName.text, ValueTypeName.largetext);
  }
}

export class TextValueType extends ValueType {
  readonly maxlength: number;
  readonly minlength: number;

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
  values: string[];
  multiple: boolean = false;

  constructor(data: Partial<SelectValueType> = {}) {
    super(ValueTypeName.select);
    this.values = data.values || [];
    this.multiple = data.multiple || false;
  }

  setValues(values: string[]): void {
    this.values = values;
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
  readonly helpText: string;
  readonly helpLink: string;
  readonly icon: string;
  readonly valueType: ValueType;

  constructor(
    name: string,
    data: Partial<FieldType> = {},
    scope?: TypeScope<TypeBase>,
    parentDisplayType: DisplayType = DisplayType.OPTIONAL
  ) {
    super(name, true, scope);

    this.valueType = ValueTypeFactory.create(data.valueType || {});
    this.icon = data.icon || 'fa-pencil-square-o';
    this.helpText = data.helpText || '';
    this.helpLink = data.helpLink || '';
    this.displayType = DisplayType.create(data.display || parentDisplayType.name);
    this.display = this.displayType.name;
  }
}

export class FeatureType extends TypeBase {
  readonly allowCustomCols: boolean;
  readonly dependency: string;
  readonly description: string;
  readonly display: string;
  readonly displayType: DisplayType;
  readonly icon: string;
  readonly singleRow: boolean;
  readonly title: string;
  readonly uniqueCols: boolean;

  private columnScope: TypeScope<ColumnType> = new TypeScope<ColumnType>();

  constructor(
    name: string,
    data?: Partial<FeatureType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true,
    parentDisplayType: DisplayType = DisplayType.OPTIONAL
  ) {
    super(name, isTemplBased, scope);

    data = data || {};
    this.title = data.title || 'Add ' + this.name;
    this.description = data.description || '';
    this.singleRow = data.singleRow === true;
    this.uniqueCols = data.uniqueCols === true;
    this.allowCustomCols = data.allowCustomCols !== false;
    this.displayType = DisplayType.create(data.display || parentDisplayType.name);
    this.display = this.displayType.name;
    this.icon = data.icon || (this.singleRow ? 'fa-list' : 'fa-th');
    this.dependency = data.dependency || '';

    (data.columnTypes || []).forEach((ct) => new ColumnType(ct.name, ct, this.columnScope));
  }

  static createDefault(
    name: string,
    singleRow?: boolean,
    uniqueCols?: boolean,
    scope?: TypeScope<TypeBase>,
    parentDisplayType?: DisplayType
  ): FeatureType {
    return new FeatureType(name, { singleRow, uniqueCols }, scope, false, parentDisplayType);
  }

  get columnTypes(): ColumnType[] {
    return this.columnScope.filterValues((ct) => ct.tmplBased);
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
  constructor(
    data?: Partial<FeatureType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true,
    parentDisplayType: DisplayType = DisplayType.OPTIONAL
  ) {
    const d = Object.assign(data || {}, { singleRow: true });
    super('Annotation', d, scope, isTemplBased, parentDisplayType);
  }
}

export class ColumnType extends TypeBase {
  readonly autosuggest: boolean;
  readonly dependencyColumn: string;
  readonly display: string;
  readonly displayType: DisplayType;
  readonly uniqueValues: boolean;
  readonly valueType: ValueType;

  constructor(
    name: string,
    data?: Partial<ColumnType>,
    scope?: TypeScope<ColumnType>,
    isTemplBased: boolean = true,
    parentDisplayType: DisplayType = DisplayType.OPTIONAL
  ) {
    super(name, isTemplBased, scope as TypeScope<TypeBase>);

    data = data || {};
    this.displayType = DisplayType.create(data.display || parentDisplayType.name);
    this.display = this.displayType.name;
    this.valueType = ValueTypeFactory.create(data.valueType || {});
    this.dependencyColumn = data.dependencyColumn || '';
    this.autosuggest = data.autosuggest !== undefined ? data.autosuggest : true;
    this.uniqueValues = data.uniqueValues || false;
  }

  static createDefault(name: string, scope?: TypeScope<ColumnType>): ColumnType {
    return new ColumnType(name, {}, scope, false);
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
  readonly annotationsType: AnnotationsType;
  readonly display: string;
  readonly displayType: DisplayType;
  readonly displayAnnotations: boolean;
  readonly featureGroups: string[][];
  readonly minRequired: number;
  readonly sectionExample: string;

  private featureScope: TypeScope<FeatureType> = new TypeScope<FeatureType>();
  private fieldScope: TypeScope<FieldType> = new TypeScope<FieldType>();
  private sectionScope: TypeScope<SectionType> = new TypeScope<SectionType>();

  constructor(
    name: string,
    data?: Partial<SectionType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true,
    parentDisplayType: DisplayType = DisplayType.OPTIONAL
  ) {
    super(name, isTemplBased, scope);

    data = data || {};
    this.displayType = DisplayType.create(data.display || parentDisplayType.name);
    this.display = this.displayType.name;
    this.displayAnnotations = data.displayAnnotations || false;
    this.featureGroups = (data.featureGroups || []).filter((gr) => !isArrayEmpty(gr));
    this.minRequired = data.minRequired || 1;
    this.annotationsType = new AnnotationsType(
      data.annotationsType,
      new TypeScope<AnnotationsType>(),
      isTemplBased,
      this.displayType
    );
    this.sectionExample = data.sectionExample || '';

    (data.fieldTypes || []).forEach(
      (fieldType) => new FieldType(fieldType.name, fieldType, this.fieldScope, this.displayType)
    );
    (data.featureTypes || []).forEach(
      (featureType) => new FeatureType(featureType.name, featureType, this.featureScope, isTemplBased, this.displayType)
    );
    (data.sectionTypes || []).forEach(
      (sectionType) => new SectionType(sectionType.name, sectionType, this.sectionScope, isTemplBased, this.displayType)
    );
  }

  static createDefault(name: string, scope?: TypeScope<TypeBase>, parentDisplayType?: DisplayType): SectionType {
    return new SectionType(name, {}, scope, false, parentDisplayType);
  }

  get fieldTypes(): FieldType[] {
    return this.fieldScope.filterValues((ft) => ft.tmplBased);
  }

  get featureTypes(): FeatureType[] {
    return this.featureScope.filterValues((ft) => ft.tmplBased);
  }

  get sectionTypes(): SectionType[] {
    return this.sectionScope.filterValues((st) => st.tmplBased);
  }

  getFeatureType(name: string, singleRow: boolean = false, uniqueCols: boolean = false): FeatureType {
    return this.featureScope.getOrElse(name, () =>
      FeatureType.createDefault(name, singleRow, uniqueCols, this.featureScope, this.displayType)
    );
  }

  getFieldType(name: string): FieldType | undefined {
    return this.fieldScope.get(name);
  }

  getSectionType(name: string): SectionType {
    return this.sectionScope.getOrElse(name, () =>
      SectionType.createDefault(name, this.sectionScope, this.displayType)
    );
  }

  sectionType(names: string[]): any {
    if (names.length > 1) {
      const types = this.sectionTypes.map((s) => s.sectionType(names.slice(1))).filter((t) => t !== undefined);

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
  readonly display: string = DisplayType.OPTIONAL.name;
  readonly sectionType: SectionType;

  // tslint:disable-next-line: variable-name
  constructor(_name: string, typeObj: SubmissionType, scope?: TypeScope<TypeBase>) {
    super('Submission', true, scope);

    if (typeObj.sectionType === undefined) {
      throw Error('sectionType is not defined in the template');
    }

    this.sectionType = new SectionType(
      typeObj.sectionType.name,
      typeObj.sectionType,
      new TypeScope<TypeBase>(),
      true,
      DisplayType.create(typeObj.display)
    );
  }

  static defaultType(): SubmissionType {
    return SubmissionType.fromEmptyTemplate();
  }

  static fromEmptyTemplate(): SubmissionType {
    return SubmissionType.fromTemplate(EMPTY_TEMPLATE_NAME);
  }

  static fromTemplate(tmplName: string): SubmissionType {
    const tmpl = findSubmissionTemplateByName(tmplName);
    return new SubmissionType('Submission', tmpl, new TypeScope<TypeBase>());
  }
}

export function invalidateGlobalScope(): void {
  GLOBAL_TYPE_SCOPE.clear();
}
