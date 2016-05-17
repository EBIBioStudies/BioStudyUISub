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
                    angular.forEach(attrArray, function (attr) {
                        toAdd[attr.name] = attr.value;
                    });
                }

                if (requiredAttrNames) {
                    angular.forEach(requiredAttrNames, function (attrName) {
                        var val = toAdd[attrName] || "";
                        attributes.add({name: attrName, value: val, required: true});
                        delete toAdd[attrName];
                    });
                }

                angular.forEach(toAdd, function(value, key) {
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
                function update(obj) {
                    var attributeKeys = getAttributeKeys(obj);
                    var colSizeCss = getColSizeCss(obj.fields, attributeKeys);

                    obj.attributeKeys = attributeKeys;
                    obj.colSizeCss = colSizeCss;
                }

                function getAttributeKeys(obj) {
                    var keys = {};
                    angular.forEach(obj.items, function (item) {
                        angular.forEach(item.attributes.attributes, function (attr) {
                            keys[attr.name] = 1;
                        });
                    });
                    return objProperties(keys);
                }

                function getColSizeCss(fields, attributeKeys) {
                    var length = fields.length + attributeKeys.length;
                    if (length > 6) {
                        length = 6;
                    }
                    return 'col-lg-' + Math.ceil(12 / length);
                }

                function objProperties(obj) {
                    var keys = [];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                }

                return {
                    items: [],
                    fields: fields || [],
                    attributeKeys: [],
                    colSizeCss: 'col-lg-6',
                    addNew: function () {
                        this.add();
                    },
                    add: function () {
                        this.items.push(constructor.apply(this, arguments));
                        update(this);
                    },
                    remove: function (index, item) {
                        if (index >= 0) {
                            this.items.splice(index, 1);
                            update(this);
                        }
                    },
                    onAttrNameChanged: function() {
                        update(this);
                    },
                    removeAttr: function(item, attr) {
                        item.attributes.remove(attr);
                        update(this);
                    },
                    addNewAttr: function(item) {
                        item.attributes.addNew();
                    }
                }
            }

            function createSubmission(dict) {
                function requiredAttrNames(type) {
                    var names = [];
                    angular.forEach(dict[type].attributes, function(attr) {
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
                    annotations: createAttributes([], requiredAttrNames("annotation")),
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
                    contacts: createItems([], function(attributes) {
                        attributes = attributes || [];
                        return createItem(attributes, requiredAttrNames("contact"));
                    }),
                    publications: createItems([], function(attributes) {
                        attributes = attributes || [];
                        return createItem(attributes, requiredAttrNames("publication"));
                    }),
                    addAnnotation: function (attr) {
                        this.annotations.add(attr);
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

                var subm = createSubmission(DictionaryService.dict());

                subm.accno = obj.accno || "";
                if (obj.attributes) {
                    subm.releaseDate = parseDate(getAttrValue('ReleaseDate', obj.attributes));
                    subm.title = getAttrValue('Title', obj.attributes) || "";
                }

                var section =  obj.section || {subsections:[]};

                if (section.attributes) {
                    subm.description = getAttrValue('Description', section.attributes) || "";
                    var filtered = _.filter(section.attributes,
                        function (attr) {
                            return attr.name !== 'Description';
                        }
                    );
                    angular.forEach(filtered,
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

                angular.forEach(contacts, function (contact) {
                    subm.addContact(contact.attributes);
                });

                angular.forEach(publications, function (pub) {
                    subm.addPublication(pub.attributes);
                });
                return subm;
            }

            return {
                import: importSubmission
                //export: exportSubmission
            }
        }]
    })();
