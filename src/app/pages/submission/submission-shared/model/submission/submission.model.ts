import { zip } from 'fp-ts/lib/Array';
import { nextId } from './submission.model.counter';
import { Attribute } from './submission.model.attribute';
import { ValueMap } from './submission.model.valuemap';
import { Columns } from './submission.model.columns';
import { NameAndValue, Tag } from '../model.common';
import {
  DisplayType,
  FeatureType,
  FieldType,
  SectionType,
  SubmissionType,
  ValueType
} from '../templates';

interface SubmissionSection {
  subsections: Sections
}

class Rows {
  private rows: Array<ValueMap> = [];

  constructor(private capacity: number = -1) {}

  add(keys: string[]): ValueMap {
    if (this.isFull()) {
      throw new Error(`Can not add more than ${this.capacity} row(s) to a feature`);
    }
    const row = new ValueMap(keys);
    this.rows.push(row);
    return row;
  }

  addKey(key: string) {
    this.rows.forEach(r => {
      r.add(key);
    });
  }

  at(index: number): ValueMap | undefined {
    return (index >= 0) && (index < this.rows.length) ? this.rows[index] : undefined;
  }

  list(): Array<ValueMap> {
    return this.rows.slice();
  }

  removeAt(index: number): boolean {
    if ((index < 0) || (index > this.rows.length)) {
      return false;
    }
    this.rows.splice(index, 1);
    return true;
  }

  removeKey(key: string) {
    this.rows.forEach(r => {
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

type FeatureGroup = Feature[];

export class Feature {
  readonly dependency;
  readonly groups: FeatureGroup[] = [];
  readonly id: string;
  readonly type: FeatureType;

  private _columns: Columns;
  private _rows: Rows;

  constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
    this.id = `feature_${nextId()}`;
    this.type = type;
    this._columns = new Columns();
    this._rows = new Rows(type.singleRow ? 1 : undefined);
    this.dependency = type.dependency;

    type.columnTypes
      .filter(ct => ct.isRequired || ct.isDesirable)
      .forEach(ct => {
        this.addColumn(ct.name, ct.valueType, ct.displayType, true, ct.dependencyColumn, ct.uniqueValues, ct.autosuggest);
      });

    (data.entries || []).forEach(entry => {
      this.add(entry);
    });

    if (type.displayType.isShownByDefault && this.isEmpty) {
      this.addRow();
    }
  }

  static create(type: FeatureType, attrs: AttributeData[]): Feature {
    return new Feature(type, { type: type.name, entries: [attrs] });
  }

  get columns(): Attribute[] {
    return this._columns.list();
  }

  get colNames(): string[] {
    return this._columns.names();
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
    return this._rows.list();
  }

  get singleRow(): boolean {
    return this.type.singleRow;
  }

  get uniqueCols(): boolean {
    return this.type.uniqueCols;
  }

  add(attributes: AttributeData[] = [], rowIdx?: number): void {
    if (attributes.isEmpty()) {
      return;
    }

    const rowMap = this.getOrCreateRow(rowIdx);
    if (rowMap === undefined) {
      throw new Error(`Can't add new row to ${this.typeName}: ${attributes.map(at => at.name).join(',')}`);
    }

    const attrsWithName = attributes.filter(attr => String.isDefinedAndNotEmpty(attr.name));
    const newColNames = attrsWithName.map(attr => attr.name!);

    const existedColNames = this._columns.names();

    newColNames.uniqueValues().forEach(colName => {
      const colType = this.type.getColumnType(colName);
      const requiredColCount = newColNames.filter(name => name === colName).length;
      let colCount = existedColNames.filter(name => name === colName).length;
      while (colCount < requiredColCount) {
        this.addColumn(colName, colType!.valueType, colType!.displayType);
        colCount++;
      }

      const attrs = attrsWithName.filter(attr => attr.name === colName);
      const columns = this._columns.filterByName(colName);
      zip(attrs, columns).forEach((pair) => {
        rowMap!.valueFor(pair[1].id)!.value = pair[0].value || '';
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
    const defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + (this._columns.size() + 1);
    const colName = name || defColName;
    const col = new Attribute(colName, valueType, displayType, isTemplateBased, dependencyColumn, uniqueValues, autosuggest);
    this._rows.addKey(col.id);
    this._columns.add(col);

    return col;
  }

  addRow(): ValueMap | undefined {
    if (this.canAddRow()) {
      return this._rows.add(this._columns.keys());
    }
    return undefined;
  }

  attributeValuesForColumn(columnId: string) {
    return this._rows.list().map((row) => row.valueFor(columnId));
  }

  canAddRow(): boolean {
    return (!this.singleRow || this.rowSize() === 0);
  }


  colSize(): number {
    return this._columns.size();
  }

  findColumnById(columnId: string): Attribute | undefined {
    return this._columns.findById(columnId);
  }

  removeColumn(id: string): boolean {
    this._columns.remove(id);
    this._rows.removeKey(id);
    return true;
  }

  removeRowAt(index: number): boolean {
    return this._rows.removeAt(index);
  }

  rowSize(): number {
    return this._rows.size();
  }

  private getOrCreateRow(rowIdx?: number): ValueMap | undefined {
    return (rowIdx === undefined) ? this.addRow() : this._rows.at(rowIdx);
  }
}

export class Features {
  private features: Feature[] = [];

  constructor(type: SectionType, features: Array<FeatureData> = []) {
    const fd = features.filter(f => String.isDefinedAndNotEmpty(f.type))
      .reduce((rv, d) => {
        rv[d.type!] = d;
        return rv;
      }, {});

    type.featureTypes.forEach(ft => {
      this.add(ft, fd[ft.name]);
      fd[ft.name] = undefined;
    });

    Object.keys(fd).forEach(key => {
      if (fd[key] !== undefined) {
        const ft = type.getFeatureType(key);
        this.add(ft, fd[ft.name]);
      }
    });

    type.featureGroups.forEach(group => {
      const featureGroup = this.features.filter(f => group.includes(f.typeName));
      featureGroup.forEach(f => f.groups.push(featureGroup));
      const rowCount = featureGroup.map(f => f.rowSize()).reduce((rv, v) => rv + v, 0);
      if (rowCount === 0) {
        featureGroup[0].addRow();
      }
    });
  }

  get length(): number {
    return this.features.length;
  }

  add(type: FeatureType, data?: FeatureData): Feature | undefined {
    if (this.features.filter(f => f.type === type).length > 0) {
      return;
    }

    const feature = new Feature(type, data);
    this.features.push(feature);

    return feature;
  }

  /**
   * Retrieves the feature object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param {string} value - Value of the required feature's property.
   * @param {string} [property = 'id'] - Property name by which features are looked up.
   * @returns {Feature} Feature fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Feature | undefined {
    return this.features.find((feature) => (feature[property] === value));
  }

  list(): Feature[] {
    return this.features.slice();
  }

  remove(feature: Feature): boolean {
    if (feature.type.tmplBased) {
      return false;
    }
    const index = this.features.indexOf(feature);
    if (index < 0) {
      return false;
    }
    this.features.splice(index, 1);

    feature.type.destroy();
    return true;
  }

  removeById(featureId: string): boolean {
    const feature = this.features.find(f => f.id === featureId);
    return feature !== undefined && this.remove(feature);
  }
}

export class Field {
  readonly id: string;
  readonly type: FieldType;

  private _value: string;

  constructor(type: FieldType,
        value: string = '') {
    this.id = `field_${nextId()}`;
    this.type = type;
    this._value = value;
  }

  get name(): string {
    return this.type.name;
  }

  get valueType(): ValueType {
    return this.type.valueType;
  }

  get readonly(): boolean {
    return this.type.displayType.isReadonly;
  }

  get value(): string {
    return this._value;
  }

  set value(v: string) {
    if (this._value !== v) {
      this._value = v;
    }
  }
}

export class Fields {
  private fields: Field[];

  constructor(type: SectionType, attributes: Array<AttributeData> = []) {
    this.fields = [];

    const attrMap = attributes.filter(at => String.isDefined(at.name))
      .reduce((rv, attr) => {
        rv[attr.name!] = attr.value;
        return rv;
      }, {});

    type.fieldTypes.forEach(fieldType => {
      this.add(fieldType, attrMap[fieldType.name] || '');
    });
  }

  get length(): number {
    return this.fields.length;
  }

  /**
   * Retrieves the field object that fulfills a scalar comparison with one of its property values.
   * By default, it will look for a given ID.
   * @param {string} value - Value of the required field's property.
   * @param {string} [property = 'id'] - Property name by which fields are looked up.
   * @returns {Field} Field fulfilling the predicated comparison.
   */
  find(value: string, property: string = 'id'): Field | undefined {
    return this.fields.find((field) => (field[property] === value));
  }

  list(): Field[] {
    return this.fields.slice();
  }

  private add(type: FieldType, value?: string): void {
    const field = new Field(type, value);
    this.fields.push(field);
  }
}

export class Section implements SubmissionSection {
  readonly annotations: Feature;
  readonly data: SectionData;
  readonly features: Features;
  readonly fields: Fields;
  readonly id: string;
  readonly sections: Sections;
  readonly subsections: Sections;
  readonly tags: Tags;
  readonly type: SectionType;

  private _accno: string;

  constructor(type: SectionType, data: SectionData = <SectionData>{}, accno: string = '') {
    this.tags = Tags.create(data);
    this.id = `section_${nextId()}`;
    this.type = type;
    this._accno = data.accno || accno;
    this.fields = new Fields(type, data.attributes);
    // Any attribute names from the server that do not match top-level field names are added as annotations.
    this.annotations = Feature.create(
      type.annotationsType,
      (data.attributes || []).filter((attribute) => (
        (attribute).name &&
        attribute.name !== 'Keyword' &&
        type.getFieldType(attribute.name || '') === undefined
      ))
    );
    this.data = data;
    this.features = new Features(type, data.features);
    this.sections = new Sections(type, data.sections);
    this.subsections = new Sections(type, data.subsections);
  }

  get accno(): string {
    return this._accno;
  }

  set accno(accno: string) {
    this._accno = accno;
  }

  get typeName(): string {
    return this.type.name;
  }

  set typeName(name: string) {
    this.type.name = name;
  }

  get displayName(): string {
    return `${this.type.name} ${this.type.sectionExample}`;
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
      .map(s => s.sectionPath(id))
      .filter(p => p.length > 0);

    return (path.length > 0) ? ([] as Section[]).concat([this], path[0]) : [];
  }
}

export class Sections {
  private nextIdx: number = 0;
  private sections: Section[];

  /* Fills in existed data if given. Data with types defined in the template goes first. */
  constructor(type: SectionType, sections: Array<SectionData> = []) {
    this.sections = [];

    type.sectionTypes.forEach(st => {
      const sd = sections.filter(s => s.type === st.name);
      sd.forEach(d => {
        this.add(st, d);
      });

      if (st.displayType.isShownByDefault && sd.length < st.minRequired) {
        Array(st.minRequired - sd.length).fill(0).forEach(() => this.add(st, {}));
      }
    });

    const definedTypes = type.sectionTypes.map(t => t.name);
    sections.filter(sd => sd.type === undefined || !definedTypes.includes(sd.type))
      .forEach(sd => {
        const accno = sd.accno;
        this.add(type.getSectionType(sd.type || 'UnknownSectionType'), sd, accno);
      });
  }

  get length(): number {
    return this.sections.length;
  }

  add(type: SectionType, data?: SectionData, accno?: string): Section {
    const s = new Section(type, data, accno || type.name + '-' + (++this.nextIdx));
    this.sections.push(s);
    return s;
  }

  byType(typeName: string): Section[] {
    return this.sections.filter(section => {
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

  removeById(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    return section !== undefined ? this.remove(section) : false;
  }
}

export class Submission {
  accno: string;
  readonly attributes: AttributeData[];
  isRevised: boolean; // true if submission has been sent and is marked as revised by PageTab class.
  readonly section: Section;
  readonly tags: Tags;
  readonly type;


  /**
   * Creates a new submission from PageTab-formatted data and pre-defined type definitions.
   * @see {@link PageTab}
   * @param {SubmissionType} type Type definitions object
   * @param {SubmissionData} data Submission data in PageTab format.
   */
  constructor(type: SubmissionType, data: SubmissionData = <SubmissionData>{}) {
    this.tags = Tags.create(data);
    this.type = type;
    this.accno = data.accno || '';
    this.attributes = data.attributes || [];
    this.isRevised = !this.isTemp && data.isRevised === true;
    this.section = new Section(type.sectionType, data.section);
  }

  /**
   * Determines if the current submission is a temporary one by probing its accession number's format
   * @returns {boolean} True if the submission is temporary.
   */
  get isTemp(): boolean {
    return this.accno.length === 0 || this.accno.indexOf('TMP') === 0;
  }

  sectionPath(id: string): Section[] {
    return this.section.sectionPath(id);
  }
}

export class Tags {
  private _accessTags: string[];
  private _tags: Tag[];

  constructor(tags: Tag[] = [], accessTags: string[] = []) {
    this._tags = tags.slice();
    this._accessTags = accessTags.slice();
  }

  static create(data?: TaggedData): Tags {
    if (data !== undefined) {
      return new Tags(data.tags, data.accessTags);
    }
    return new Tags();
  }

  get tags(): any[] {
    return this._tags.map(t => Object.assign({}, t));
  }

  get accessTags(): string[] {
    return this._accessTags.slice();
  }
}

export interface AttributeData {
  name?: string;
  reference?: boolean;
  terms?: NameAndValue[];
  value?: string;
}

export interface FeatureData {
  entries?: AttributeData[][];
  type?: string;
}

export interface TaggedData {
  accessTags?: string[];
  tags?: Tag[];
}

export interface SectionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  features?: FeatureData[];
  sections?: SectionData[];
  subsections?: SectionData[];
  type?: string;
}

export interface SubmissionData extends TaggedData {
  accno?: string;
  attributes?: AttributeData[];
  isRevised?: boolean;
  section?: SectionData;
}
