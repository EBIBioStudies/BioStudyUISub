import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import * as _ from 'lodash';

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
                public value: any = null,
                public source: UpdateEvent = null) {
    }
}

export class Attribute extends HasUpdates<UpdateEvent> {
    private _id: string;
    private _name: string;
    private _type: string;
    private _required: boolean;

    private constructor(name: string = '',
                        type: string = 'text',
                        required: boolean = false) {
        super();
        this._id = nextId();
        this._name = name;
        this._type = type;
        this._required = required;
    }

    set name(name: string) {
        this._name = name;
        this.notify(new UpdateEvent('name', name));
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): string {
        return this._type;
    }

    get required(): boolean {
        return this._required;
    }

    static from(obj: any = {}): Attribute {
        return new Attribute(obj.name, obj.type, obj.required === true);
    }

    static fromName(name: string): Attribute {
        return new Attribute(name);
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
    private valueMap: { [key: string]: AttributeValue } = {};
    private subscriptionMap: { [key: string]: Subscription } = {};

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
                this.notify(new UpdateEvent('attr_value_change', key, m));
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

    static create(keys: string[]): ValueMap {
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

    add(attr: Attribute): void {
        this.columns.push(attr);
        this.subscriptions.push(
            attr.updates()
                .subscribe(m => {
                    this.notify(new UpdateEvent('column_change', m));
                }));
    }

    removeById(id: string): void {
        const index = this.columns.findIndex(attr => attr.id === id);
        if (index < 0) {
            return;
        }
        this.columns.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
    }

    byIndex(index: number): Attribute {
        return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
    }

    byName(name: string): Attribute[] {
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
    private __rows: ValueMap[] = [];
    private __rowSubscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    get list(): ValueMap[] {
        return this.__rows;
    }

    add(keys: string[]): ValueMap {
        let row = ValueMap.create(keys);
        this.__rows.push(row);
        this.__rowSubscriptions.push(row.updates().subscribe(m => {
            this.notify(new UpdateEvent('row_change', m));
        }));
        return row;
    }

    remove(index: number) {
        if (!this.validIndex(index)) {
            return;
        }
        this.__rows.splice(index, 1);
        this.__rowSubscriptions[index].unsubscribe();
        this.__rowSubscriptions.splice(index, 1);
    }

    addKey(key: string) {
        _.forEach(this.__rows, r => {
            r.add(key);
        });
    }

    removeKey(key: string) {
        _.forEach(this.__rows, r => {
            r.removeValue(key);
        });
    }

    size(): number {
        return this.__rows.length;
    }

    private validIndex(index: number): boolean {
        let valid = (index >= 0) && (index < this.__rows.length);
        if (!valid) {
            console.warn('row index is out of bounds', index);
        }
        return valid;
    }
}

export class Attributes {
    private __attrs: any[] = [];

    addAll(attrs: any[]): void {
        _.forEach(attrs, (a) => {
            this.__attrs.push({name: a.name, value: a.value});
        });
    }

    find(name: string): Attr {
        let index = _.findIndex(this.__attrs, {name: name});
        return index >= 0 ? this.__attrs[index] : null;
    }

    get attributes(): any[] {
        return _.map(this.__attrs, (a) => ({name: a.name, value: a.value}));
    }
}

export class Item {
    attributes: Attributes = new Attributes();

    constructor(attrs: any[]) {
        this.attributes.addAll(attrs);
    }
}

export class Section extends HasUpdates<UpdateEvent> {
    private __columns: Columns = new Columns();
    private __rows: Rows = new Rows();

    private __subscr: Subscription[] = [];

    constructor() {
        super();
        this.__subscr[0] = this.__columns.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('columns_change', m));
            });
        this.__subscr[1] = this.__rows.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('rows_change', m));
            });
    }

    get rows(): ValueMap[] {
        return this.__rows.list;
    }

    get columns(): Attribute[] {
        return this.__columns.list;
    }

    get items(): any[] {
        return _.map(this.rows, (row: ValueMap) => {
            const attrs = [];
            _.forEach(this.columns, (col: Attribute) => {
                attrs.push({name: col.name, value: row.valueFor(col.id).value});
            });
            return new Item(attrs);
        });
    }

    rowSize(): number {
        return this.__rows.size();
    }

    colSize(): number {
        return this.__columns.size();
    }

    add(attributes: any[] = []): void {
        const attrNames = _.reject(_.map(attributes, (a) => a.name), (a) => a === '');
        const colNames = this.__columns.names();

        _.forEach(_.difference(attrNames, colNames),
            (name) => {
                this.addColumn(Attribute.fromName(name));
            });

        const r: ValueMap = this.addRow();
        _.forEach(attributes, (a) => {
            const cols: Attribute[] = this.__columns.byName(a.name);
            _.forEach(cols, (col) => {
                r.valueFor(col.id).value = a.value;
            });
        });
    }

    addColumn(obj: any = {}): void {
        const col = Attribute.from(obj);
        this.__columns.add(col);
        this.__rows.addKey(col.id);
        this.notify(new UpdateEvent('add_column', col.id));
    }

    removeColumnById(id: string): void {
        this.__columns.removeById(id);
        this.__rows.removeKey(id);
        this.notify(new UpdateEvent('remove_column', id));
    }

    addRow(): ValueMap {
        const vm = this.__rows.add(this.__columns.orderedKeys());
        this.notify(new UpdateEvent('add_row'));
        return vm;
    }

    removeRow(index: number): void {
        this.__rows.remove(index);
    }

    static create(attrs: any[]): Section {
        const s = new Section();
        _.forEach(attrs, (a) => {
            s.addColumn(Attribute.from(a));
        });
        return s;
    }
}

export class Submission extends HasUpdates<UpdateEvent> {
    private __accno: string;
    private __title: string;
    private __description: string;
    private __releaseDate: string;
    annotations: Section;
    files: Section;
    links: Section;
    contacts: Section;
    publications: Section;

    constructor(dict: any) {
        super();
        function requiredColumns(itemType) {
            let attrs = (dict[itemType] || {attributes: []}).attributes;
            return _.filter(attrs, {required: true});
        }

        this.__accno = '';
        this.__title = '';
        this.__description = '';
        this.__releaseDate = '';
        this.annotations = (function () {
            let s = Section.create(requiredColumns('annotation'));
            s.addRow();
            return s;
        })();

        this.files = Section.create(requiredColumns('file'));
        this.links = Section.create(requiredColumns('link'));
        this.contacts = Section.create(requiredColumns('contact'));
        this.publications = Section.create(requiredColumns('publication'));

        this.subscribeTo(this.annotations, 'annotations');
        this.subscribeTo(this.files, 'files');
        this.subscribeTo(this.links, 'links');
        this.subscribeTo(this.contacts, 'contacts');
        this.subscribeTo(this.publications, 'publications');
    }

    get accno(): string {
        return this.__accno;
    }

    get title(): string {
        return this.__title;
    }

    get description(): string {
        return this.__description;
    }

    get releaseDate(): string {
        return this.__releaseDate;
    }

    set accno(accno: string) {
        this.__accno = accno;
        this.notify(new UpdateEvent('accno', accno));
    }

    set title(title: string) {
        this.__title = title;
        this.notify(new UpdateEvent('title', title));
    }

    set description(descr: string) {
        this.__description = descr;
        this.notify(new UpdateEvent('description', descr));
    }

    set releaseDate(date: string) {
        this.__releaseDate = date;
        this.notify(new UpdateEvent('releaseDate', date));
    }

    addAnnotation(attr?: any) {
        this.annotations.addColumn(attr);
    }

    addLink(attributes: any[] = []) {
        this.links.add(attributes);
    }

    addFile(attributes: any[] = []) {
        this.files.add(attributes);
    }

    addContact(attributes: any[] = []) {
        this.contacts.add(attributes);
    }

    addPublication(attributes: any[] = []) {
        this.publications.add(attributes);
    }

    subscribeTo(sec: Section, type: string) {
        sec.updates().subscribe(
            m => this.notify(new UpdateEvent(type, null, m))
        );
    }

    static create(dict: any): Submission {
        return new Submission(dict);
    }
}