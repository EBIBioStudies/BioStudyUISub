import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {SectionType, FeatureType, AnnotationsType} from './submission-type.model';

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

    constructor(private _name: string = '') {
        super();
        this.id = `attr_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
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
    private valueMap: {[key: string]: AttributeValue} = {};
    private subscriptionMap: {[key: string]: Subscription} = {};

    private constructor() {
        super();
    }

    valueFor(key: string): AttributeValue {
        return this.valueMap[key];
    }

    add(key: string, value?: string): void {
        if (key in this.valueMap) {
            console.warn(`adding multiple values for a key:${key}`);
            return;
        }
        let v = new AttributeValue(value);
        this.valueMap[key] = v;
        this.subscriptionMap[key] = v.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('value_update', {key: key}, m));
            });
    }

    remove(key: string): void {
        if (key in this.valueMap) {
            this.subscriptionMap[key].unsubscribe();
            this.subscriptionMap[key] = undefined;
            this.valueMap[key] = undefined;
        }
        console.warn('removing non-existent value for a key', key);
    }

    //TODO: should we filter undefined values in the results?
    list(keys: string[]): AttributeValue[] {
        return keys.map(key => this.valueMap[key]);
    }

    static create(keys: string[] = []): ValueMap {
        const vm = new ValueMap();
        keys.forEach(key => vm.add(key));
        return vm;
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

    remove(id: string): void {
        const index = this.columns.findIndex(attr => attr.id === id);
        if (index < 0) {
            return;
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
        let row = ValueMap.create(keys);
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

export class NameValuePair {
    constructor(public name: string,
                public value: string) {
    }
}

export class Feature extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly type: FeatureType;

    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    constructor(type: FeatureType) {
        super();

        this.id = `feature_${nextId()}`;
        this.type = type;

        if (this.singleRow) {
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

    add(attributes: NameValuePair[] = []): void {
        const attrNames = attributes.filter(attr => attr.name !== '').map(attr => attr.name);
        const colNames = this._columns.names();

        attrNames
            .filter(n => colNames.indexOf(n) < 0)
            .forEach(
                (name) => {
                    this.addColumn(new Attribute(name));
                });

        const row: ValueMap = this.addRow();

        attributes.forEach(attr => {
            const cols: Attribute[] = this._columns.allWithName(attr.name);
            cols.forEach(col => {
                row.valueFor(col.id).value = attr.value;
            });
        });
    }

    addColumn(obj: any = {}): void {
        const col = new Attribute(obj.name);
        this._rows.addKey(col.id);
        this._columns.add(col);
    }

    removeColumn(id: string): void {
        this._columns.remove(id);
        this._rows.removeKey(id);
    }

    addRow(): ValueMap {
        if (this.singleRow && this._rows.size() > 0) {
            return;
        }
        return this._rows.add(this._columns.keys());
    }

    removeRowAt(index: number): void {
        if (this.singleRow) {
            return;
        }
        this._rows.removeAt(index);
    }

    static create(type: string, attrs: any[]): Feature {
        const attributes = new Feature({type: type});
        attrs.forEach(attr => {
            attributes.addColumn(new Attribute(attr));
        });
        return attributes;
    }
}

export class Features extends HasUpdates<UpdateEvent> {
    private features: Feature[];
    private subscriptions: Subscription[];

    constructor() {
        super();
        this.features = [];
        this.subscriptions = [];
    }

    list(): Feature[] {
        return this.features;
    }

    add(type: string, singleRow: boolean = false): Feature {
        const feature = new Feature({type: type, singleRow: singleRow});
        const featureId = {id: feature.id, index: this.features.length};
        this.features.push(feature);
        this.subscriptions.push(
            feature.updates().subscribe(
                u => this.notify(new UpdateEvent('feature_update', featureId, u))
            ));
        this.notify(new UpdateEvent('feature_add', featureId));
        return feature;
    }

    remove(): void {
        //todo
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
    private subscriptions: Subscription[];

    constructor() {
        super();
        this.fields = [];
        this.subscriptions = [];
    }

    list(): Field[] {
        return this.fields;
    }

    add(name: string, value?: string): void {
        const field = new Field(name, value);
        const fieldId = {id: field.id, index: this.fields.length};
        this.fields.push(field);
        this.subscriptions.push(
            field.updates().subscribe(
                u => this.notify(new UpdateEvent('field_change', fieldId, u))
            )
        );
        this.notify(new UpdateEvent('field_add', fieldId));
    }

    removeAt(index: number): void {
        const id = this.fields[index].id;
        const fieldId = {id: id, index: index};
        this.fields.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);

        this.notify(new UpdateEvent('field_remove', fieldId));
    }
}

export class Section extends HasUpdates<UpdateEvent> {
    private _accno: string = '';

    readonly id: string;
    readonly type: SectionType;
    readonly annotations: Feature;
    readonly fields: Fields;
    readonly features: Features;
    readonly sections: Sections;

    constructor(type: SectionType, annotType: AnnotationsType, accno: string = '') {
        super();

        this.id = `section_${nextId()}`;
        this.type = type;

        this._accno = accno;

        this.annotations = new Feature(annotType);
        this.fields = new Fields();
        this.features = new Features();
        this.sections = new Sections();
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

    constructor() {
        super();
        this.sections = [];
        this.subscriptions = [];
    }

    list(): Section[] {
        return this.sections;
    }

    add(type: SectionType, accno?: string): Section {
        const s = new Section(type, accno);
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
}

export class Submission {
    readonly root: Section;

    constructor(type: SectionType, annotType: AnnotationsType, accno?: string) {
        this.root = new Section(type, annotType, accno);
    }

    /* sectionById(id: string): Section {
     const p = this.sectionPath(id);
     return p.length > 0 ? p[p.length - 1] : undefined;
     }*/

    sectionPath(id: string): Section[] {
        return this.root.sectionPath(id);
    }
}