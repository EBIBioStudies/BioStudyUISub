import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {
    SectionType,
    FeatureType
} from './submission-type.model';

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

    private _name: string;

    constructor(name: string = '', required: boolean = false) {
        super();
        this.required = required;
        this._name = name;
        this.id = `attr_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (this.required) {
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
        this._value = value;
        this.notify(new UpdateEvent('value', value));
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
        let v = new AttributeValue(value);
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
        return this.columns;
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
            console.error(`Column index out of bounds: ${index}`);
            return false;
        }
        if (this.columns[index].required) {
            console.error(`Can't remove required column [index: ${index}`);
            return false;
        }
        this.columns.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.notify(new UpdateEvent('column_remove', {id: id, index: index}));
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
        return this.rows;
    }

    add(keys: string[]): ValueMap {
        let row = new ValueMap(keys);
        let rowIndex = {index: this.rows.length};
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

    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        super();

        this.id = `feature_${nextId()}`;
        this.type = type;

        if (type.singleRow) {
            this.addRow();
        }

        type.columnTypes.forEach(ct => {
            if (ct.required) {
                this.addColumn(ct.name, ct.required);
            }
        });

        (data.entries || []).forEach(entry => {
            this.add(entry.attributes);
        });

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

    addColumn(name?: string, required?: boolean): void {
        const col = new Attribute(name, required);
        this._rows.addKey(col.id);
        this._columns.add(col);
    }

    removeColumn(id: string): void {
        if (this._columns.remove(id)) {
            this._rows.removeKey(id);
        }
    }

    addRow(): ValueMap {
        if (this.singleRow && this._rows.size() > 0) {
            console.error(`addRow: The feature [type=${this.type.name}] can't have more than one row`);
            return;
        }
        return this._rows.add(this._columns.keys());
    }

    removeRowAt(index: number): void {
        if (this.singleRow) {
            console.error(`removeRowAt: The feature [type=${this.type.name}] can't have less than one row`);
            return;
        }
        this._rows.removeAt(index);
    }

    static create(type: FeatureType, attrs: { name: string, value: string }[]): Feature {
        const feature = new Feature(type);
        feature.add(attrs);
        return feature;
    }
}

export class Features extends HasUpdates<UpdateEvent> {
    private features: { [key: string]: Feature };
    private order: string[];
    private subscriptions: { [key: string]: Subscription };

    constructor(type: SectionType, data: SectionData) {
        super();
        this.features = {};
        this.subscriptions = {};
        this.order = [];

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
                this.add(ft, fd[ft.name])
            }
        });
    }

    list(): Feature[] {
        return this.order.map(k => this.features[k]);
    }

    add(type: FeatureType, data: FeatureData): Feature {
        if (this.features[type.name] !== undefined) {
            console.error(`Feature with name ${type.name} already exists`);
            return;
        }
        const feature = new Feature(type, data);
        const featureId = {id: feature.id, index: this.features.length};
        this.order.push(type.name);
        this.features[type.name] = feature;
        this.subscriptions[type.name] =
            feature.updates().subscribe(
                u => this.notify(new UpdateEvent('feature_update', featureId, u))
            );
        this.notify(new UpdateEvent('feature_add', featureId));
        return feature;
    }

    remove(): void {
        //todo: do not remove features which are required
    }

    get length(): number {
        return this.order.length;
    }
}

export class Field extends HasUpdates<UpdateEvent> {
    readonly id: string;

    constructor(private _name: string,
                private _value: string = '') {
        super();
        this.id = `field_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(v: string) {
        this._name = v;
        this.notify(new UpdateEvent('name', v));
    }

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
        this.notify(new UpdateEvent('value', v));
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
            this.add(ft.name, vals[ft.name] || '');
        });
    }

    list(): Field[] {
        return this.fields.slice();
    }

    get length(): number {
        return this.fields.length;
    }

    private add(name: string, value?: string): void {
        const field = new Field(name, value);
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

    constructor(type: SectionType, data: SectionData = {} as SectionData) {
        super();

        this.id = `section_${nextId()}`;
        this.type = type;

        this._accno = data.accno || '';

        this.fields = new Fields(type, data);
        this.annotations = Feature.create(type.annotationsType,
            (data.attributes || []).filter(a => type.getFieldType(a.name) === undefined)
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

    sectionPath(id: string): Section[] {
        if (id === this.id) {
            return [this];
        }
        const p = this.sections
            .list()
            .map(s => s.sectionPath(id))
            .filter(p => p.length > 0);

        return (p.length > 0) ? [].concat([this], p[0]) : [];
    }

    subscribeTo(hasUpdates: HasUpdates<UpdateEvent>, type: string) {
        hasUpdates.updates().subscribe(
            m => this.notify(new UpdateEvent(type, null, m))
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

    list(): Section[] {
        return this.sections;
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

    remove(): void {
        //TODO
    }

    get length(): number {
        return this.sections.length;
    }
}

export class Submission {
    readonly root: Section;

    constructor(type: SectionType, data?: SectionData) {
        this.root = new Section(type, data);
    }

    /* sectionById(id: string): Section {
     const p = this.sectionPath(id);
     return p.length > 0 ? p[p.length - 1] : undefined;
     }*/

    sectionPath(id: string): Section[] {
        return this.root.sectionPath(id);
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