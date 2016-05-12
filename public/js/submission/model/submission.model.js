'use strict';

module.exports =
    (function () {
        return ['_', function (_) {

            function createAttributes(attrArray) {
                var attributes = {
                    attributes: [],
                    add: function (attr) {
                        this.attributes.push({name: attr.name, value: attr.value});
                    },
                    addNew: function () {
                        this.add({name: "", value: ""});
                    },
                    remove: function (attr) {
                        var index = _.findIndex(this.attributes, {name: attr.name});
                        if (index >= 0) {
                            this.attributes.splice(index, 1);
                        }
                    }
                };

                if (attrArray) {
                    angular.forEach(attrArray, function(attr) {
                       attributes.add(attr);
                    });
                }
                return attributes;
            }

            function objProperties(obj) {
                var keys = [];
                for(var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return keys;
            }

            function createFileItem(path, attrArray) {
                return {
                    path: path,
                    attributes: createAttributes(attrArray)
                }
            }

            function createItems() {
                function update(obj) {
                    var keys = {};
                    angular.forEach(obj.items, function(item) {
                        angular.forEach(item.attributes.attributes, function(attr) {
                            keys[attr.name] = 1;
                        });
                    });
                    obj.attributeKeys = objProperties(keys);
                }
                return {
                    attributeKeys: [],
                    items: [],
                    addNew: function() {
                        this.add({});
                    },
                    add: function(item) {
                        this.items.push(item);
                        update(this);
                    },
                    remove: function(index, item) {
                        if (index >= 0) {
                            this.items.splice(index, 1);
                            update(this);
                        }
                    }
                }
            }

            function createSubmission() {
                return {
                    accno: "",
                    title: "",
                    description: "",
                    releaseDate: null,
                    annotations: createAttributes(),
                    files: createItems(),
                    links: [],
                    contacts: [],
                    publications: [],
                    addAnnotation: function (attr) {
                        this.annotations.add(attr);
                    },
                    addLink: function (url, attributes) {
                        //todo 
                    },
                    addFile: function (path, attributes) {
                        this.files.add(createFileItem(path, attributes)); 
                    },
                    addContact: function (attributes) {
                        //todo
                    },
                    addPublication: function (attributes) {
                        //todo
                    }
                }
            }

            function importSubmission(obj) {

                function getAttrValue(attrName, attributes) {
                    var index = _.findIndex(attributes, {name: attrName});
                    return index >= 0 ? attributes[index].value : null;
                }

                var subm = createSubmission();

                subm.accno = obj.accno;
                if (obj.attributes) {
                    var rdate = getAttrValue('ReleaseDate', obj.attributes);
                    if (rdate != null) {
                        subm.releaseDate = _.isDate(rdate) ? rdate : new Date(rdate);
                    }
                    subm.title = getAttrValue('Title', obj.attributes) || "";
                }

                if (obj.section.attributes) {
                    subm.description = getAttrValue('Description', obj.section.attributes) || "";
                    var filtered = _.filter(obj.section.attributes,
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

                if (obj.section.links) {
                    angular.forEach(obj.section.links, function (link) {
                        subm.addLink(link.url, link.attributes);
                    });
                }

                if (obj.section.files) {
                    angular.forEach(obj.section.files, function (file) {
                        subm.addFile(file.path, file.attributes);
                    });
                }

                var contacts = _.filter(obj.section.subsections, {type: 'Author'});
                var publications = _.filter(obj.section.subsections, {type: 'Publication'});

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
            }
        }]
    })();
