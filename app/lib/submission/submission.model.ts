import {Injectable, Inject} from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {Scheduler} from 'rxjs/Scheduler';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

import * as _ from 'lodash';

import {DictionaryService} from './dictionary.service';
import {PageTab} from './pagetab';

class WithChanges {
    private __subj: Subject<string>;

    constructor() {
        this.__subj = new Subject<string>();
    }

    protected notify(v: string) {
        this.__subj.next(v);
    }

    changes(): Observable<string> {
        return this.__subj.asObservable();
    }
}

export class Attr extends WithChanges {
    private __name: string;
    private __value: string;
    private __type: string;
    private __required: boolean;

    private constructor(name: string = '',
                        value: string = '',
                        type: string = 'text',
                        required: boolean = false) {
        super();
        this.__name = name;
        this.__value = value;
        this.__type = type;
        this.__required = required;
    }

    set name(name: string) {
        this.__name = name;
        this.notify(name);
    }

    set value(value: string) {
        this.__value = value;
        this.notify(value);
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

    static from(obj, required: boolean = false): Attr {
        return new Attr(obj.name, obj.value, obj.type, required);
    }
}

export class Attributes extends WithChanges {
    attributes: Attr[] = [];
    private __subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    add(attr: Attr): void {
        this.attributes.push(attr);
        this.__subscriptions.push(
            attr.changes().subscribe(m => {
                this.notify(m);
            })
        );
        this.notify('new attribute added');
    }

    addNew(name?: string, value?: string) {
        this.add(Attr.from({name: name, value: value}));
    }

    remove(index: number) {
        if (index >= 0) {
            let attr = this.attributes[index];
            if (attr.required) {
                console.error(`Can't remove required attribute: {attr.name}`);
                return;
            }
            this.attributes.splice(index, 1);
            this.__subscriptions[index].unsubscribe();
            this.__subscriptions.splice(index, 1);
            this.notify('attribute removed: ' + index);
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
    static create(attributes?:any[] = [], required?:any[] = []) {
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

export class Item extends WithChanges {
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
        this.notify("pubMedId: " + this.__pubMedId);
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

export class Items extends WithChanges {
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

    add() {
        let item = this.__itemConstructor.apply(this, arguments);
        this.items.push(item);
        this.__subscriptions.push(
            item.changes().subscribe(
                m => {
                    this.notify(m);
                })
        );
        this.notify('new item added');
    }

    remove(index) {
        if (index >= 0) {
            this.items.splice(index, 1);
            this.__subscriptions[index].unsubscribe();
            this.__subscriptions.splice(index, 1);
            this.notify('item removed: ' + index);
        }
    }

    static create(c: ItemConstructorType): Items {
        return new Items(c);
    }
}

export class Submission extends WithChanges {
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
            return _.filter(dict[itemType].attributes, {required: true});
        }

        this.__accno = '';
        this.__title = '';
        this.__description = '';
        this.__releaseDate = null;
        this.annotations = (function () {
            var items = Items.create(Item.factory(requiredAttributes('annotation')));
            items.addNew();
            return items;
        })();

        this.files = Items.create(Item.factory(requiredAttributes('file')));
        this.links = Items.create(Item.factory(requiredAttributes('link')));
        this.contacts = Items.create(Item.factory(requiredAttributes('contact')));
        this.publications = Items.create(Publication.publicationFactory(requiredAttributes('publication')));

        this.subscribe2(this.annotations, 'annotation');
        this.subscribe2(this.files, 'file');
        this.subscribe2(this.links, 'link');
        this.subscribe2(this.contacts, 'contact');
        this.subscribe2(this.publications, 'publication');
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
        this.notify('accno: ' + accno);
    }

    set title(title: string) {
        this.__title = title;
        this.notify('title: ' + title);
    }

    set description(descr: string) {
        this.__description = descr;
        this.notify('description:' + descr);
    }

    set releaseDate(date: string) {
        this.__releaseDate = date;
        this.notify('releaseDate: ' + date);
    }

    addAnnotation(attr: Attr) {
        this.annotations.items[0].attributes.add(attr);
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

    addPublication(pubMedId = '', attributes: any[] = []) {
        this.publications.add(pubMedId, attributes);
    }

    subscribe2(items:Items, type:string) {
        items.changes().subscribe(
            m => this.notify(type + ':' + m)
        );
    }

    static create(dict: any): Submission {
        return new Submission(dict);
    }
}

@Injectable()
export class SubmissionModel {
    constructor(@Inject(DictionaryService) private dictService: DictionaryService) {
    }

    importSubmission(obj): Submission {

        function renameAttributes(attrs) {
            if (!attrs) {
                return attrs;
            }
            return _.map(attrs, function (attr) {
                var copy = _.assign({}, attr);
                if (copy.name === 'Affiliation') { // Affiliation -> Organisation
                    copy.name = 'Organisation';
                }
                return copy;
            });
        }

        function joinAttributes(attrs1, attrs2) {
            var joined = [];
            _.forEach(attrs1, function (attr) {
                joined.push(_.assign({}, attr));
            });
            _.forEach(attrs2, function (attr) {
                joined.push(_.assign({}, attr));
            });
            return joined;
        }

        var subm = Submission.create(this.dictService.dict());
        var source = PageTab.create(obj);

        subm.accno = source.accno;
        subm.releaseDate = source.releaseDate;
        subm.title = source.title;
        subm.description = source.description;

        _.forEach(source.annotations, (attr) => {
            subm.addAnnotation(Attr.from(attr));
        });

        _.forEach(source.links, (link) => {
            subm.addLink(joinAttributes(link.attributes, [{name: 'URL', value: link.url}]));
        });

        _.forEach(source.files, function (file) {
            subm.addFile(joinAttributes(file.attributes, [{name: 'Path', value: file.path}]));
        });

        _.forEach(source.contacts, function (contact) {
            subm.addContact(renameAttributes(contact.attributes));
        });

        _.forEach(source.publications, function (pub) {
            var pubMedId = (_.find(pub.attributes, {name: 'PubMedId'}) || {value: ''}).value;
            var attrs = _.reject(pub.attributes, {name: 'PubMedId'});
            subm.addPublication(pubMedId, attrs);
        });
        return subm;
    }

    exportSubmission(subm: Submission): any {
        subm = _.cloneDeep(subm); // a copy

        function copyAttributes(attrs) {
            return _.map(attrs, function (attr) {
                return {name: attr.name, value: attr.value};
            });
        }

        function renameAttributes(attrs) {
            _.forEach(attrs, function (attr) {
                if (attr.name === 'Organisation') { // Organisation --> Affiliation
                    attr.name = 'Affiliation';
                }
            });
            return attrs;
        }

        function findAttrValue(attrs, attrName) {
            var idx = _.findIndex(attrs, {name: attrName});
            return idx < 0 ? '' : attrs[idx].value;
        }

        var out = {
            accno: subm.accno || '',
            type: 'Submission',
            //accessTags:["Public"], // public submission??
            attributes: [
                {
                    name: 'Title',
                    value: subm.title
                },
                {
                    name: 'ReleaseDate',
                    value: _.isDate(subm.releaseDate) ? subm.releaseDate.toISOString().substring(0, 10) : ''
                }
            ],
            section: {
                type: 'Study',
                attributes: [],
                links: [],
                files: [],
                subsections: []
            }
        };

        out.section.attributes.push({name: 'Description', value: subm.description});
        _.forEach(subm.annotations.items[0].attributes.attributes, function (attr) {
            out.section.attributes.push({name: attr.name, value: attr.value});
        });

        _.forEach(subm.files.items, function (item) {
            var path = findAttrValue(item.attributes.attributes, 'Path');
            var attrs = _.reject(item.attributes.attributes, {name: 'Path'});
            var file = {path: path, attributes: copyAttributes(attrs)};
            out.section.files.push(file);
        });

        _.forEach(subm.links.items, function (item) {
            var url = findAttrValue(item.attributes.attributes, 'URL');
            var attrs = _.reject(item.attributes.attributes, {name: 'URL'});
            var link = {url: url, attributes: copyAttributes(attrs)};
            out.section.links.push(link);
        });

        _.forEach(subm.publications.items, function (item) {
            var attrs = copyAttributes(item.attributes.attributes);
            attrs.push({name: 'PubMedId', value: item.pubMedId});
            var subsection = {type: 'Publication', attributes: attrs};
            out.section.subsections.push(subsection);
        });

        var mem = {};
        var organisations = [];
        var refIndex = 0;
        _.forEach(subm.contacts.items, function (item) {
            var attributes = copyAttributes(item.attributes.attributes);
            _.forEach(attributes, function (attr) {
                if (attr.name === 'Organisation') {
                    var org = attr.value;
                    if (!mem[org]) {
                        mem[org] = 'ref' + (++refIndex);
                        organisations.push(org);
                    }
                    attr.value = mem[org];
                    attr.isReference = true;
                }
            });
            var subsection = {type: 'Author', attributes: renameAttributes(attributes)};
            out.section.subsections.push(subsection);
        });

        _.forEach(organisations, function (org) {
            var subsection = {type: 'Organization', accno: mem[org], attributes: [{name: 'Name', value: org}]};
            out.section.subsections.push(subsection);
        });

        return out;
    }

    createNew(userName: string, userEmail: string): any {
        var sbm = this.importSubmission({});
        sbm.addContact([
            {name: "Name", value: userName || ""},
            {name: "E-mail", value: userEmail || ""}
        ]);
        return this.exportSubmission(sbm);
    }

    validateSubmission(sbm: Submission): Array {

        function requiredAttribute(itemKey, attrKey) {
            return function (sbm) {
                for (let item in sbm[itemKey].items) {
                    let attrIndex = _.findIndex(item.attributes, {name: attrKey});
                    if (attrIndex < 0) {
                        return false;
                    }
                    let attr = item.attributes[attrIndex].value;
                    return attr ? true : false;
                }
            }
        }

        var rules = {
            "Title must be at least 50 characters": function (sbm) {
                return sbm.title && sbm.title.length >= 50;
            },
            "Description must be at least 50 characters": function (sbm) {
                return sbm.description && sbm.description.length >= 50;
            },
            "Release date is required": function (sbm) {
                return sbm.releaseDate ? true : false;
            },
            "At least one contact is required": function (sbm) {
                return sbm.contacts.items.length > 0;
            }
        };

        _.forEach(_.filter(this.dictService.byKey('contact').attributes, {required: 'true'}), function (attr) {
            rules["Contact '" + attr.name + "' is required"] = requiredAttribute('contacts', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('link').attributes, {required: 'true'}), function (attr) {
            rules["Link '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('file').attributes, {required: 'true'}), function (attr) {
            rules["File '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
        });

        _.forEach(_.filter(this.dictService.byKey('publication').attributes, {required: 'true'}), function (attr) {
            rules["File '" + attr.name + "' is required"] = requiredAttribute('publications', attr.name);
        });

        var errors = [];
        _.forOwn(rules, function (rule, name) {
            var ok = rule(sbm);
            if (!ok) {
                errors.push(name);
            }
        });
        return errors;
    }

}