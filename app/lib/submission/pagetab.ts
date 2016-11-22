import {Subscription} from 'rxjs/Subscription';

import {Item, Publication, Submission} from './submission';
import {PageTabProxy} from './pagetabproxy';

import * as _ from 'lodash';

class ItemAdapter {
    static fromFile(it: Item): any {
        return {
            path: it.attributes.find('Path') || {value: ''},
            attributes: _.map(_.reject(it.attributes.attributes, {name: 'Path'}),
                attr => ({name: attr.name, value: attr.value}))
        };
    }

    static toFile(file: any): any {
        return {
            attributes: [].concat(
                _.map(file.attributes, a => a),
                [{name: 'Path', value: file.path}]
            )
        };
    }

    static fromLink(it: Item): any {
        return {
            url: it.attributes.find('URL') || {value: ''},
            attributes: _.map(_.reject(it.attributes.attributes, {name: 'URL'}),
                attr => ({name: attr.name, value: attr.value}))
        };
    }

    static toLink(link: any): any {
        return {
            attributes: [].concat(
                _.map(link.attributes, a => a),
                [{name: 'URL', value: link.url}]
            )
        };
    }

    static fromPublication(it: Publication): any {
        return {
            attributes: [].concat(
                [{name: 'PubMedId', value: it.pubMedId}],
                _.map(it.attributes.attributes,
                    attr => ({name: attr.name, value: attr.value}))
            )
        };
    }

    static  toPublication(publ: any): any {
        return {
            pubMedId: (_.find(publ.attributes, {name: 'PubMedId'}) || {value: ''}).value,
            attributes: _.reject(publ.attributes, a => (a.name.toLowerCase() === 'pubmedid'))
        };
    }

    static fromContact(it:Item): any {
        return {
            attributes: _.map(it.attributes.attributes, attr => {
                let name = (attr.name === 'Organisation') ? 'affiliation' : attr.name;
                return {name: name, value: attr.value};
            })
        }
    }

    static toContact(contact: any): any {
        return {
            attributes: _.map(contact.attributes, attr => {
                let name = (attr.name.toLowerCase() === 'affiliation') ? 'Organisation' : attr.name;
                return {name: name, value: attr.value};
            })
        };
    }
}

export class PageTab {

    private __pt: PageTabProxy;
    private __subscr: Subscription;
    private __subm: Submission;

    private __updates = {
        title(pt, subm): void {
            pt.title = subm.title;
        },
        description(pt, subm): void{
            pt.description = subm.description;
        },
        releaseDate(pt, subm): void {
            pt.releaseDate = subm.releaseDate;
        },
        annotations(pt, subm): void {
            pt.annotations = _.map(subm.annotations.items[0].attributes.attributes,
                attr => {
                    return {name: attr.name, value: attr.value}
                });
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
            pt.links = _.map(subm.contacts.items, ItemAdapter.fromContact);
        }
    };

    constructor(obj?: any) {
        this.__pt = PageTabProxy.create(obj);
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

        _.forEach(source.annotations, (attr) => {
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
        // todo: unsubscribe
        this.__subscr = subm.changes().subscribe(ch => {
            this.update(ch);
        });
        return subm;
    }

    get data(): any {
        return this.__pt.data();
    }

    private update(ch: string): void {
        if (this.__updates.hasOwnProperty(ch)) {
            this.__updates[ch](this.__pt, this.__subm);
        } else {
            console.error(`unsupported update type: ${ch}`);
        }
    }
}