import {
    DisplayType,
    FeatureType, FeatureTypeRule,
    FieldType,
    SectionType,
    SubmissionType,
    ValueType,
    ValueTypeFactory
} from './submission-type.model';

import * as pluralize from 'pluralize';

import {NameAndValue, Tag} from './model.common';

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

    get isEmpty(): boolean {
        return Array.from(this.valueMap.values()).every(v => v.value.isEmpty());
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

    canRemove(id: string) {
        const index = this.columns.findIndex(attr => attr.id === id);
        return this.canRemoveAt(index);
    }

    canRemoveAt(index: number) {
        return index >= 0 && this.columns[index].displayType.isRemovable;
    }

    remove(id: string): boolean {
        const index = this.columns.findIndex(attr => attr.id === id);
        if (!this.canRemoveAt(index)) {
            return false;
        }
        this.columns.splice(index, 1);
        return true;
    }

    at(index: number): Attribute | undefined {
        return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
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

    add(keys: string[]): ValueMap {
        const row = new ValueMap(keys);
        this.rows.push(row);
        return row;
    }

    removeAt(index: number): void {
        if ((index < 0) || (index > this.rows.length)) {
            console.warn(`index is out of range: ${index}`);
            return;
        }
        this.rows.splice(index, 1);
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

export interface FeatureRule {
    canRemoveRow(): boolean;

    canAddRow(): boolean;
}

export class FeatureRuleAggregate implements FeatureRule {
    private rules: FeatureRule[] = [];

    canRemoveRow(): boolean {
        return this.rules.every(r => r.canRemoveRow());
    }

    canAddRow(): boolean {
        return this.rules.every(r => r.canAddRow());
    }

    add(rule: FeatureRule) {
        this.rules.push(rule);
    }
}

export class SingleRowFeatureRule implements FeatureRule {
    constructor(private isSingleRow: boolean, private feature: Feature) {
    }

    canRemoveRow(): boolean {
        return !this.isSingleRow;
    }

    canAddRow(): boolean {
        return !this.isSingleRow || this.feature.rowSize() === 0;
    }
}

export class DisplayFeatureRule implements FeatureRule {
    constructor(private type: DisplayType, private feature: Feature) {
    }

    canAddRow(): boolean {
        return !this.type.isReadonly;
    }

    canRemoveRow(): boolean {
        return !this.type.isReadonly && !(this.type.isRequired && this.feature.rowSize() === 1);
    }
}

export class AtLeastOneRowIn implements FeatureRule {
    //tODO
}

export class Feature {
    readonly id: string;
    readonly type: FeatureType;

    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    private rule: FeatureRuleAggregate = new FeatureRuleAggregate();

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

        // todo add rules externaly as feature.addRule(...);
        if (rule != undefined) {
            this.rule.add(rule);
        }

        //if (type.singleRow) {
        this.rule.add(new SingleRowFeatureRule(type.singleRow, this));
        //this.addRow();
        //}

        //if (type.displayType.isShownByDefault) {
        this.rule.add(new DisplayFeatureRule(type.displayType, this));
        //this.addRow(); if rowSize === 0
        //}

        type.columnTypes.filter(ct => ct.isRequired || ct.isDesirable)
            .forEach(ct => {
                this.addColumn(ct.name, ct.valueType, ct.displayType, true);
            });

        (data.entries || []).forEach(entry => {
            this.add(entry);
        });

        if (type.displayType.isShownByDefault && this.rowSize() === 0) {
            this.addRow();
        }
    }

    addRule(rule: FeatureRule) {
        this.rule.add(rule);
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
     * ID of the first column with a matching name. For features with unique columns (eg: grids), it's a safe guess
     * for any given attribute name.
     * @param {string} name - Name of the column whose ID is to be retrieved.
     * @returns {string} Attribute ID for the named column.
     */
    firstId(name: string): string {
        return this._columns.allWithName(name)[0].id
    }

    /**
     * Determines the feature is made up of empty rows.
     * NOTE: This is equally applicable to lists as long as they are considered transposed grids, the
     * only row being the set of values for each key.
     * @returns {boolean} True if all rows are empty.
     */
    isEmpty(): boolean {
        return this.rows.every(row => row.isEmpty);
    }

    /**
     * Converts the feature's name to plural if it has more than one row (or column if only one row allowed).
     * It employs the Pluralize global JS plugin: {@link https://github.com/blakeembrey/pluralize}
     * @returns {string} Pluralized or unmodified feature name.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    pluralName(): string {
        return pluralize(this.type.name);
    }

    /**
     * Splits a given camel-cased name into words.
     * @param {string} Name of the feature.
     * @returns {string} Separated words.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    splitName(name: string): string {
        return name.replace(/([a-z])([A-Z])/g, '$1 $2');
    }


    /**
     * Sets the values of a given row.
     * @param {{name: string; value: string}[]} attributes - Data the row will be set to.
     * @param {number} [rowIdx = null] - Index of row to be set to the provided attributes. By default, the row will be
     * added if the feature is not limited to a single row, in which case the first row is changed.
     */
    add(attributes: AttributeData[] = [], rowIdx?: number): void {
        const attrsWithName = attributes.filter(attr => String.isDefinedAndNotEmpty(attr.name));
        const attrNames = attrsWithName.map(attr => attr.name);

        const usedColIds: string[] = [];
        let rowMap;

        attrNames
            .forEach((attrName) => {
                const colNames = this._columns.names();
                const instancesFn = (name) => attrName == name;
                const occurAttrs = attrNames.filter(instancesFn).length;
                const occurCols = colNames.filter(instancesFn).length;
                const colType = this.type.getColumnType(attrName!);

                if (occurAttrs != occurCols) {
                    this.addColumn(attrName, colType!.valueType, colType!.displayType);
                }
            });

        if (rowIdx === undefined) {
            rowMap = this.singleRow ? this.rows[0] : this.addRow();
        } else {
            rowMap = this.rows[rowIdx];
        }

        attrsWithName.forEach(attr => {
            let cols: Attribute[] = this._columns.allWithName(attr.name!);

            cols = cols.filter((col) => (usedColIds.indexOf(col.id) === -1));
            usedColIds.push(cols[0].id);

            rowMap.valueFor(cols[0].id).value = attr.value;
        });
    }

    addColumn(name?: string, valueType?: ValueType, displayType?: DisplayType, isTemplateBased: boolean = false): Attribute {
        let defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + this._columns.nextIndex;
        let col = new Attribute(name || defColName, valueType, displayType, isTemplateBased);

        this._rows.addKey(col.id);
        this._columns.add(col);

        return col;
    }

    canRemoveColumn(id: string): boolean {
        return this._columns.canRemove(id);
    }

    removeColumn(id: string): void {
        if (this._columns.remove(id)) {
            this._rows.removeKey(id);
        }
    }

    addRow(): ValueMap | undefined {
        if (this.rule.canAddRow()) {
            console.warn(`addRow: The feature [type=${this.type.name}] can't have more than one row`);
            return;
        }
        return this._rows.add(this._columns.keys());
    }

    get canRemoveRow(): boolean {
        return this.rule.canRemoveRow();
    }

    removeRowAt(index: number): void {
        if (!this.canRemoveRow) {
            console.warn(`removeRowAt: The feature [type=${this.type.name}] can't have less than one row`);
            return;
        }
        this._rows.removeAt(index);
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

        type.featureRules.map(rule => new FeatureRule(rule));
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
        const featureId = {id: feature.id, index: (this.features.length), key: type.name};
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