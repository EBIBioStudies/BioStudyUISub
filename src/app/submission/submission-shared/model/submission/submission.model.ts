import { zip } from 'fp-ts/lib/Array';
import { nextId } from './submission.model.counter';
import { Attribute } from './submission.model.attribute';
import { NameAndValue, Tag } from '../model.common';
import {
    ColumnType,
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

export class AttributeValue {
    constructor(
        public value: string = ''
    ) {
    }
}

export class ValueMap {
    private valueMap: Map<string, AttributeValue> = new Map();
    readonly id: string;

    constructor(keys?: string[]) {
        this.id = nextId();
        (keys || []).forEach(key => this.add(key));
    }

    valueFor(key: string): AttributeValue | undefined {
        return this.valueMap.get(key);
    }

    add(key: string, value?: string): void {
        if (this.valueMap.has(key)) {
            console.warn(`adding multiple values for a key:${key}`);
            return;
        }
        const v = new AttributeValue(value);
        this.valueMap.set(key, v);
    }

    remove(key: string): void {
        if (!this.valueMap.has(key)) {
            console.warn(`remove: the key '${key}' does not exist in the map`);
            return;
        }
        this.valueMap.delete(key);
    }

    values(keys?: string[]): AttributeValue[] {
        return (keys || this.keys()).map(key => this.valueMap.get(key)!);
    }

    keys(): string[] {
        return Array.from(this.valueMap.keys());
    }
}

export class Columns {
    private columns: Attribute[] = [];

    list(): Attribute[] {
        return this.columns.slice();
    }

    add(column: Attribute): void {
        this.columns.push(column);
    }

    remove(id: string): boolean {
        return this.removeAt(this.columns.findIndex(attr => attr.id === id));
    }

    removeAt(index: number): boolean {
        if (index >= 0) {
            this.columns.splice(index, 1);
            return true;
        }
        return false;
    }

    at(index: number): Attribute | undefined {
        return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
    }

    findById(id: string): Attribute | undefined {
        return this.columns.find(col => col.id === id);
    }

    findByType(colType: ColumnType): Attribute | undefined {
        return this.columns.find(col => col.name === colType.name && col.valueType === colType.valueType && col.isTemplateBased);
    }

    filterByName(name: string): Attribute[] {
        return this.columns.filter(attr => attr.name.isEqualIgnoringCase(name));
    }

    keys(): string[] {
        return this.columns.map(attr => attr.id);
    }

    names(): any {
        return this.columns.map(attr => attr.name);
    }

    size(): number {
        return this.columns.length;
    }
}

class Rows {
    private rows: Array<ValueMap> = [];

    constructor(private capacity: number = -1) {
    }

    list(): Array<ValueMap> {
        return this.rows.slice();
    }

    at(index: number): ValueMap | undefined {
        return (index >= 0) && (index < this.rows.length) ? this.rows[index] : undefined;
    }

    add(keys: string[]): ValueMap {
        if (this.isFull()) {
            throw new Error(`Can not add more than ${this.capacity} row(s) to a feature`);
        }
        const row = new ValueMap(keys);
        this.rows.push(row);
        return row;
    }

    removeAt(index: number): boolean {
        if ((index < 0) || (index > this.rows.length)) {
            return false;
        }
        this.rows.splice(index, 1);
        return true;
    }

    addKey(key: string) {
        this.rows.forEach(r => {
            r.add(key);
        });
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
    readonly id: string;
    readonly type: FeatureType;
    readonly groups: FeatureGroup[] = [];
    readonly dependency;
    private _columns: Columns;
    private _rows: Rows;

    static create(type: FeatureType, attrs: AttributeData[]): Feature {
        return new Feature(type, { type: type.name, entries: [attrs] });
    }

    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        this.id = `feature_${nextId()}`;
        this.type = type;
        this._columns = new Columns();
        this._rows = new Rows(type.singleRow ? 1 : undefined);
        this.dependency = type.dependency;

        type.columnTypes
            .filter(ct => ct.isRequired || ct.isDesirable)
            .forEach(ct => {
                this.addColumn(ct.name, ct.valueType, ct.displayType, true, ct.dependencyColumn, ct.uniqueValues);
            });

        (data.entries || []).forEach(entry => {
            this.add(entry);
        });

        if (type.displayType.isShownByDefault && this.isEmpty) {
            this.addRow();
        }
    }

    get singleRow(): boolean {
        return this.type.singleRow;
    }

    get uniqueCols(): boolean {
        return this.type.uniqueCols;
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

    get columns(): Attribute[] {
        return this._columns.list();
    }

    get colNames(): string[] {
        return this._columns.names();
    }

    rowSize(): number {
        return this._rows.size();
    }

    colSize(): number {
        return this._columns.size();
    }

    attributeValuesForColumn(columnId: string) {
        return this._rows.list().map((row) => row.valueFor(columnId));
    }

    get isEmpty(): boolean {
        return this.rowSize() === 0;
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

    private getOrCreateRow(rowIdx?: number): ValueMap | undefined {
        return (rowIdx === undefined) ? this.addRow() : this._rows.at(rowIdx);
    }

    addColumn(
        name?: string,
        valueType?: ValueType,
        displayType?: DisplayType,
        isTemplateBased: boolean = false,
        dependencyColumn: string = '',
        uniqueValues: boolean = false,
    ): Attribute {
        const defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + (this._columns.size() + 1);
        const colName = name || defColName;
        const col = new Attribute(colName, valueType, displayType, isTemplateBased, dependencyColumn, uniqueValues);
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

    canAddRow(): boolean {
        return (!this.singleRow || this.rowSize() === 0);
    }

    removeRowAt(index: number): boolean {
        return this._rows.removeAt(index);
    }

    removeColumn(id: string): boolean {
        this._columns.remove(id);
        this._rows.removeKey(id);
        return true;
    }

    findColumnById(columnId: string): Attribute | undefined {
        return this._columns.findById(columnId);
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

    list(): Feature[] {
        return this.features.slice();
    }

    add(type: FeatureType, data?: FeatureData): Feature | undefined {
        if (this.features.filter(f => f.type === type).length > 0) {
            console.error(`Feature of type ${type} already exists in the section`);
            return;
        }
        const feature = new Feature(type, data);
        this.features.push(feature);
        return feature;
    }

    removeById(featureId: string): boolean {
        const feature = this.features.find(f => f.id === featureId);
        return feature !== undefined && this.remove(feature);
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

    list(): Field[] {
        return this.fields.slice();
    }

    get length(): number {
        return this.fields.length;
    }

    private add(type: FieldType, value?: string): void {
        const field = new Field(type, value);
        this.fields.push(field);
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
}

export class Section implements SubmissionSection {
    private _accno: string;
    readonly id: string;
    readonly type: SectionType;
    readonly annotations: Feature;
    readonly fields: Fields;
    readonly features: Features;
    readonly sections: Sections;
    readonly subsections: Sections;
    readonly tags: Tags;
    readonly data: SectionData;

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
    private sections: Section[];
    private nextIdx: number = 0;

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

    list(): Section[] {
        return this.sections.slice();
    }

    add(type: SectionType, data?: SectionData, accno?: string): Section {
        const s = new Section(type, data, accno || type.name + '-' + (++this.nextIdx));
        this.sections.push(s);
        return s;
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

    byType(typeName: string): Section[] {
        return this.sections.filter(section => {
            return section.type.name === typeName;
        });
    }
}

export class Submission {
    accno: string;
    isRevised: boolean; // true if submission has been sent and is marked as revised by PageTab class.
    readonly section: Section;
    readonly type;

    readonly tags: Tags;
    readonly attributes: AttributeData[];

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
    private _tags: Tag[];
    private _accessTags: string[];

    static create(data?: TaggedData): Tags {
        if (data !== undefined) {
            return new Tags(data.tags, data.accessTags);
        }
        return new Tags();
    }

    constructor(tags: Tag[] = [], accessTags: string[] = []) {
        this._tags = tags.slice();
        this._accessTags = accessTags.slice();
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
    value?: string;
    reference?: boolean;
    terms?: NameAndValue[];
}

export interface FeatureData {
    type?: string;
    entries?: AttributeData[][];
}

export interface TaggedData {
    tags?: Tag[];
    accessTags?: string[];
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
