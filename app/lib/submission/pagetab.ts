//import {Subscription} from 'rxjs/Subscription';

import {Item, Attributes, Publication, Submission, WithChanges, Change} from './submission';
import {PageTabProxy, PTFile, PTLink, PTPubl, PTContact, PTAttributes} from './pagetabproxy';

import * as _ from 'lodash';

class ItemAdapter {
    static fromFile(it: Item): PTFile {
        let attrs: Attributes = it.attributes;
        let path = (attrs.find('Path') || {value: ''}).value;
        let attributes = _.reject(attrs.attributes, {name: 'Path'});
        return PTFile.from(path, attributes);
    }

    static toFile(file: PTFile): any {
        return {
            attributes: [].concat(
                file.attrs.jsObj(),
                [{name: 'Path', value: file.path}]
            )
        };
    }

    static fromLink(it: Item): PTLink {
        let attrs: Attributes = it.attributes;
        let url = (attrs.find('URL') || {value: ''}).value;
        let attributes = _.reject(attrs.attributes, {name: 'URL'});
        return PTLink.from(url, attributes);
    }

    static toLink(link: PTLink): any {
        return {
            attributes: [].concat(
                link.attrs.jsObj(),
                [{name: 'URL', value: link.url}]
            )
        };
    }

    static fromPublication(it: Publication): PTPubl {
        let pubMedId = it.pubMedId;
        let attributes = it.attributes.attributes;
        return PTPubl.from(pubMedId, attributes);
    }

    static  toPublication(publ: PTPubl): any {
        return {
            pubMedId: publ.pubMedId,
            attributes: publ.attrs.jsObj()
        };
    }

    static fromContact(it: Item): PTContact {
        let attrs: Attributes = it.attributes;
        let org = (attrs.find('Organisation') || {value: ''}).value;
        let attributes = _.reject(attrs.attributes, {name: 'Organisation'});
        return PTContact.from(org, attributes);
    }

    static toContact(contact: PTContact): any {
        return {
            attributes: [].concat(
                contact.attrs.jsObj(),
                [{name: 'Organisation', value: contact.org}]
            )
        };
    }
}

export class PageTab extends WithChanges<string> {

    private __pt: PageTabProxy;
    private __subm: Submission;

    private __updates = {
        title(pt, subm): void {
            pt.title = subm.title;
        },
        description(pt, subm): void {
            pt.description = subm.description;
        },
        releaseDate(pt, subm): void {
            pt.releaseDate = subm.releaseDate;
        },
        annotations(pt, subm): void {
            pt.annotations = new PTAttributes(subm.annotations.items[0].attributes.attributes);
        },
        files(pt, subm): void {
            pt.files = _.map(subm.files.items, ItemAdapter.fromFile);
        },
        links(pt, subm): void {
            pt.links = _.map(subm.links.items, ItemAdapter.fromLink);
        },
        publications(pt, subm): void {
            pt.publications = _.map(subm.publications.items, ItemAdapter.fromPublication);
        },
        contacts(pt, subm): void {
            pt.contacts = _.map(subm.contacts.items, ItemAdapter.fromContact);
        }
    };

    private __debouncedUpdate;

    constructor(obj?: any, debounceInterval: number = 400) {
        super();
        this.__pt = PageTabProxy.create(obj);
        this.__debouncedUpdate = debounceInterval === 0 ?
            this.update :
            _.debounce(this.update, debounceInterval);
    }

    asSubmission(dict: any): Submission {
        if (this.__subm) {
            return this.__subm;
        }

        let subm = Submission.create(dict);
        let source = this.__pt;

        subm.accno = source.accno;
        subm.releaseDate = source.releaseDate;
        subm.title = source.title;
        subm.description = source.description;

        _.forEach(source.annotations.jsObj(), (attr) => {
            subm.addAnnotation(attr);
        });

        _.forEach(source.links, (link) => {
            subm.addLink(ItemAdapter.toLink(link).attributes);
        });

        _.forEach(source.files, (file) => {
            subm.addFile(ItemAdapter.toFile(file).attributes);
        });

        _.forEach(source.contacts, (contact) => {
            subm.addContact(ItemAdapter.toContact(contact).attributes);
        });

        _.forEach(source.publications, (pub) => {
            let obj = ItemAdapter.toPublication(pub);
            subm.addPublication(pub.pubMedId, pub.attributes);
        });

        this.__subm = subm;
        subm.changes().subscribe((ch: Change) => {
            console.debug("got:", ch);
            this.__changes[ch.name] = 1;
            this.__debouncedUpdate();
        });
        return subm;
    }

    private __changes = {};


    private update(): void {
        let changes = this.__changes;
        this.__changes = {};

        console.debug("PageTab::update", changes);

        _.forOwn(changes, (v, k) => {
            if (this.__updates.hasOwnProperty(k)) {
                this.__updates[k](this.__pt, this.__subm);
            } else {
                console.error(`unsupported update type: ${k}`);
            }
        });
        this.notify("changed");
    }

    get data(): any {
        return this.__pt.data;
    }

    static noWait(obj?:any) {
        return new PageTab(obj, 0);
    }
}