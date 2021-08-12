import { ExtAttributeType, ExtCollection } from 'app/submission/submission-shared/model/ext-submission-types';
import { TableType } from './../templates/submission-type.model';
import { isDefinedAndNotEmpty, isArrayEmpty, arrayUniqueValues, isStringDefined } from 'app/utils';
import { nextId } from './submission.model.counter';
import { Attribute } from './submission.model.attribute';
import { ValueMap } from './submission.model.valuemap';
import { Columns } from './submission.model.columns';
import { AccessTag, NameValueType, Tag, TaggedData } from '../submission-common-types';
import { DisplayType, FieldType, SectionType, SubmissionType, ValueType } from '../templates';
import { AttributeValue } from './submission.model.attribute-value';

// export interface SubmissionSection {
//   subsections: Sections;
// }

class Rows {
  private rows: Array<ValueMap> = [];

  constructor(private capacity: number = -1) {}

  add(keys: string[]): ValueMap {
    if (this.isFull()) {
      throw new Error(`Can not add more than ${this.capacity} row(s) to a table`);
    }

    const row = new ValueMap(keys);
    this.rows.push(row);

    return row;
  }

  addKey(key: string): void {
    this.rows.forEach((r) => {
      r.add(key);
    });
  }

  at(index: number): ValueMap | undefined {
    return index >= 0 && index < this.rows.length ? this.rows[index] : undefined;
  }

  list(): Array<ValueMap> {
    return this.rows.slice();
  }

  patchRows(rows: Array<ValueMap>): void {
    this.rows = rows;
  }

  removeAt(index: number): boolean {
    if (index < 0 || index > this.rows.length) {
      return false;
    }

    const tempRows = this.rows.slice();
    tempRows.splice(index, 1);

    this.rows = tempRows;

    return true;
  }

  removeKey(key: string): void {
    this.rows.forEach((r) => {
      r.remove(key);
    });
  }

  size(): number {
    return this.rows.length;
  }

  private isFull(): boolean {
    return this.capacity > 0 && this.rows.length === this.capacity;
  }
}

type TableGroup = Table[];

export class Table {
  readonly dependency;
  readonly groups: TableGroup[] = [];
  readonly id: string;
  readonly type: TableType;

  private tableColumns: Columns;
  private tableRows: Rows;

  constructor(type: TableType, data: TableData = {} as TableData) {
    this.id = `table${nextId()}`;
    this.type = type;
    this.tableColumns = new Columns();
    this.tableRows = new Rows(type.singleRow ? 1 : undefined);
    this.dependency = type.dependency;

    type.columnTypes
      .filter((ct) => ct.isRequired || ct.isDesirable)
      .forEach((ct) => {
        this.addColumn(
          ct.name,
          ct.valueType,
          ct.displayType,
          true,
          ct.dependencyColumn,
          ct.uniqueValues,
          ct.autosuggest
        );
      });

    (data.entries || []).forEach((entry) => {
      this.add(entry);
    });

    if (type.displayType.isShownByDefault && this.isEmpty) {
      this.addRow();
    }
  }

  static create(type: TableType, attrs: AttributeData[]): Table {
    return new Table(type, { type: type.name, entries: [attrs] });
  }

  get columns(): Attribute[] {
    return this.tableColumns.list();
  }

  get colNames(): string[] {
    return this.tableColumns.names();
  }

  get isEmpty(): boolean {
    return this.rowSize() === 0;
  }

  get typeName(): string {
    return this.type.name;
  }

  set typeName(val: string) {
    this.type.name = val;
  }

  get rows(): ValueMap[] {
    return this.tableRows.list();
  }

  get readonly(): boolean {
    return this.type.displayType.isReadonly;
  }

  get singleRow(): boolean {
    return this.type.singleRow;
  }

  get uniqueCols(): boolean {
    return this.type.uniqueCols;
  }

  add(attributes: AttributeData[] = [], rowIdx?: number): void {
    if (isArrayEmpty(attributes)) {
      return;
    }

    const rowMap = this.getOrCreateRow(rowIdx);
    if (rowMap === undefined) {
      throw new Error(`Can't add new row to ${this.typeName}: ${attributes.map((at) => at.name).join(',')}`);
    }

    const attrsWithName = attributes.filter((attr) => isDefinedAndNotEmpty(attr.name));
    const newColNames = attrsWithName.map((attr) => attr.name!);
    const existedColNames = this.tableColumns.names();

    arrayUniqueValues(newColNames).forEach((colName) => {
      const colType = this.type.getColumnType(colName);
      const requiredColCount = newColNames.filter((name) => name === colName).length;

      if (colType) {
        let colCount = existedColNames.filter((name) => name === colName).length;
        while (colCount < requiredColCount) {
          this.addColumn(colName, colType.valueType, colType.displayType);
          colCount++;
        }
      }

      const attrs = attrsWithName.filter((attr) => attr.name === colName);
      const columns = this.tableColumns.filterByName(colName);

      columns.forEach((column, index) => {
        const rowValue: AttributeValue = rowMap.valueFor(column.id);

        if (rowValue) {
          rowValue.value = (attrs[index].value || '') as string;
        }
      });
    });
  }

  addColumn(
    name?: string,
    valueType?: ValueType,
    displayType?: DisplayType,
    isTemplateBased: boolean = false,
    dependencyColumn: string = '',
    uniqueValues: boolean = false,
    autosuggest: boolean = true
  ): Attribute {
    const defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + (this.tableColumns.size() + 1);
    const colName = name || defColName;
    const col = new Attribute(
      colName,
      valueType,
      displayType,
      isTemplateBased,
      dependencyColumn,
      uniqueValues,
      autosuggest
    );
    this.tableRows.addKey(col.id);
    this.tableColumns.add(col);

    return col;
  }

  addRow(): ValueMap {
    return this.tableRows.add(this.tableColumns.keys());
  }

  attributeValuesForColumn(columnId: string): (AttributeValue | undefined)[] {
    return this.tableRows.list().map((row) => row.valueFor(columnId));
  }

  canAddRow(): boolean {
    return !this.singleRow || this.rowSize() === 0;
  }

  colSize(): number {
    return this.tableColumns.size();
  }

  findColumnById(columnId: string): Attribute | undefined {
    return this.tableColumns.findById(columnId);
  }

  findColumnByName(name: string): Attribute | undefined {
    return this.tableColumns.findByName(name);
  }

  patchRows(rows: ValueMap[]): void {
    this.tableRows.patchRows(rows);
  }

  removeColumn(id: string): boolean {
    this.tableColumns.remove(id);
    this.tableRows.removeKey(id);
    return true;
  }

  removeRowAt(index: number): boolean {
    return this.tableRows.removeAt(index);
  }

  rowSize(): number {
    return this.tableRows.size();
  }

  private getOrCreateRow(rowIdx?: number): ValueMap | undefined {
    return rowIdx === undefined ? this.addRow() : this.tableRows.at(rowIdx);
  }
}

export class Tables {
  private tables: Table[] = [];

  constructor(type: SectionType, tables: Array<TableData> = []) {
    const fd = tables
      .filter((f) => isDefinedAndNotEmpty(f.type))
      .reduce((rv, d) => {
        rv[d.type!] = d;
        return rv;
      }, {});

    type.tableTypes.forEach((ft) => {
      this.add(ft, fd[ft.name]);
      fd[ft.name] = undefined;
    });

    Object.keys(fd).forEach((key) => {
      if (fd[key] !== undefined) {
        const ft = type.getTableType(key);
        this.add(ft, fd[ft.name]);
      }
    });

    type.tableGroups.forEach((group) => {
      const tableGroup = this.tables.filter((f) => group.includes(f.typeName));
      tableGroup.forEach((f) => f.groups.push(tableGroup));
      const rowCount = tableGroup.map((f) => f.rowSize()).reduce((rv, v) => rv + v, 0);
      if (rowCount === 0) {
        tableGroup.forEach((fGroup) => fGroup.addRow());
      }
    });
  }

  get length(): number {
    return this.tables.length;
  }

  add(type: TableType, data?: TableData): Table | undefined {
    if (this.tables.filter((f) => f.type === type).length > 0) {
      return;
    }

    const table = new Table(type, data);
    this.tables.push(table);

    return table;
  }

  /**
   * Retrieves the table object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param value - Value of the required table's property.
   * @param [property = 'id'] - Property name by which tables are looked up.
   * @returns Table fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Table | undefined {
    return this.tables.find((table) => table[property] === value);
  }

  findByType(value: string): Table | undefined {
    return this.tables.find((table) => table.typeName.toLocaleLowerCase() === value.toLocaleLowerCase());
  }

  list(): Table[] {
    return this.tables.slice();
  }

  remove(table: Table): boolean {
    if (table.type.tmplBased) {
      return false;
    }
    const index = this.tables.indexOf(table);
    if (index < 0) {
      return false;
    }
    this.tables.splice(index, 1);

    table.type.destroy();
    return true;
  }

  removeById(tableId: string): boolean {
    const table = this.tables.find((f) => f.id === tableId);
    return table !== undefined && this.remove(table);
  }
}

export class Field {
  readonly id: string;
  readonly type: FieldType;

  private fieldValue: string;

  constructor(type: FieldType, value: string = '') {
    this.id = `field_${nextId()}`;
    this.type = type;
    this.fieldValue = value;
  }

  get name(): string {
    return this.type.name;
  }

  get title(): string {
    return this.type.title;
  }

  get valueType(): ValueType {
    return this.type.valueType;
  }

  get readonly(): boolean {
    return this.type.displayType.isReadonly;
  }

  get value(): string {
    return this.fieldValue;
  }

  set value(v: string) {
    if (this.fieldValue !== v) {
      this.fieldValue = v;
    }
  }
}

export class Fields {
  private fields: Field[];

  constructor(type: SectionType, attributes: Array<AttributeData> = []) {
    this.fields = [];

    const attrMap = attributes
      .filter((at) => isStringDefined(at.name))
      .reduce((rv, attr) => {
        rv[attr.name!] = attr.value;
        return rv;
      }, {});

    type.fieldTypes.forEach((fieldType) => {
      this.add(fieldType, attrMap[fieldType.name] || '');
    });
  }

  get length(): number {
    return this.fields.length;
  }

  /**
   * Retrieves the field object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param value - Value of the required field's property.
   * @param [property = 'id'] - Property name by which fields are looked up.
   * @returns Field fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Field | undefined {
    return this.fields.find((field) => field[property] === value);
  }

  list(): Field[] {
    return this.fields.slice();
  }

  private add(type: FieldType, value?: string): void {
    const field = new Field(type, value);
    this.fields.push(field);
  }
}

// export class Section implements SubmissionSection {
export class Section {
  readonly annotations: Table;
  readonly data: SectionData;
  readonly tables: Tables;
  readonly fields: Fields;
  readonly id: string;
  readonly sections: Sections;
  readonly tags: Tags;
  readonly type: SectionType;

  private sectionAccno: string;

  constructor(type: SectionType, data: SectionData = {} as SectionData, accno: string = '') {
    this.tags = Tags.create(data);
    this.id = `section_${nextId()}`;
    this.type = type;
    this.sectionAccno = data.accno || accno;
    this.fields = new Fields(type, data.attributes);
    // Any attribute names from the server that do not match top-level field names are added as annotations.
    this.annotations = Table.create(
      type.annotationsType,
      (data.attributes || []).filter(
        (attribute) =>
          attribute.name && attribute.name !== 'Keyword' && type.getFieldType(attribute.name || '') === undefined
      )
    );
    this.data = data;
    this.tables = new Tables(type, data.tables);
    this.sections = new Sections(type, data.sections);
  }

  get accno(): string {
    return this.sectionAccno;
  }

  set accno(accno: string) {
    this.sectionAccno = accno;
  }

  get typeName(): string {
    return this.type.name;
  }

  set typeName(name: string) {
    this.type.name = name;
  }

  get readonly(): boolean {
    return this.type.displayType.isReadonly;
  }

  get displayAnnotations(): boolean {
    return this.type.displayAnnotations;
  }

  isRequired(): boolean {
    return this.type.displayType.isRequired;
  }

  sectionPath(id: string): Section[] {
    if (id === this.id) {
      return [this];
    }
    const path = this.sections
      .list()
      .map((s) => s.sectionPath(id))
      .filter((p) => p.length > 0);

    return path.length > 0 ? ([] as Section[]).concat([this], path[0]) : [];
  }
}

export class Sections {
  private nextIdx: number = 0;
  private sections: Section[];

  /* Fills in existed data if given. Data with types defined in the template goes first. */
  constructor(type: SectionType, sections: Array<SectionData> = []) {
    this.sections = [];

    type.sectionTypes.forEach((st) => {
      const sd = sections.filter((s) => s.type === st.name);
      sd.forEach((d) => {
        this.add(st, d);
      });

      if (st.displayType.isShownByDefault && sd.length < st.minRequired) {
        Array(st.minRequired - sd.length)
          .fill(0)
          .forEach(() => this.add(st, {}));
      }
    });

    const definedTypes = type.sectionTypes.map((t) => t.name);
    sections
      .filter((sd) => sd.type === undefined || !definedTypes.includes(sd.type))
      .forEach((sd) => {
        const accno = sd.accno;
        this.add(type.getSectionType(sd.type || 'UnknownSectionType'), sd, accno);
      });
  }

  get length(): number {
    return this.sections.length;
  }

  add(type: SectionType, data?: SectionData, accno?: string): Section {
    const s = new Section(type, data, accno || type.name + '-' + ++this.nextIdx);
    this.sections.push(s);
    return s;
  }

  byType(typeName: string): Section[] {
    return this.sections.filter((section) => {
      return section.type.name === typeName;
    });
  }

  list(): Section[] {
    return this.sections.slice();
  }

  remove(section: Section): boolean {
    const sections = this.sections;
    const index = sections.indexOf(section);

    if (index >= 0) {
      sections.splice(index, 1);
      return true;
    }
    return false;
  }

  removeById(sectionId: string): boolean {
    const section = this.sections.find((s) => s.id === sectionId);
    return section !== undefined ? this.remove(section) : false;
  }
}

export class Submission {
  accno: string | null;
  readonly attributes: AttributeData[];
  isRevised: boolean; // true if submission has been sent and is marked as revised by PageTab class.
  readonly section: Section;
  readonly tags: Tags;
  readonly type;
  readonly collections: ExtCollection[];

  /**
   * Creates a new submission from extended-formatted data and pre-defined type definitions.
   * @see {@link PageTab}
   * @param type Type definitions object
   * @param data Submission data in extended format.
   */
  constructor(type: SubmissionType, data: SubmissionData = {} as SubmissionData) {
    this.tags = Tags.create(data);
    this.type = type;
    this.accno = data.accno || null;
    this.attributes = data.attributes || [];
    this.isRevised = !this.isTemp && data.isRevised === true;
    this.section = new Section(type.sectionType, data.section);
    this.collections = data.collections || [];
  }

  /**
   * Determines if the current submission is a temporary one by probing its accession number's format
   * @returns True if the submission is temporary.
   */
  get isTemp(): boolean {
    return this.accno === null || this.accno.length === 0 || this.accno.indexOf('TMP') === 0;
  }

  sectionPath(id: string): Section[] {
    return this.section.sectionPath(id);
  }
}

export class Tags {
  private innerAccessTags: string[];
  private innerTags: Tag[];

  constructor(tags: Tag[] = [], accessTags: AccessTag[] = []) {
    this.innerTags = tags.slice();
    this.innerAccessTags = accessTags.map((accessTag) => accessTag.name);
  }

  static create(data?: TaggedData): Tags {
    if (data !== undefined) {
      return new Tags(data.tags, data.accessTags);
    }
    return new Tags();
  }

  get tags(): any[] {
    return this.innerTags.map((t) => Object.assign({}, t));
  }

  get accessTags(): string[] {
    return this.innerAccessTags.slice();
  }
}

export interface AttributeData extends ExtAttributeType {
  name: string;
  nameAttrs?: NameValueType[];
  reference?: boolean;
  terms?: NameValueType[];
  value?: string | string[];
  valueAttrs?: NameValueType[];
}

export interface TableData {
  entries?: AttributeData[][];
  type?: string;
}

export interface SectionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  tables?: TableData[];
  sections?: SectionData[];
  subsections?: SectionData[];
  type?: string;
}

export interface SubmissionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  collections?: ExtCollection[];
  isRevised?: boolean;
  section?: SectionData;
}
