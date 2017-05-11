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

export class WithChanges<T> {
    private __subj: Subject<T>;

    constructor() {
        this.__subj = new Subject<T>();
    }

    protected notify(v: T) {
        this.__subj.next(v);
    }

    changes(): Observable<T> {
        return this.__subj.asObservable();
    }
}

export class Change {
    constructor(public name: string, public value: any = null, public source: Change = null) {
    }
}

export class Attr extends WithChanges<Change> {
    private __id: string;
    private __name: string;
    private __value: string;
    private __type: string;
    private __required: boolean;

    private constructor(name: string = '',
                        value: string = '',
                        type: string = 'text',
                        required: boolean = false) {
        super();
        this.__id = nextId();
        this.__name = name;
        this.__value = value;
        this.__type = type;
        this.__required = required;
    }

    set name(name: string) {
        this.__name = name;
        this.notify(new Change('name', name));
    }

    set value(value: string) {
        this.__value = value;
        this.notify(new Change('value', value));
    }

    get id(): string {
        return this.__id;
    }

    get name(): string {
        return this.__name;
    }

    get value(): string {
        return this.__value;
    }

    get type(): string {
        return this.__type;
    }

    get required(): boolean {
        return this.__required;
    }

    static requiredFrom(obj): Attr {
        return Attr.from(obj, true);
    }

    static from(obj: any = {}, required: boolean = false): Attr {
        return new Attr(obj.name, obj.value, obj.type, required);
    }
}

export class Attributes extends WithChanges<Change> {
    attributes: Attr[] = [];
    private __subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    add(attr: Attr): void {
        let index = this.attributes.length;
        this.attributes.push(attr);
        this.__subscriptions.push(
            attr.changes().subscribe(m => {
                this.notify(new Change('attr_change', index, m));
            })
        );
        this.notify(new Change('attr_add', index));
    }

    addNew(name?: string, value?: string) {
        this.add(Attr.from({name: name, value: value}));
    }

    remove(index: number) {
        if (index >= 0) {
            let attr = this.attributes[index];
            if (attr.required === true) {
                console.error(`Can't remove required attribute: ${attr.name}`);
                return;
            }
            this.attributes.splice(index, 1);
            this.__subscriptions[index].unsubscribe();
            this.__subscriptions.splice(index, 1);
            this.notify(new Change('attr_remove', index));
        }
    }

    find(name: string): Attr {
        let index = _.findIndex(this.attributes, {name: name});
        return index >= 0 ? this.attributes[index] : null;
    }

    update(obj) {
        _.forOwn(obj, (value, key) => {
            let attr = this.find(key);
            if (attr) {
                attr.value = value;
            } else {
                this.addNew(key, value);
            }
        });
    }

    contains(name: string): boolean {
        return this.find(name) && true;
    }

    /**
     * @param attributes = [{name: "...", value: "..."}, {...}]
     * @param required = [{name: "...", type: "file"|"text"}, {...}]
     * @returns {Attributes}
     */
    static create(attributes: any[] = [], required: any[] = []) {
        let attrs = new Attributes();

        if (required) {
            _.forEach(required, function (obj) {
                attrs.add(Attr.requiredFrom(obj));
            });
        }

        let claimed = {};
        let leftover = _.filter(attributes, (obj) => {
            let attr = attrs.find(obj.name);
            if (attr && !claimed[attr.name]) {
                attr.value = obj.value;
                claimed[attr.name] = true; //only first value is used
                return false;
            }
            return true;
        });

        _.forEach(leftover, function (attr) {
            attrs.add(Attr.from(attr));
        });

        return attrs;
    }
}

export class Item extends WithChanges<Change> {
    constructor(public attributes: Attributes) {
        super();
        attributes.changes().subscribe(m => {
            this.notify(m);
        })
    }

    static factory(required): (a: any[]) => Item {
        return function (attributes: any[]) {
            return new Item(Attributes.create(attributes, required));
        };
    }
}

export class Publication extends Item {
    private __pubMedId: string;

    constructor(attributes: Attributes, pubMedId: string) {
        super(attributes);
        this.__pubMedId = pubMedId;
    }

    set pubMedId(pubMedId: string) {
        this.__pubMedId = pubMedId;
        this.notify(new Change('pubMedId', this.__pubMedId));
    }

    get pubMedId(): string {
        return this.__pubMedId;
    }

    static publicationFactory(required): (id: string, a: any[]) => Publication {
        return function (pubMedId: string, attributes: any[]) {
            return new Publication(Attributes.create(attributes, required), pubMedId);
        };
    }
}

type ItemConstructorType = (...a: any[]) => Item;

export class Items extends WithChanges<Change> {
    items: Item[] = [];
    private __subscriptions: Subscription[] = [];
    private __itemConstructor: ItemConstructorType;

    constructor(itemConstructor: ItemConstructorType) {
        super();
        this.__itemConstructor = itemConstructor;
    }

    addNew() {
        this.add();
    }

    add(arg1?:any, arg2?:any) {
        let item = this.__itemConstructor.apply(this, arguments);
        let index = this.items.length;
        this.items.push(item);
        this.__subscriptions.push(
            item.changes().subscribe(
                m => {
                    this.notify(new Change('item_change', index, m));
                })
        );
        this.notify(new Change('item_add', index));
    }

    remove(index) {
        if (index >= 0) {
            this.items.splice(index, 1);
            this.__subscriptions[index].unsubscribe();
            this.__subscriptions.splice(index, 1);
            this.notify(new Change('item_remove', index));
        }
    }

    static create(c: ItemConstructorType): Items {
        return new Items(c);
    }
}

export class Submission extends WithChanges<Change> {
    private __accno: string;
    private __title: string;
    private __description: string;
    private __releaseDate: string;
    annotations: Items;
    files: Items;
    links: Items;
    contacts: Items;
    publications: Items;

    constructor(dict: any) {
        super();
        function requiredAttributes(itemType) {
            let attrs = (dict[itemType] || {attributes: []}).attributes;
            return _.filter(attrs, {required: true});
        }

        this.__accno = '';
        this.__title = '';
        this.__description = '';
        this.__releaseDate = '';
        this.annotations = (function () {
            let items = Items.create(Item.factory(requiredAttributes('annotation')));
            items.addNew();
            return items;
        })();

        this.files = Items.create(Item.factory(requiredAttributes('file')));
        this.links = Items.create(Item.factory(requiredAttributes('link')));
        this.contacts = Items.create(Item.factory(requiredAttributes('contact')));
        this.publications = Items.create(Publication.publicationFactory(requiredAttributes('publication')));

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
        this.notify(new Change('accno', accno));
    }

    set title(title: string) {
        this.__title = title;
        this.notify(new Change('title', title));
    }

    set description(descr: string) {
        this.__description = descr;
        this.notify(new Change('description', descr));
    }

    set releaseDate(date: string) {
        this.__releaseDate = date;
        this.notify(new Change('releaseDate', date));
    }

    addAnnotation(attr?: any) {
        this.annotations.items[0].attributes.add(Attr.from(attr));
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

    addPublication(pubMedId:string = '', attributes: any[] = []) {
        this.publications.add(pubMedId, attributes);
    }

    subscribeTo(items: Items, type: string) {
        items.changes().subscribe(
            m => this.notify(new Change(type, null, m))
        );
    }

    static create(dict: any): Submission {
        return new Submission(dict);
    }
}
