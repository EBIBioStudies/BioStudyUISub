import { EMPTY_TEMPLATE_NAME, findTemplateByName } from './submission.templates';
import { isStringDefined, isStringEmpty } from 'app/utils/validation.utils';
import { isArrayEmpty } from 'app/utils/validation.utils';
import { LowerCaseSectionNames } from 'app/submission/utils/constants';
import { DocItem } from '../../../submission-edit/field-docs-modal/field-docs-modal.component';

/*
 *  Type scopes are used to check if the types with a given name already exists in the scope
 *  (SubmissionScope, SectionScope, TableScope, FieldsScope.. etc.). Each type must be in a scope.
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
    private scope: TypeScope<TypeBase> = GLOBAL_TYPE_SCOPE,
    public typeTitle?: string
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

  get title(): string {
    return this.typeTitle || '';
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

  static create(name: string | undefined): DisplayType {
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

export interface BannerType {
  readonly src: string;
  readonly alt: string;
  readonly backgroundColor: string;
  readonly contactUs: { text: string; email: string };
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
  protein,
  org
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
  readonly placeholder: string;

  constructor(data: Partial<TextValueType> = {}, valueTypeName?: ValueTypeName) {
    super(valueTypeName || ValueTypeName.text);
    this.minlength = data.minlength || -1;
    this.maxlength = data.maxlength || -1;
    this.placeholder = data.placeholder || '';
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
  enableValueAdd: boolean = true;

  constructor(data: Partial<SelectValueType> = {}) {
    super(ValueTypeName.select);
    this.values = data.values || [];
    this.multiple = data.multiple || false;
    this.enableValueAdd = data.enableValueAdd !== false;
  }

  setValues(values: string[]): void {
    this.values = values;
  }
}

export class OrgSelectValueType extends ValueType {
  multiple: boolean = false;

  constructor(data: Partial<SelectValueType> = {}) {
    super(ValueTypeName.org);
    this.multiple = data.multiple || false;
  }
}

export class FileValueType extends ValueType {
  readonly allowFolders: boolean;

  constructor(data: Partial<FileValueType> = {}) {
    super(ValueTypeName.file);
    this.allowFolders = data.allowFolders === undefined ? true : data.allowFolders;
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
      case ValueTypeName.org:
        return new OrgSelectValueType(data);
      case ValueTypeName.file:
        return new FileValueType(data);
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
  readonly asyncValueValidatorName: string | null;
  readonly helpContextual?: DocItem;
  readonly defaultValue?: string;

  constructor(
    name: string,
    parentSectionType: SectionType,
    data: Partial<FieldType> = {},
    scope?: TypeScope<TypeBase>,
    title?: string
  ) {
    super(name, true, scope, title);

    this.valueType = ValueTypeFactory.create(data.valueType || {});
    this.icon = data.icon || 'fa-pencil-square-o';
    this.helpText = data.helpText || '';
    this.helpLink = data.helpLink || '';
    this.displayType = DisplayType.create(data.display || parentSectionType.displayType.name);
    this.display = this.displayType.name;
    this.asyncValueValidatorName = data.asyncValueValidatorName || null;
    this.helpContextual = data.helpContextual
      ? {
          fieldName: data.title || data.name,
          ...data.helpContextual
        }
      : undefined;
    this.defaultValue = data.defaultValue;
  }
}

export class TableType extends TypeBase {
  readonly allowCustomCols: boolean;
  readonly description: string;
  readonly display: string;
  readonly displayType: DisplayType;
  readonly icon: string;
  readonly singleRow: boolean;
  readonly uniqueCols: boolean;
  readonly rowAsSection: boolean;
  readonly parentSectionType: SectionType;

  readonly allowImport: boolean;

  private columnScope: TypeScope<ColumnType> = new TypeScope<ColumnType>();

  constructor(
    name: string,
    parentSectionType: SectionType,
    data?: Partial<TableType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true,
    title?: string
  ) {
    super(name, isTemplBased, scope, title);

    data = data || {};
    this.parentSectionType = parentSectionType;
    this.description = data.description || '';
    this.singleRow = data.singleRow === true;
    this.uniqueCols = data.uniqueCols === true;
    this.allowCustomCols = data.allowCustomCols !== false;
    this.displayType = DisplayType.create(data.display || parentSectionType.displayType.name);
    this.display = this.displayType.name;
    this.icon = data.icon || (this.singleRow ? 'fa-list' : 'fa-th');
    this.allowImport = data.allowImport === true;
    this.rowAsSection = data.rowAsSection === true;

    (data.columnTypes || []).forEach((ct) => new ColumnType(ct.name, parentSectionType, ct, this.columnScope));
  }

  static createDefault(
    name: string,
    parentSectionType: SectionType,
    singleRow?: boolean,
    uniqueCols?: boolean,
    scope?: TypeScope<TypeBase>
  ): TableType {
    return new TableType(name, parentSectionType,{ singleRow, uniqueCols }, scope, false);
  }

  get columnTypes(): ColumnType[] {
    return this.columnScope.filterValues((ct) => ct.tmplBased);
  }

  getColumnType(name: string, createDefault: boolean = true): ColumnType | undefined {
    if (this.columnScope.has(name)) {
      return this.columnScope.get(name);
    }

    if (createDefault) {
      return ColumnType.createDefault(name, this.parentSectionType, this.columnScope);
    }

    return undefined;
  }
}

export class AnnotationsType extends TableType {
  constructor(
    parentSectionType: SectionType,
    data?: Partial<TableType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true
  ) {
    const annotationData = Object.assign(data || {}, { singleRow: true });
    super(
      LowerCaseSectionNames.ANNOTATIONS,
      parentSectionType,
      annotationData,
      scope,
      isTemplBased,
      annotationData.title
    );
  }
}

export class ColumnType extends TypeBase {
  readonly autosuggest: boolean;
  readonly dependency?: DependencyTypeTable | DependencyTypeSection;
  readonly display: string;
  readonly displayType: DisplayType;
  readonly uniqueValues: boolean;
  readonly valueType: ValueType;
  readonly helpText: string;
  readonly helpLink: string;
  readonly helpContextual?: DocItem;

  constructor(
    name: string,
    parentSectionType: SectionType,
    data?: Partial<ColumnType>,
    scope?: TypeScope<ColumnType>,
    isTemplBased: boolean = true
  ) {
    super(name, isTemplBased, scope as TypeScope<TypeBase>);

    data = data || {};
    this.displayType = DisplayType.create(data.display || parentSectionType.displayType.name);
    this.display = this.displayType.name;
    this.valueType = ValueTypeFactory.create(data.valueType || {});
    this.autosuggest = data.autosuggest !== undefined ? data.autosuggest : true;
    this.uniqueValues = data.uniqueValues || false;
    this.helpText = data.helpText || '';
    this.helpLink = data.helpLink || '';
    this.dependency = data.dependency;
    this.helpContextual = data.helpContextual
      ? {
          fieldName: data.title || data.name,
          ...data.helpContextual
        }
      : undefined;
  }

  static createDefault(name: string, parentSectionType: SectionType, scope?: TypeScope<ColumnType>): ColumnType {
    return new ColumnType(name, parentSectionType, {}, scope, false);
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
  readonly tableGroups: string[][];
  readonly minRequired: number;
  readonly sectionExample: string;
  readonly banner?: BannerType;

  private tableScope: TypeScope<TableType> = new TypeScope<TableType>();
  private fieldScope: TypeScope<FieldType> = new TypeScope<FieldType>();
  private sectionScope: TypeScope<SectionType> = new TypeScope<SectionType>();

  constructor(
    name: string,
    data?: Partial<SectionType>,
    scope?: TypeScope<TypeBase>,
    isTemplBased: boolean = true,
    parentSectionType?: SectionType
  ) {
    super(name, isTemplBased, scope);
    data = data || {};

    /**
     * SectionType attribute precedence is:
     *  1. explicitly defined value (what comes in data)
     *  2. what the parent has (recursive case)
     *  3. explicit default for the root SectionType
     */
    this.displayType = DisplayType.create(
      data.display ||
      parentSectionType?.displayType?.name
    );
    // just OR short-circuit would pick 'any true between parent and this',
    //  as opposed to 'whatever this has set if defined, otherwise parent, otherwise false'
    //  so if parent had true but this (explicitly) had false, it would still evaluate to true
    this.displayAnnotations = data.displayAnnotations !== undefined ? data.displayAnnotations :
      parentSectionType?.displayAnnotations !== undefined ? parentSectionType.displayAnnotations :
      false;

    this.display = this.displayType.name;
    this.tableGroups = (data.tableGroups || []).filter((gr) => !isArrayEmpty(gr));
    this.minRequired = Number.isInteger(data.minRequired) ? Number(data.minRequired) : 1;
    this.annotationsType = new AnnotationsType(
      this,
      data.annotationsType,
      new TypeScope<AnnotationsType>(),
      isTemplBased
    );
    this.sectionExample = data.sectionExample || '';
    this.banner = data.banner;

    (data.fieldTypes || []).forEach(
      (fieldType) => new FieldType(fieldType.name, this, fieldType, this.fieldScope, fieldType.title)
    );
    (data.tableTypes || []).forEach(
      (tableType) =>
        new TableType(tableType.name, this, tableType, this.tableScope, isTemplBased, tableType.title)
    );
    (data.sectionTypes || []).forEach(
      (sectionType) => new SectionType(sectionType.name, sectionType, this.sectionScope, isTemplBased, this)
    );
  }

  static createDefault(name: string, scope?: TypeScope<TypeBase>, parentSectionType?: SectionType): SectionType {
    return new SectionType(name, {}, scope, false, parentSectionType);
  }

  get fieldTypes(): FieldType[] {
    return this.fieldScope.filterValues((ft) => ft.tmplBased);
  }

  get tableTypes(): TableType[] {
    return this.tableScope.filterValues((ft) => ft.tmplBased);
  }

  get sectionTypes(): SectionType[] {
    return this.sectionScope.filterValues((st) => st.tmplBased);
  }

  getTableType(name: string, singleRow: boolean = false, uniqueCols: boolean = false): TableType {
    return this.tableScope.getOrElse(name, () =>
      TableType.createDefault(name, this, singleRow, uniqueCols, this.tableScope)
    );
  }

  getFieldType(name: string): FieldType | undefined {
    return this.fieldScope.get(name);
  }

  getSectionType(name: string): SectionType {
    return this.sectionScope.getOrElse(name, () =>
      SectionType.createDefault(name, this.sectionScope, this)
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
      undefined
    );
  }

  static defaultType(): SubmissionType {
    return SubmissionType.fromEmptyTemplate();
  }

  static fromEmptyTemplate(): SubmissionType {
    return SubmissionType.fromTemplate(EMPTY_TEMPLATE_NAME);
  }

  static fromTemplate(tmplName: string): SubmissionType {
    const tmpl = findTemplateByName(tmplName);
    return new SubmissionType('Submission', tmpl, new TypeScope<TypeBase>());
  }
}

export function invalidateGlobalScope(): void {
  GLOBAL_TYPE_SCOPE.clear();
}

export interface DependencyTypeSection {
  field_name: string;
  section_type: string;
  type: 'section';
}

export interface DependencyTypeTable {
  column_name: string;
  table_name: string;
  type: 'table';
}
