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
                    addNew: function () {
                        this.add({name: "", value: "", required: false});
                    },
                    remove: function (attr) {
                        var index = _.findIndex(this.attributes, {name: attr.name});
                        if (index >= 0) {
                            this.attributes.splice(index, 1);
                        }
                    }
                };

                var toAdd = {};
                if (attrArray) {
                    _.forEach(attrArray, function (attr) {
                        toAdd[attr.name] = attr.value;
                    });
                }

                if (requiredAttrNames) {
                    _.forEach(requiredAttrNames, function (attrName) {
                        var val = toAdd[attrName] || "";
                        attributes.add({name: attrName, value: val, required: true});
                        delete toAdd[attrName];
                    });
                }

                _.forEach(toAdd, function (value, key) {
                    attributes.add({name: key, value: value});
                });

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
                    publications: createItems([], function (attributes) {
                        attributes = attributes || [];
                        return createItem(attributes, requiredAttrNames("publication"));
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
                    var processed = [];
                    _.forEach(attrs, function (attr) {
                        var copy = _.assign({}, attr);
                        if (copy.isReference) {
                            copy.value =  refs[attr.value];
                        }
                        processed.push(copy);
                    });
                    return processed;
                }

                function renameAttributes(attrs) {
                    if (!attrs) {
                        return attrs;
                    }
                    var processed = [];
                    _.forEach(attrs, function (attr) {
                        var copy = _.assign({}, attr);
                        if (copy.name === 'Affiliation') { // Affiliation -> Organisation
                            copy.name = 'Organisation';
                        }
                        processed.push(copy);
                    });
                    return processed;
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
                    subm.addPublication(pub.attributes);
                });
                return subm;
            }
            
            function exportSubmission(subm) {
                subm = _.assign({}, subm); // a copy

                function copyAttributes(attrs) {
                    return _.map(attrs, function(attr) {
                        return {name: attr.name, value:attr.value};
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
                    var file = {path: item.path, attributes: copyAttributes(item.attributes.items)};
                    out.section.files.push(file);
                });

                _.forEach(subm.links.items, function(item) {
                    var link = {url: item.url, attributes: copyAttributes(item.attributes.items)};
                    out.section.links.push(link);
                });

                _.forEach(subm.publications.items, function(item) {
                    var subsection = {type: "Publication", attributes: copyAttributes(item.attributes.items)};
                    out.section.subsections.push(subsection);
                });

                var mem = {};
                var organisations = [];
                var refIndex = 0;
                _.forEach(subm.contacts.items, function(item) {
                    var attributes = copyAttributes(item.attributes.items);
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

            return {
                import: importSubmission,
                export: exportSubmission
            }
        }]
    })();
