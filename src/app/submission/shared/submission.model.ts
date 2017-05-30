import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import {SubmissionTemplate} from "./submisison-template.model";

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
        this.rows.push(row);
        this.subscriptions.push(
            row.updates()
                .subscribe(m => {
                    this.notify(new UpdateEvent('row_change', m));
                }));
        return row;
    }

    remove(index: number) {
        if ((index < 0) || (index > this.rows.length)) {
            console.warn(`index is out of range: ${index}`);
            return;
        }
        this.rows.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
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

/*
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
 */

export class NameValuePair {
    constructor(public name: string,
                public value: string) {
    }
}

export class Attributes extends HasUpdates<UpdateEvent> {
    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    private colSubscription: Subscription;
    private rowSubscription: Subscription;

    constructor() {
        super();
        this.colSubscription = this._columns.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('columns_change', m));
            });
        this.rowSubscription = this._rows.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('rows_change', m));
            });
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

    /*
     get items(): any[] {
     return _.map(this.rows, (row: ValueMap) => {
     const attrs = [];
     _.forEach(this.columns, (col: Attribute) => {
     attrs.push({name: col.name, value: row.valueFor(col.id).value});
     });
     return new Item(attrs);
     });
     }
     */

    add(attributes: NameValuePair[] = []): void {
        const attrNames = attributes.filter(attr => attr.name !== '').map(attr => attr.name);
        const colNames = this._columns.names();

        attrNames
            .filter(n => colNames.indexOf(n) < 0)
            .forEach(
                (name) => {
                    this.addColumn(Attribute.fromName(name));
                });

        const row: ValueMap = this.addRow();

        attributes.forEach(attr => {
            const cols: Attribute[] = this._columns.byName(attr.name);
            cols.forEach(col => {
                row.valueFor(col.id).value = attr.value;
            });
        });
    }

    addColumn(obj: any = {}): void {
        const col = Attribute.from(obj);
        this._columns.add(col);
        this._rows.addKey(col.id);
        this.notify(new UpdateEvent('add_column', col.id));
    }

    removeColumnById(id: string): void {
        this._columns.removeById(id);
        this._rows.removeKey(id);
        this.notify(new UpdateEvent('remove_column', id));
    }

    addRow(): ValueMap {
        const vm = this._rows.add(this._columns.keys());
        this.notify(new UpdateEvent('add_row'));
        return vm;
    }

    removeRow(index: number): void {
        this._rows.remove(index);
        this.notify(new UpdateEvent('remove_row'));
    }

    static create(attrs: any[]): Attributes {
        const attributes = new Attributes();
        attrs.forEach(attr => {
            attributes.addColumn(Attribute.from(attr));
        });
        return attributes;
    }
}

export class Section extends HasUpdates<UpdateEvent> {
    attributes: Attributes;
    files: Attributes;
    links: Attributes;
    sections: Sections;

    constructor(template: SubmissionTemplate) {
        super();

        this.files = Attributes.create(template.requiredColumns('file'));
        this.links = Attributes.create(template.requiredColumns('link'));
        this.sections = new Sections();

        this.subscribeTo(this.files, 'files');
        this.subscribeTo(this.links, 'links');
        this.subscribeTo(this.sections, 'sections');
    }

    addLink(attributes: any[] = []) {
        this.links.add(attributes);
    }

    addFile(attributes: any[] = []) {
        this.files.add(attributes);
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

    list(): Section[] {
        return this.sections;
    }

    add(): void {
        //TODO
    }

    remove(): void {
        //TODO
    }
}

export class Submission extends HasUpdates<UpdateEvent> {
    private _accno: string;
    private _title: string;
    private _description: string;
    private _releaseDate: string;
    annotations: Attributes;
    contacts: Attributes;
    publications: Attributes;

    sections: Sections;

    constructor(template: SubmissionTemplate) {
        super();

        this._accno = '';
        this._title = '';
        this._description = '';
        this._releaseDate = '';
        this.annotations = (function () {
            let s = Attributes.create(template.requiredColumns('annotation'));
            s.addRow();
            return s;
        })();
        this.contacts = Attributes.create(template.requiredColumns('contact'));
        this.publications = Attributes.create(template.requiredColumns('publication'));
        this.sections = new Sections();

        this.subscribeTo(this.annotations, 'annotations');
        this.subscribeTo(this.contacts, 'contacts');
        this.subscribeTo(this.publications, 'publications');
        this.subscribeTo(this.publications, 'publications');
        this.subscribeTo(this.sections, 'sections');
    }

    get accno(): string {
        return this._accno;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get releaseDate(): string {
        return this._releaseDate;
    }

    set accno(accno: string) {
        this._accno = accno;
        this.notify(new UpdateEvent('accno', accno));
    }

    set title(title: string) {
        this._title = title;
        this.notify(new UpdateEvent('title', title));
    }

    set description(descr: string) {
        this._description = descr;
        this.notify(new UpdateEvent('description', descr));
    }

    set releaseDate(date: string) {
        this._releaseDate = date;
        this.notify(new UpdateEvent('releaseDate', date));
    }

    addAnnotation(attr?: any) {
        this.annotations.addColumn(attr);
    }

    addContact(attributes: any[] = []) {
        this.contacts.add(attributes);
    }

    addPublication(attributes: any[] = []) {
        this.publications.add(attributes);
    }

    subscribeTo(hasUpdates: HasUpdates<UpdateEvent>, type: string) {
        hasUpdates.updates().subscribe(
            m => this.notify(new UpdateEvent(type, null, m))
        );
    }

    static create(dict: any): Submission {
        return new Submission(dict);
    }
}