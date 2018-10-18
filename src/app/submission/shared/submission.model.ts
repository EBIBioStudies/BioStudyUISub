import {
    DisplayType,
    FeatureType,
    FieldType,
    SectionType,
    SubmissionType,
    ValueType,
    ValueTypeFactory
} from './submission-type.model';

import {NameAndValue, Tag} from './model.common';
import {zip} from 'fp-ts/lib/Array';

const nextId = (function () {
    let count = 0;
    return function () {
        return `id${count++}`;
    }
})();

export class Attribute {
    readonly id: string;

    constructor(private _name: string = '',
                readonly valueType: ValueType = ValueTypeFactory.DEFAULT,
                readonly displayType: DisplayType = DisplayType.Optional,
                readonly isTemplateBased: boolean = false) {
        this.id = `attr_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (this.canEditName && this._name !== name) {
            this._name = name;
        }
    }

    get canEditName(): boolean {
        return !this.isTemplateBased;
    }
}

export class AttributeValue {
    constructor(private _value: string = '') {
    }

    set value(value: string) {
        if (this.value !== value) {
            this._value = value;
        }
    }

    get value(): string {
        return this._value;
    }
}

export class ValueMap {
    private valueMap: Map<string, AttributeValue> = new Map();

    constructor(keys?: string[]) {
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
    private _nextIndex: number = 0;

    get nextIndex(): number {
        return ++this._nextIndex;
    }

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

    allWithName(name: string): Attribute[] {
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

export class Rows {
    private rows: ValueMap[] = [];

    list(): ValueMap[] {
        return this.rows.slice();
    }

    at(index: number): ValueMap | undefined {
        return (index >= 0) && (index < this.rows.length) ? this.rows[index] : undefined;
    }

    add(keys: string[]): ValueMap {
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
}

type Rule<T> = (t: T) => boolean;

function productOf<T>(...rules: Rule<T>[]): Rule<T> {
    return (t: T) => {
        return rules.every(r => r(t));
    };
}

function sumOf<T>(...rules: Rule<T>[]): Rule<T> {
    return (t: T) => {
        return rules.some(r => r(t));
    };
}

const CanRemoveRow: Rule<Feature> = productOf(
    (f: Feature) => !f.type.displayType.isReadonly,
    sumOf(
        (f: Feature) => !f.type.displayType.isShownByDefault,
        (f: Feature) => f.rowSize() > 1));

const CanAddRow: Rule<Feature> = productOf(
    (f: Feature) => !f.type.displayType.isReadonly,
    sumOf((f: Feature) => !f.singleRow,
        (f: Feature) => f.rowSize() === 0));

type FeatureGroup = Feature[];

export class Feature {
    readonly id: string;
    readonly type: FeatureType;
    readonly groups: FeatureGroup[] = [];

    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    static create(type: FeatureType, attrs: AttributeData[]): Feature {
        return new Feature(type,
            {
                type: type.name,
                entries: [attrs]
            });
    }

    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        this.id = `feature_${nextId()}`;
        this.type = type;
        this.groups = [[this]];

        type.columnTypes.filter(ct => ct.isRequired || ct.isDesirable)
            .forEach(ct => {
                this.addColumn(ct.name, ct.valueType, ct.displayType, true);
            });

        (data.entries || []).forEach(entry => {
            this.add(entry);
        });

        if (type.displayType.isShownByDefault && this.rows.isEmpty()) {
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

    size(): number {
        return this.singleRow ? this.colSize() : this.rowSize();
    }

    /**
     * // TODO move these to the component | pipe .. etc
     * Splits a given camel-cased name into words.
     * @param {string} Name of the feature.
     * @returns {string} Separated words.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    splitName(name: string): string {
        return name.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    add(attributes: AttributeData[] = [], rowIdx?: number): void {
        if (attributes.isEmpty()) {
            return;
        }

        let rowMap = this.getOrCreateRow(rowIdx);
        if (rowMap === undefined) {
            throw new Error(`Can't add new row to ${this.typeName}: ${attributes.map(at=>at.name).join(',')}`);
        }

        const attrsWithName = attributes.filter(attr => String.isDefinedAndNotEmpty(attr.name));
        const newColNames = attrsWithName.map(attr => attr.name!);

        const existedColNames = this._columns.names();

        newColNames.uniqueValues().forEach(colName => {
            const colType = this.type.getColumnType(colName);
            const requiredColCount = newColNames.filter(name => name === colName).length;
            let colCount = existedColNames.filter(name => name === colName).length;
            while (colCount < requiredColCount) {
                const col = this.addColumn(colName, colType!.valueType, colType!.displayType);
                colCount++;
                if (col === undefined) {
                    throw new Error(`can't add column ${colName}`);
                }
            }

            const attrs = attrsWithName.filter(attr => attr.name === colName);
            const columns = this._columns.allWithName(colName);
            zip(attrs, columns).forEach((pair) => {
                rowMap!.valueFor(pair[1].id)!.value = pair[0].value || '';
            });
        });
    }

    private getOrCreateRow(rowIdx: number | undefined): ValueMap | undefined {
        if (rowIdx === undefined) {
            return this.addRow() || this.rows[0];
        }
        this._rows.at(rowIdx);
    }

    addColumn(name?: string, valueType?: ValueType, displayType?: DisplayType, isTemplateBased: boolean = false): Attribute | undefined {
        const defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + this._columns.nextIndex;
        const colName = name || defColName;

        if (this.canAddColumn(colName, isTemplateBased)) {
            let col = new Attribute(colName, valueType, displayType, isTemplateBased);

            this._rows.addKey(col.id);
            this._columns.add(col);

            return col;
        }
        return undefined;
    }

    removeColumn(id: string): boolean {
        const column = this._columns.findById(id);
        if (column !== undefined && column.displayType.isRemovable) {
            this._columns.remove(id);
            this._rows.removeKey(id);
            if (this._columns.size() === 0 && this.singleRow) {
                this.removeRowAt(0);
            }
            return true;
        }
        return false;
    }

    addRow(): ValueMap | undefined {
        if (this.canAddRow) {
            return this._rows.add(this._columns.keys());
        }
        return undefined;
    }

    canAddMoreColumns(): boolean {
        return this.type.allowCustomCols || !this.type.uniqueCols || this._columns.size() < this.type.columnTypes.length;
    }

    canAddColumn(name: string, isTemplateBased: boolean): boolean {
        const notExists = this.columns.find(col => col.name === name) === undefined;
        if (notExists) {
            return isTemplateBased || this.type.allowCustomCols;
        }
        return !this.type.uniqueCols;
    }

    canAddRow(): boolean {
        return this.groups.every(g => g.some(f => CanAddRow(f)))
    }

    canRemoveRow(): boolean {
        return this.groups.every(g => g.some(f => CanRemoveRow(f)))
    }

    removeRowAt(index: number): boolean {
        if (this.canRemoveRow) {
            return this._rows.removeAt(index);
        }
        return false;
    }
}

export class AnnotationFeature extends Feature {
    constructor(type: FeatureType, data: FeatureData = <FeatureData>{}) {
        super(type, data);
    }

    static create(type: FeatureType, attrs: AttributeData[]): Feature {
        return new AnnotationFeature(type,
            {
                type: type.name,
                entries: [attrs]
            });
    }
}

export class Features {
    private features: Feature[] = [];

    constructor(type: SectionType, data: SectionData) {
        const fd = (data.features || []).filter(f => String.isDefinedAndNotEmpty(f.type))
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

    remove(feature: Feature): void {
        if (feature.type.tmplBased) {
            return;
        }
        const index = this.features.indexOf(feature);
        if (index < 0) {
            return;
        }
        this.features.splice(index, 1);

        feature.type.destroy();
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

    constructor(type: SectionType, data: SectionData) {
        this.fields = [];

        const attrObj = (data.attributes || [])
            .filter(attr => attr.name && type.getFieldType(attr.name) !== undefined)
            .reduce((rv, attr) => {
                rv[attr.name!] = attr.value;
                return rv;
            }, {});

        type.fieldTypes.forEach(fieldType => {
            this.add(fieldType, attrObj[fieldType.name] || '');
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

export class Section {
    private _accno: string;

    readonly id: string;
    readonly type: SectionType;
    readonly annotations: Feature;
    readonly fields: Fields;
    readonly features: Features;
    readonly sections: Sections;
    readonly tags: Tags;

    constructor(type: SectionType, data: SectionData = <SectionData>{}) {
        this.tags = Tags.create(data);

        this.id = `section_${nextId()}`;
        this.type = type;

        this._accno = data.accno || '';

        this.fields = new Fields(type, data);

        //Any attribute names from the server that do not match top-level field names are added as annotations.
        this.annotations = AnnotationFeature.create(type.annotationsType,
            (data.attributes || []).filter(a => a.name && type.getFieldType(a.name) === undefined)
        );
        this.features = new Features(type, data);
        this.sections = new Sections(type, data);
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

    constructor(type: SectionType, data: SectionData = {} as SectionData) {
        this.sections = [];

        const sectionData = (data.sections || []).filter(s => String.isDefinedAndNotEmpty(s.type))
            .reduce((rv, s) => {
                rv[s.type!] = s;
                return rv;
            }, {});

        type.sectionTypes.forEach(st => {
            if (st.displayType.isShownByDefault) {
                this.add(st, sectionData[st.name]);
                sectionData[st.name] = undefined;
            }
        });

        Object.keys(sectionData).forEach(key => {
            const d = sectionData[key];
            if (d !== undefined) {
                this.add(type.getSectionType(d.type), d);
            }
        });
    }

    get length(): number {
        return this.sections.length;
    }

    list(): Section[] {
        return this.sections.slice();
    }

    add(type: SectionType, data?: SectionData): Section {
        const s = new Section(type, data);
        this.sections.push(s);
        return s;
    }

    remove(section: Section): void {
        const sections = this.sections;
        const index = sections.indexOf(section);

        if (this.isRemovable(section)) {
            sections.splice(index, 1);
        }
    }

    isRemovable(section: Section): boolean {
        return !section.isRequired() || !this.isLastOfType(section.typeName);
    }

    isLastOfType(typeName: string): boolean {
        const sectionsFiltered = this.sections.filter(section => {
            return section.type.name === typeName;
        });
        return sectionsFiltered.length === 1;
    }
}

export class Submission {
    accno: string;
    isRevised: boolean;        //true if submission has been sent and is marked as revised by PageTab class.
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
        return this.accno.length == 0 || this.accno.indexOf('TMP') == 0;
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
    type?: string;
    accno?: string;
    attributes?: AttributeData[];
    features?: FeatureData[];
    sections?: SectionData[];
}

export interface SubmissionData extends TaggedData {
    accno?: string;
    attributes?: AttributeData[];
    section?: SectionData;
    isRevised?: boolean;
}