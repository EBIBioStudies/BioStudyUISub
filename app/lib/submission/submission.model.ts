import {Injectable, Inject} from '@angular/core';

import * as _ from 'lodash';

import {DictionaryService} from './dictionary.service';

class Attr {
    private constructor(public name: string = '',
                        public value: string = '',
                        public type: string = 'text',
                        public required: boolean = false) {
    }

    static requiredFrom(obj) {
        return Attr.from(obj, true);
    }

    static from(obj, required: boolean = false) {
        return new Attr(obj.name, obj.value, obj.type, obj.type || required);
    }
}

class Attributes {
    attributes: Array<Attr> = [];

    add(attr: Attr) {
        this.attributes.push(attr);
    }

    addNew(name: string, value: string) {
        this.add(new Attr(name, value));
    }

    remove(index: number) {
        if (index >= 0) {
            this.attributes.splice(index, 1);
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

    /**
     * @param attributes = [{name: "...", value: "..."}, {...}]
     * @param required = [ {name: "...", type: "file" or "text"}, {...}]
     * @returns {Attributes}
     */
    static create(attributes = [], required = []) {
        let attrs = new Attributes();

        if (required) {
            _.forEach(required, function (obj) {
                attrs.add(Attr.requiredFrom(obj));
            });
        }

        let claimed = {};
        let leftover = _.filter(attributes, (obj) => {
            var attr = attrs.find(obj.name);
            if (attr && !claimed[attr.name]) {
                attr.value = obj.value;
                claimed[attr.name] = true; //only first value is used
                return false;
            }
            return true;
        });

        _.forEach(leftover, function (attr) {
            attrs.add(attr)
        });

        return attrs;
    }
}

class Items {
    items: Array<Item> = [];

    constructor(private itemConstructor) {
    }

    addNew() {
        this.add();
    }

    add() {
        this.items.push(this.itemConstructor.apply(this, arguments));
    }

    remove(index) {
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }

    static create(itemConstructor) {
        return new Items(itemConstructor);
    }
}

class Item {
    constructor(public attributes: Attributes) {
    }

    static factory(required) {
        return function (attributes: Array) {
            return new Item(Attributes.create(attributes, required));
        };
    }
}

class Publication extends Item {
    pubMedId: string;

    constructor(attributes: Attributes, pubMedId: string) {
        super(attributes);
        this.pubMedId = pubMedId;
    }

    static publicationFactory(required) {
        return function (pubMedId, attributes) {
            var item = new Publication(attributes, required);
            item.pubMedId = pubMedId; // can't make it an attribute as it's rendered differently
            return item;
        };
    }
}

export class Submission {
    accno: string;
    title: string;
    description: string;
    releaseDate: any;
    annotations: Items;
    files: Items;
    links: Items;
    contacts: Items;
    publications: Items;

    constructor(dict) {
        function requiredAttributes(itemType) {
            return _.filter(dict[itemType].attributes, {required: true});
        }

        this.accno = '';
        this.title = '';
        this.description = '';
        this.releaseDate = null;
        this.annotations = (function () {
            var items = Items.create(Item.factory(requiredAttributes('annotation')));
            items.addNew();
            return items;
        })();

        this.files = Items.create(Item.factory(requiredAttributes('file')));
        this.links = Items.create(Item.factory(requiredAttributes('link')));
        this.contacts = Items.create(Item.factory(requiredAttributes('contact')));
        this.publications = Items.create(Publication.publicationFactory(requiredAttributes('publication')));
    }

    addAnnotation(attr: Attr) {
        this.annotations.items[0].attributes.add(attr);
    }

    addLink(attributes: Array = []) {
        this.links.add(attributes);
    }

    addFile(attributes: Array = []) {
        this.files.add(attributes);
    }

    addContact(attributes: Array = []) {
        this.contacts.add(attributes);
    }

    addPublication(pubMedId = '', attributes: Array = []) {
        this.publications.add(pubMedId, attributes);
    }

    static create(dict) {
        return new Submission(dict);
    }
}

class SubmissionSource {
    obj: any;

    constructor(obj) {
        this.obj = _.cloneDeep(obj);

        if (!this.obj.attributes) {
            this.obj.attributes = [];
        }

        if (!this.obj.section) {
            this.obj.section = {subsections: []};
        }

        if (!this.obj.section.attributes) {
            this.obj.section.attributes = [];
        }
    }

    get accno() {
        return this.obj.accno || '';
    }

    get title() {
        return this.attrValue('Title', this.obj.attributes) || '';
    }

    get releaseDate() {
        return this.parseDate(this.attrValue('ReleaseDate', this.obj.attributes));
    }

    get description() {
        return this.attrValue('Description', this.obj.section.attributes) || '';
    }

    get annotations() {
        return _.reject(this.obj.section.attributes, {name: 'Description'});
    }

    get links() {
        return this.obj.section.links || [];
    }

    get files() {
        return this.obj.section.files || [];
    }

    get publications() {
        return _.filter(this.obj.section.subsections, {type: 'Publication'});
    }

    get contacts() {
        return _.map(_.filter(this.obj.section.subsections, {type: 'Author'}), (c) => {
            c.attributes = this.resolveReferences(c.attributes);
            return c;
        });
    }

    private resolveReferences(attributes) {
        return _.map(attributes, (a) => {
            return (a.isReference) ? this.findRef(a) : a;
        });
    }

    private findRef(attr) {
        let ref = attr.value;
        let found = _.find(this.obj.section.subsections, {accno: ref});
        return {name: attr.name, value: found ? found.attributes[0].value : ''};
    }

    private parseDate(str) { // yyyy-mm-dd
        if (!str) {
            return null;
        }
        return (_.isDate(str)) ? str : new Date(str);
    }

    private attrValue(attrName, attributes) {
        let index = _.findIndex(attributes, {name: attrName});
        return index >= 0 ? attributes[index].value : null;
    }

    static from(obj) {
        return new SubmissionSource(obj);
    }
}

@Injectable()
export class SubmissionModel {
    constructor(@Inject(DictionaryService) private dictService: DictionaryService) {
    }

    importSubmission(obj) {

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
        var source = SubmissionSource.from(obj);

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

    exportSubmission(subm: Submission) {
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

    createNew(userName: string, userEmail: string) {
        var sbm = this.importSubmission({});
        sbm.addContact([
            {name: "Name", value: userName || ""},
            {name: "E-mail", value: userEmail || ""}
        ]);
        return this.exportSubmission(sbm);
    }

    validateSubmission(sbm: Submission) {

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