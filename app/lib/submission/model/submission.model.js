import 'lodash'

var _ = window._;

class Attributes {
    constructor() {
        this.attributes = [];
    }

    add(attr) {
        this.attributes.push(
            {
                name: attr.name,
                value: attr.value,
                type: attr.type || "text",
                required: attr.required === true
            });
    }

    addNew(name, value) {
        this.add({name: name || '', value: value || '', required: false});
    }

    remove(index) {
        if (index >= 0) {
            this.attributes.splice(index, 1);
        }
    }

    indexOf(name) {
        return _.findIndex(this.attributes, {name: name});
    }

    update(obj) {
        _.forOwn(obj, (value, key) => {
            var index = this.indexOf(key);
            if (index >= 0) {
                this.attributes[index].value = value;
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
    static create(attributes, required) {
        var attrs = new Attributes();

        if (required) {
            _.forEach(required, function (attr) {
                attrs.add({name: attr.name, type: attr.type, value: '', required: true});
            });
        }

        var claimed = {};
        var leftover = _.filter(attributes, (attr) => {
            var index = attrs.indexOf(attr.name);
            if (index >= 0 && !claimed[attr.name]) {
                attrs.attributes[index].value = attr.value;
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
    constructor(itemConstructor) {
        this.items = [];
        this.__itemConstructor__ = itemConstructor;
    }

    addNew() {
        this.add();
    }

    add() {
        this.items.push(this.__itemConstructor__.apply(this, arguments));
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
    constructor(attributes, required) {
        attributes = attributes || [];
        required = required || [];
        this.attributes = Attributes.create(attributes, required);
    }

    static factory(required) {
        return function (attributes) {
            return new Item(attributes, required);
        };
    }

    static publicationFactory(required) {
        return function (pubMedId, attributes) {
            var item = new Item(attributes, required);
            item.pubMedId = pubMedId; // can't make it an attribute as it's rendered differently
            return item;
        };
    }
}

class Submission {
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
        this.publications = Items.create(Item.publicationFactory(requiredAttributes('publication')));
    }

    addAnnotation(attr) {
        this.annotations.items[0].attributes.add(attr);
    }

    addLink(attributes) {
        this.links.add(attributes);
    }

    addFile(attributes) {
        this.files.add(attributes);
    }

    addContact(attributes) {
        this.contacts.add(attributes);
    }

    addPublication(pubMedId, attributes) {
        this.publications.add(pubMedId, attributes);
    }

    static create(dict) {
        return new Submission(dict);
    }
}

export default class SubmissionModel {
    constructor(_, DictionaryService) {
        "ngInject";

        function importSubmission(obj) {

            function getAttrValue(attrName, attributes) {
                var index = _.findIndex(attributes, {name: attrName});
                return index >= 0 ? attributes[index].value : null;
            }

            function parseDate(str) { // yyyy-mm-dd
                if (!str) {
                    return null;
                }
                if (_.isDate(str)) {
                    return str;
                }
                return new Date(str);
            }

            function resolveReferences(attrs, refs) {
                if (!attrs) {
                    return attrs;
                }
                return _.map(attrs, function (attr) {
                    var copy = _.assign({}, attr);
                    if (copy.isReference) {
                        copy.value = refs[attr.value];
                    }
                    return copy;
                });
            }

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

            var subm = Submission.create(DictionaryService.dict());

            subm.accno = obj.accno || '';
            if (obj.attributes) {
                subm.releaseDate = parseDate(getAttrValue('ReleaseDate', obj.attributes));
                subm.title = getAttrValue('Title', obj.attributes) || "";
            }

            var section = obj.section || {subsections: []};

            if (section.attributes) {
                subm.description = getAttrValue('Description', section.attributes) || "";
                _.forEach(_.reject(section.attributes, {name: 'Description'}),
                    function (attr) {
                        subm.addAnnotation(attr);
                    }
                );
            }

            if (section.links) {
                _.forEach(section.links, function (link) {
                    subm.addLink(joinAttributes(link.attributes, [{name: 'URL', value: link.url}]));
                });
            }

            if (section.files) {
                _.forEach(section.files, function (file) {
                    subm.addFile(joinAttributes(file.attributes, [{name: 'Path', value: file.path}]));
                });
            }

            var contacts = _.filter(section.subsections, {type: 'Author'});
            var publications = _.filter(section.subsections, {type: 'Publication'});
            var references = {};
            _.forEach(_.filter(section.subsections,
                function (s) {
                    return _.isString(s.accno) && s.accno;
                }),
                function (s) {
                    var attrs = s.attributes;
                    references[s.accno] = attrs.length > 0 ? (attrs[0].value || "") : "";
                });

            _.forEach(contacts, function (contact) {
                subm.addContact(renameAttributes(resolveReferences(contact.attributes, references)));
            });

            _.forEach(publications, function (pub) {
                var pubMedId = getAttrValue('PubMedId', pub.attributes) || "";
                var attrs = _.reject(pub.attributes, {name: "PubMedId"});
                subm.addPublication(pubMedId, attrs);
            });
            return subm;
        }

        function exportSubmission(subm) {
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
                var subsection = {type: 'Affiliation', accno: mem[org], attributes: [{name: 'Name', value: org}]};
                out.section.subsections.push(subsection);
            });

            return out;
        }

        function createNew(userName, userEmail) {
            var sbm = importSubmission({});
            sbm.addContact([
                {name: "Name", value: userName || ""},
                {name: "E-mail", value: userEmail || ""}
            ]);
            return exportSubmission(sbm);
        }

        function validateSubmission(sbm) {

            function requiredAttribute(itemKey, attrKey) {
                return function (sbm) {
                    for (var item in sbm[itemKey].items) {
                        var attrIndex = _.findIndex(item.attributes, {name: attrKey});
                        if (attrIndex < 0) {
                            return false;
                        }
                        var attr = item.attributes[attrIndex].value;
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

            _.forEach(_.filter(DictionaryService.byKey('contact').attributes, {required: 'true'}), function (attr) {
                rules["Contact '" + attr.name + "' is required"] = requiredAttribute('contacts', attr.name);
            });

            _.forEach(_.filter(DictionaryService.byKey('link').attributes, {required: 'true'}), function (attr) {
                rules["Link '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
            });

            _.forEach(_.filter(DictionaryService.byKey('file').attributes, {required: 'true'}), function (attr) {
                rules["File '" + attr.name + "' is required"] = requiredAttribute('links', attr.name);
            });

            _.forEach(_.filter(DictionaryService.byKey('publication').attributes, {required: 'true'}), function (attr) {
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

        Object.assign(this, {
            create: createNew,
            import: importSubmission,
            export: exportSubmission,
            validate: validateSubmission
        });
    }
}
