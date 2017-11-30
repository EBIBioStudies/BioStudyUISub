import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {
    SectionType,
    FeatureType,
    ValueType,
    FieldType,
    SubmissionType
} from './submission-type.model';

import * as pluralize from "pluralize";

const nextId = (function () {
    let count = 0;
    return function () {
        return `id${count++}`;
    }
})();

export class HasUpdates<T> {
    private subj$: Subject<T>;

    constructor() {
        this.subj$ = new Subject<T>();
    }

    updates(): Observable<T> {
        return this.subj$.asObservable();
    }

    protected notify(v: T) {
        this.subj$.next(v);
    }
}

export class UpdateEvent {
    constructor(public name: string,
                public value: any,
                public source: UpdateEvent = undefined) {
    }
}

export class Attribute extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly required: boolean;
    readonly valueType: ValueType;

    private _name: string;

    constructor(name: string = '', required: boolean = false, valueType: ValueType = 'text') {
        super();
        this.required = required;
        this.valueType = valueType;
        this._name = name;
        this.id = `attr_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (this.required || this._name === name) {
            return;
        }
        this._name = name;
        this.notify(new UpdateEvent('name', name));
    }
}

export class AttributeValue extends HasUpdates<UpdateEvent> {
    constructor(private _value: string = '') {
        super();
    }

    set value(value: string) {
        if (this.value !== value) {
            this._value = value;
            this.notify(new UpdateEvent('value', value));
        }
    }

    get value(): string {
        return this._value;
    }
}

export class ValueMap extends HasUpdates<UpdateEvent> {
    private valueMap: Map<string, AttributeValue> = new Map();
    private subscriptionMap: Map<string, Subscription> = new Map();

    constructor(keys?: string[]) {
        super();
        (keys || []).forEach(key => this.add(key));
    }

    valueFor(key: string): AttributeValue {
        return this.valueMap.get(key);
    }

    add(key: string, value?: string): void {
        if (this.valueMap.has(key)) {
            console.warn(`adding multiple values for a key:${key}`);
            return;
        }
        const v = new AttributeValue(value);
        this.valueMap.set(key, v);
        this.subscriptionMap.set(key,
            v.updates().subscribe(m => {
                this.notify(new UpdateEvent('value_update', {key: key}, m));
            }));
    }

    remove(key: string): void {
        if (!this.valueMap.has(key)) {
            console.warn(`remove: the key '${key}' does not exist in the map`);
            return;
        }
        this.subscriptionMap.get(key).unsubscribe();
        this.subscriptionMap.delete(key);
        this.valueMap.delete(key);
    }

    values(keys?: string[]): AttributeValue[] {
        return (keys || this.keys()).map(key => this.valueMap.get(key));
    }

    keys(): string[] {
        return Array.from(this.valueMap.keys());
    }
}

export class Columns extends HasUpdates<UpdateEvent> {
    private columns: Attribute[] = [];
    private subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    list(): Attribute[] {
        return this.columns.slice();
    }

    add(column: Attribute): void {
        const columnId = {id: column.id, index: this.columns.length};
        this.columns.push(column);
        this.subscriptions.push(
            column.updates()
                .subscribe(m => {
                    this.notify(new UpdateEvent('column_name_update', columnId, m));
                }));
        this.notify(new UpdateEvent('column_add', columnId));
    }

    remove(id: string): boolean {
        const index = this.columns.findIndex(attr => attr.id === id);
        if (index < 0) {
            console.warn(`Column index out of bounds: ${index}`);
            return false;
        }
        if (this.columns[index].required) {
            console.warn(`Can't remove required column [index: ${index}`);
            return false;
        }
        this.columns.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.notify(new UpdateEvent('column_remove', {id: id, index: index}));
        return true;
    }

    at(index: number): Attribute {
        return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
    }

    allWithName(name: string): Attribute[] {
        return this.columns.filter(attr => attr.name === name);
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

export class Rows extends HasUpdates<UpdateEvent> {
    private rows: ValueMap[] = [];
    private subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    list(): ValueMap[] {
        return this.rows.slice();
    }

    add(keys: string[]): ValueMap {
        const row = new ValueMap(keys);
        const rowIndex = {index: this.rows.length};
        this.rows.push(row);
        this.subscriptions.push(
            row.updates()
                .subscribe(m => {
                    this.notify(new UpdateEvent('row_value_update', rowIndex, m));
                }));
        this.notify(new UpdateEvent('row_add', rowIndex));
        return row;
    }

    removeAt(index: number): void {
        if ((index < 0) || (index > this.rows.length)) {
            console.warn(`index is out of range: ${index}`);
            return;
        }
        this.rows.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.notify(new UpdateEvent('row_remove', {index: index}));
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

export class Feature extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly type: FeatureType;

    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    static create(type: FeatureType, attrs: { name: string, value: string }[]): Feature {
        return new Feature(type,
            {
                type: type.name,
                entries: [{
                    attributes: attrs
                }]
            });
    }

    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        super();

        this.id = `feature_${nextId()}`;
        this.type = type;

        if (type.singleRow) {
            this.addRow();
        }

        type.columnTypes.forEach(ct => {
            if (ct.required) {
                this.addColumn(ct.name, ct.required, ct.valueType);
            }
        });

        (data.entries || []).forEach(entry => {
            this.add(entry.attributes);
        });

        if (type.required && this.rowSize() === 0) {
            this.addRow();
        }

        this._columns.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('columns_update', {id: this.id}, m));
            });
        this._rows.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('rows_update', {id: this.id}, m));
            });
    }

    get singleRow(): boolean {
        return this.type.singleRow;
    }

    get typeName(): string {
        return this.type.name;
    }

    set typeName(val: string) {
        this.type.name = val;
        if (this.type.name === val) {
            this.notify(new UpdateEvent('type', val));
        }
    }

    get rows(): ValueMap[] {
        return this._rows.list();
    }

    get columns(): Attribute[] {
        return this._columns.list();
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
     * Converts the feature's name to plural if it has more than one row (or column if only one row allowed).
     * It employs the Pluralize global JS plugin: {@link https://github.com/blakeembrey/pluralize}
     * @returns {string} Pluralized or unmodified feature name.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    pluralName(): string {
        return pluralize(this.type.name, this.size());
    }



    add(attributes: { name: string, value: string }[] = []): void {
        const attrNames = attributes.filter(attr => attr.name !== '').map(attr => attr.name);
        const colNames = this._columns.names();

        attrNames
            .filter(n => colNames.indexOf(n) < 0)
            .forEach(
                (name) => {
                    this.addColumn(name);
                });

        const row: ValueMap = this.singleRow ? this.rows[0] : this.addRow();

        attributes.forEach(attr => {
            const cols: Attribute[] = this._columns.allWithName(attr.name);
            cols.forEach(col => {
                row.valueFor(col.id).value = attr.value;
            });
        });
    }

    addColumn(name?: string, required?: boolean, valueType?: ValueType): Attribute {
        let defColName = ' ' + (this.colSize() + 1);
        let col;

        //Creates the new column with the appropriate name (it could be a single-row grid column)
        if (this.singleRow) {
            defColName = this.typeName + defColName;
        } else {
            defColName = 'Column' + defColName;
        }
        col = new Attribute(name || defColName, required, valueType);

        //Updates row and column maps
        this._rows.addKey(col.id);
        this._columns.add(col);

        return col;
    }

    removeColumn(id: string): void {
        if (this._columns.remove(id)) {
            this._rows.removeKey(id);
        }
    }

    addRow(): ValueMap {
        if (this.singleRow && this._rows.size() > 0) {
            console.warn(`addRow: The feature [type=${this.type.name}] can't have more than one row`);
            return;
        }
        return this._rows.add(this._columns.keys());
    }

    canRemoveRowAt(index: number): boolean {
        return !this.singleRow && !(this.type.required && this.rowSize() === 1);
    }

    removeRowAt(index: number): void {
        if (!this.canRemoveRowAt(index)) {
            console.warn(`removeRowAt: The feature [type=${this.type.name}] can't have less than one row`);
            return;
        }
        this._rows.removeAt(index);
    }
}

/**
 * Annotation groups are implemented as grid features whose columns act as different annotations or rows.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
export class AnnotationFeature extends Feature {

    /**
     * Instantiates an annotation group based on its type and data.
     * @param {FeatureType} type - Normally of type "annotationsType"
     * @param {FeatureData} data - Key-value pairs wrapped with type.
     */
    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        super(type, data);
    }

    /**
     * Convenience method for instantiating this annotation from attributes
     * @param {FeatureType} type - Normally of type "annotationsType"
     * @param {{name: string; value: string}[]} attrs - Key-value pairs
     */
    static create(type: FeatureType, attrs: { name: string, value: string }[]): Feature {
        return new AnnotationFeature(type,
            {
                type: type.name,
                entries: [{
                    attributes: attrs
                }]
            });
    }

    /**
     * Uses columns when counting the name of annotation "rows"
     * @returns {number} Number of columns.
     */
    rowSize(): number {
        return this.colSize();
    }

    /**
     * Bypasses the check for the singleRow flag as this is always true for annotations. See {@link AnnotationsType}
     * @param {number} index - Index in the list of columns
     * @returns {boolean} True if removable.
     */
    canRemoveRowAt(index: number): boolean {
        return this.rowSize() > 1 || !this.type.required;
    }

    /**
     * Checks that a column-like row can be removed.
     * @param {number} index - Index in the list of columns
     */
    removeRowAt(index: number): void {
        if (!this.canRemoveRowAt(index)) {
            console.warn(`removeRowAt: This annotation group is required. It cannot have less than one row`);
            return;
        }
        this.removeColumn(this.columns[index].id);
    }
}

export class Features extends HasUpdates<UpdateEvent> {
    private features: Feature[] = [];
    private subscriptions: Subscription[] = [];

    constructor(type: SectionType, data: SectionData) {
        super();

        const fd = (data.features || []).reduce((rv, d) => {
            rv[d.type] = d;
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
    }

    get length(): number {
        return this.features.length;
    }

    list(): Feature[] {
        return this.features.slice();
    }

    add(type: FeatureType, data?: FeatureData): Feature {
        if (this.features.filter(f => f.type === type).length > 0) {
            console.error(`Feature of type ${type} already exists in the section`);
            return;
        }
        const feature = new Feature(type, data);
        const featureId = {id: feature.id, index: (this.features.length), key: type.name};
        this.features.push(feature);
        this.subscriptions.push(
            feature.updates().subscribe(
                u => this.notify(new UpdateEvent('feature_update', featureId, u))
            ));
        this.notify(new UpdateEvent('feature_add', featureId));
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
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.features.splice(index, 1);
        this.notify(new UpdateEvent('feature_remove', {index: index, id: feature.id}));

        //NOTE: Existing type names in the scope are guaranteed to be unique at setting time
        feature.type.destroy();
    }

    /**
     * Retrieves the feature object with a given ID.
     * @param {string} id - ID of the required feature.
     * @returns {Feature} Feature with given ID.
     */
    find(id: string): Feature {
        return this.features.filter(feature => feature.id === id)[0];
    }
}

export class Field extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly type;

    private _value: string;

    constructor(type: FieldType,
                value: string = '') {
        super();
        this.id = `field_${nextId()}`;
        this.type = type;
        this._value = value;
    }

    get name(): string {
        return this.type.name;
    }

    get valueType(): string {
        return this.type.valueType;
    }

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        if (this._value !== v) {
            this._value = v;
            this.notify(new UpdateEvent('value', v));
        }
    }
}

export class Fields extends HasUpdates<UpdateEvent> {
    private fields: Field[];

    constructor(type: SectionType, data: SectionData) {
        super();
        this.fields = [];

        const vals = (data.attributes || []).reduce((rv, a) => {
            const t = type.getFieldType(a.name);
            if (t !== undefined) {
                rv[a.name] = a.value;
            }
            return rv;
        }, {});

        type.fieldTypes.forEach(ft => {
            this.add(ft, vals[ft.name] || '');
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
        const fieldId = {id: field.id, index: this.fields.length};
        this.fields.push(field);

        field.updates().subscribe(
            u => this.notify(new UpdateEvent('field_change', fieldId, u))
        )
    }
}

export class Section extends HasUpdates<UpdateEvent> {
    private _accno: string;

    readonly id: string;
    readonly type: SectionType;
    readonly annotations: Feature;
    readonly fields: Fields;
    readonly features: Features;
    readonly sections: Sections;

    readonly tags: Tags;

    constructor(type: SectionType, data: SectionData = {} as SectionData) {
        super();

        this.tags = Tags.create(data);

        this.id = `section_${nextId()}`;
        this.type = type;

        this._accno = data.accno || '';

        this.fields = new Fields(type, data);

        //Any attribute names that do not match field names are added as annotations.
        //NOTE: Attribute names are camel-cased whereas field names are in human-readable form with spaces.
        this.annotations = AnnotationFeature.create(type.annotationsType,
            (data.attributes || []).filter((attribute) => {
                const humanName = attribute.name.replace(/([a-z])([A-Z])/g, '$1 $2');  //uncamelcased version
                return (type.getFieldType(humanName) === undefined);
            })
        );
        this.features = new Features(type, data);
        this.sections = new Sections(type, data);

        this.subscribeTo(this.fields, 'fields');
        this.subscribeTo(this.features, 'features');
        this.subscribeTo(this.sections, 'sections');
    }

    get accno(): string {
        return this._accno;
    }

    set accno(accno: string) {
        this._accno = accno;
        this.notify(new UpdateEvent('accno', accno));
    }

    get typeName(): string {
        return this.type.name;
    }

    set typeName(name: string) {
        this.type.name = name;
        if (this.type.name === name) {
            this.notify(new UpdateEvent('type', name));
        }
    }

    isRequired(): boolean {
        return this.type.required;
    }

    sectionPath(id: string): Section[] {
        if (id === this.id) {
            return [this];
        }
        const path = this.sections
            .list()
            .map(s => s.sectionPath(id))
            .filter(p => p.length > 0);

        return (path.length > 0) ? [].concat([this], path[0]) : [];
    }

    subscribeTo(hasUpdates: HasUpdates<UpdateEvent>, type: string) {
        hasUpdates.updates().subscribe(
            m => this.notify(new UpdateEvent(type, undefined, m))
        );
    }
}

export class Sections extends HasUpdates<UpdateEvent> {
    private sections: Section[];
    private subscriptions: Subscription[];

    constructor(type: SectionType, data: SectionData = {} as SectionData) {
        super();
        this.sections = [];
        this.subscriptions = [];

        const sd: { [key: string]: SectionData } = (data.sections || []).reduce((rv, d) => {
            rv[d.type] = d;
            return rv;
        }, {});

        type.sectionTypes.forEach(st => {
            if (st.required) {
                this.add(st, sd[st.name]);
                sd[st.name] = undefined;
            }
        });

        Object.keys(sd).forEach(key => {
            const d = sd[key];
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

        const sectionId = {id: s.id, index: this.sections.length};
        this.sections.push(s);
        this.subscriptions.push(
            s.updates().subscribe(
                u => this.notify(new UpdateEvent('section_change', sectionId, u))
            )
        );
        this.notify(new UpdateEvent('section_add', sectionId));
        return s;
    }

    remove(section: Section): void {
        const sections = this.sections;
        const index = sections.indexOf(section);

        if (this.isRemovable(section)) {
            this.subscriptions[index].unsubscribe();
            this.subscriptions.splice(index, 1);
            this.notify(new UpdateEvent('section_remove', {index: index}));

            sections.splice(index, 1);
        }
    }

    //It is assumed that removable sections
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
    readonly accno;
    readonly root: Section;
    readonly type;

    readonly tags: Tags;

    constructor(type: SubmissionType, data: SubmissionData = {} as SubmissionData) {
        this.tags = Tags.create(data);

        this.type = type;
        this.accno = data.accno || '';
        this.root = new Section(type.sectionType, data.section);
    }

    sectionPath(id: string): Section[] {
        return this.root.sectionPath(id);
    }

    updates(): Observable<UpdateEvent> {
        return this.root.updates();
    }
}

export class Tags {
    private _tags: { classifier: string, tag: string }[];
    private _accessTags: string[];

    static create(data: any): Tags {
        return new Tags(data.tags, data.accessTags);
    }

    constructor(tags: any[] = [], accessTags: any[] = []) {
        const defined = function (v: string) {
            return v !== undefined && v.trim().length > 0;
        };
        this._tags = (tags || [])
            .filter(t => defined(t.classifier) && defined(t.tag))
            .map(t => ({classifier: t.classifier, tag: t.tag}));
        this._accessTags = (accessTags || []).slice();
    }

    get tags(): any[] {
        return this._tags.map(t => Object.assign({}, t));
    }

    get accessTags(): string[] {
        return this._accessTags.slice();
    }
}

export interface AttributesData {
    attributes: { name: string, value: string }[];
}

export interface FeatureData {
    type: string;
    entries: AttributesData[];
}

export interface SectionData extends AttributesData {
    tags: any[];
    accessTags: any[];

    type: string;
    accno: string;
    features: FeatureData[];
    sections: SectionData[];
}

export interface SubmissionData {
    tags: any[];
    accessTags: any[];

    accno: string;
    section: SectionData;
}
