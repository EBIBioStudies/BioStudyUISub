'use strict';

module.exports =
    (function () {
        return ['_', 'DictionaryService', function (_, DictionaryService) {

            function createAttributes(attrArray, requiredAttrNames) {
                var attributes = {
                    attributes: [],
                    add: function (attr) {
                        this.attributes.push({name: attr.name, value: attr.value, required: attr.required === true});
                    },
                    addNew: function (name, value) {
                        this.add({name: name || "", value: value || "", required: false});
                    },
                    remove: function (index) {
                        if (index >= 0) {
                            this.attributes.splice(index, 1);
                        }
                    },
                    indexOf: function(name) {
                        return _.findIndex(this.attributes, {name: name});
                    },
                    update: function (obj) {
                        var self = this;
                        _.forOwn(obj, function(value, key) {
                            var index = self.indexOf(key);
                            if (index >= 0) {
                                self.attributes[index].value = value;
                            } else {
                                self.addNew(key, value);
                            }
                        });
                    }
                };

                if (requiredAttrNames) {
                    _.forEach(requiredAttrNames, function (attrName) {
                        attributes.add({name: attrName, value: "", required: true});
                    });
                }

                var  claimed = {};
                var leftover = _.filter(attrArray, function (attr) {
                    var index = attributes.indexOf(attr.name);
                    if (index >= 0 && !claimed[attr.name]) {
                        attributes.attributes[index][attr.name] = attr.value;
                        claimed[attr.name] = true; //only first value is used
                        return false;
                    }
                    return true;
                });

                _.forEach(leftover, function(attr) {attributes.add(attr)});

                return attributes;
            }

            function createFileItem(path, attrArray, requiredAttrNames) {
                var item = createItem(attrArray, requiredAttrNames);
                item.path = path;
                return item;
            }

            function createLinkItem(url, attrArray, requiredAttrNames) {
                var item = createItem(attrArray, requiredAttrNames);
                item.url = url;
                return item;
            }

            function createPublicationItem(pubMedId, attrArray, requiredAttrNames) {
                var item = createItem(attrArray, requiredAttrNames);
                item.pubMedId = pubMedId; // can't make it an attribute as it's rendered differently
                return item;
            }

            function createItem(attrArray, requiredAttrNames) {
                return {
                    attributes: createAttributes(attrArray, requiredAttrNames)
                }
            }

            function createItems(fields, constructor) {
                return {
                    items: [],
                    fields: fields || [],
                    addNew: function () {
                        this.add();
                    },
                    add: function () {
                        this.items.push(constructor.apply(this, arguments));
                    },
                    remove: function (index, item) {
                        if (index >= 0) {
                            this.items.splice(index, 1);
                        }
                    }
                }
            }

            function createSubmission(dict) {
                function requiredAttrNames(type) {
                    var names = [];
                    _.forEach(dict[type].attributes, function (attr) {
                        if (attr.required) {
                            names.push(attr.name);
                        }
                    });
                    return names;
                }

                return {
                    accno: "",
                    title: "",
                    description: "",
                    releaseDate: null,
                    annotations: (function() {
                        var items = createItems([], function (attributes) {
                            attributes = attributes || [];
                            return createItem(attributes, requiredAttrNames("annotation"));
                        });
                        items.addNew();
                        return items;
                    })(),
                    files: createItems(["path"], function (path, attributes) {
                        path = path || "";
                        attributes = attributes || [];
                        return createFileItem(path, attributes, requiredAttrNames("file"));
                    }),
                    links: createItems(["url"], function (url, attributes) {
                        url = url || "";
                        attributes = attributes || [];
                        return createLinkItem(url, attributes, requiredAttrNames("link"));
                    }),
                    contacts: createItems([], function (attributes) {
                        attributes = attributes || [];
                        return createItem(attributes, requiredAttrNames("contact"));
                    }),
                    publications: createItems([], function (pubMedId, attributes) {
                        pubMedId = pubMedId || "";
                        attributes = attributes || [];
                        return createPublicationItem(pubMedId, attributes, requiredAttrNames("publication"));
                    }),
                    addAnnotation: function (attr) {
                        this.annotations.items[0].attributes.add(attr);
                    },
                    addLink: function (url, attributes) {
                        this.links.add(url, attributes);
                    },
                    addFile: function (path, attributes) {
                        this.files.add(path, attributes);
                    },
                    addContact: function (attributes) {
                        this.contacts.add(attributes);
                    },
                    addPublication: function (attributes) {
                        this.publications.add(attributes);
                    }
                }
            }

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
                            copy.value =  refs[attr.value];
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

                var subm = createSubmission(DictionaryService.dict());

                subm.accno = obj.accno || "";
                if (obj.attributes) {
                    subm.releaseDate = parseDate(getAttrValue('ReleaseDate', obj.attributes));
                    subm.title = getAttrValue('Title', obj.attributes) || "";
                }

                var section = obj.section || {subsections: []};

                if (section.attributes) {
                    subm.description = getAttrValue('Description', section.attributes) || "";
                    var filtered = _.filter(section.attributes,
                        function (attr) {
                            return attr.name !== 'Description';
                        }
                    );
                    _.forEach(filtered,
                        function (attr) {
                            subm.addAnnotation(attr);
                        }
                    );
                }

                if (section.links) {
                    angular.forEach(section.links, function (link) {
                        subm.addLink(link.url, link.attributes);
                    });
                }

                if (section.files) {
                    angular.forEach(section.files, function (file) {
                        subm.addFile(file.path, file.attributes);
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
                        references[s.accno] = attrs.length > 0 ? (attrs[0].value  || "") : "";
                    });

                angular.forEach(contacts, function (contact) {
                    subm.addContact(renameAttributes(resolveReferences(contact.attributes, references)));
                });

                angular.forEach(publications, function (pub) {
                    var pubMedId = getAttrValue('PubMedId', pub.attributes) || "";
                    var attrs =  _.reject(pub.attributes, {name: "PubMedId"});
                    subm.addPublication(pubMedId, attrs);
                });
                return subm;
            }
            
            function exportSubmission(subm) {
                subm = _.assign({}, subm); // a copy

                function copyAttributes(attrs) {
                    return _.map(attrs, function (attr) {
                        return {name: attr.name, value: attr.value};
                    });
                }

                function renameAttributes(attrs) {
                    _.forEach(attrs, function(attr) {
                        if (attr.name === 'Organisation') { // Organisation --> Affiliation
                            attr.name = 'Affiliation';
                        }
                    });
                    return attrs;
                }
                
                var out = {
                    accno: subm.accno || "",
                    type: "Submission",
                    //accessTags:["Public"], // public submission??
                    attributes: [
                        {
                            name: "Title",
                            value: subm.title
                        },
                        {
                            name: "ReleaseDate",
                            value: _.isDate(subm.releaseDate) ? subm.releaseDate.toISOString().substring(0, 10) : ""
                        }
                    ],
                    section: {
                        type: "Study",
                        attributes: [],
                        links: [],
                        files:[],
                        subsections: []
                    }
                };

                out.section.attributes.push({name: "Description", value: subm.description});
                _.forEach(subm.annotations.items[0].attributes.attributes, function (attr) {
                    out.section.attributes.push({name: attr.name, value: attr.value});
                });

                _.forEach(subm.files.items, function(item) {
                    var file = {path: item.path, attributes: copyAttributes(item.attributes.attributes)};
                    out.section.files.push(file);
                });

                _.forEach(subm.links.items, function(item) {
                    var link = {url: item.url, attributes: copyAttributes(item.attributes.attributes)};
                    out.section.links.push(link);
                });

                _.forEach(subm.publications.items, function(item) {
                    var attrs = copyAttributes(item.attributes.attributes);
                    attrs.push({name: "PubMedId", value: item.pubMedId});
                    var subsection = {type: "Publication", attributes: attrs};
                    out.section.subsections.push(subsection);
                });

                var mem = {};
                var organisations = [];
                var refIndex = 0;
                _.forEach(subm.contacts.items, function(item) {
                    var attributes = copyAttributes(item.attributes.attributes);
                    _.forEach(attributes, function(attr) {
                        if (attr.name === "Organisation") {
                            var org = attr.value;
                            if (!mem[org]) {
                                mem[org] = "ref" + (++refIndex);
                                organisations.push(org);
                            }
                            attr.value = mem[org];
                            attr.isReference = true;
                        }
                    });
                    var subsection = {type: "Author", attributes: renameAttributes(attributes)};
                    out.section.subsections.push(subsection);
                });

                _.forEach(organisations, function(org) {
                    var subsection = {type: "Affiliation", accno: mem[org], attributes: [{name: "Name", value: org}]};
                    out.section.subsections.push(subsection);
                });

                return out;
            }

            function createNew() {
                return exportSubmission(importSubmission({}));
            }

            return {
                create: createNew,
                import: importSubmission,
                export: exportSubmission
            }
        }]
    })();
