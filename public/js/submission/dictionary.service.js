'use strict';

module.exports =
    (function () {
        return ['$log', function ($log) {
            var dict = {
                "annotation": {
                    "title": "Describe your study",
                    "attributes": [
                        {"name": "Experiment type", "required": false},
                        {"name": "Keywords", "required": false}
                    ],
                    "actions": {
                        "add": {
                            "title": "Add annotation"
                        },
                        "deleteAttr": {
                            "title": "Delete annotation",
                            "popup": "Delete annotation"
                        }
                    }
                },
                "publication": {
                    "type": "Publication",
                    "title": "Publications",
                    "tabHeading": "Publication",
                    "actions": {
                        "add": {
                            "title": "Add publication"
                        },
                        "delete": {
                            "popup": "Delete publication"
                        },
                        "edit": {
                            "popup": "Edit publication"
                        },
                        "addAttr": {
                            "title": "Create description",
                            "popup": "Describe contact"
                        },
                        "deleteAttr": {
                            "title": "Delete description",
                            "popup": "Delete description"
                        }
                    },
                    "attributes": [
                        {"name": "DOI", "required": false},
                        {"name": "Title", "required": true},
                        {"name": "Authors", "required": false},
                        {"name": "Type", "required": false},
                        {"name": "Issue", "required": false},
                        {"name": "Issn", "required": false},
                        {"name": "Year", "required": false},
                        {"name": "Volume", "required": false}
                    ]
                },
                "link": {
                    "title": "Links",
                    "tabHeading": "Link",
                    "actions": {
                        "add": {
                            "title": "Add link"
                        },
                        "delete": {
                            "popup": "Delete the link"
                        },
                        "edit": {
                            "popup": "Edit the link"
                        },
                        "addAttr": {
                            "title": "Create description",
                            "popup": "Describe the link"
                        },
                        "deleteAttr": {
                            "title": "Delete description",
                            "popup": "Delete description"
                        }
                    },
                    "fields": [
                        {
                            "name": "url",
                            "label": "URL",
                            "placeholder": "Type a valid URL, e.g., http://www.ebi.ac.uk",
                            "type": "text"
                        }
                    ],
                    "attributes": [
                        {"name": "Description", "required": true},
                        {"name": "Type", "required": false}
                    ]
                },
                "contact": {
                    "type": "Contact",
                    "title": "Contacts",
                    "tabHeading": "Contact",
                    "actions": {
                        "add": {
                            "title": "Add contact"
                        },
                        "delete": {
                            "popup": "Delete contact"
                        },
                        "edit": {
                            "popup": "Edit contact"
                        },
                        "addAttr": {
                            "title": "Create description",
                            "popup": "Describe contact"
                        },
                        "deleteAttr": {
                            "title": "Delete description",
                            "popup": "Delete description"
                        }
                    },
                    "attributes": [
                        {"name": "Name", "required": true},
                        {"name": "Organisation", "required": true, "typeahead": true},
                        {"name": "Department", "required": false},
                        {"name": "E-mail", "required": true}
                    ]
                },

                "file": {
                    "title": "Files",
                    "tabHeading": "File",
                    "actions": {
                        "add": {
                            "title": "Add file"
                        },
                        "delete": {
                            "popup": "Delete file"
                        },
                        "edit": {
                            "popup": "Edit file"
                        },
                        "addAttr": {
                            "title": "Create description",
                            "popup": "Describe contact"
                        },
                        "deleteAttr": {
                            "title": "Delete description",
                            "popup": "Delete description"
                        }
                    },
                    "fields": [
                        {
                            "name": "path",
                            "label": "Path",
                            "type": "select"
                        }
                    ],
                    "attributes": [
                        {"name": "Description", "required": true},
                        {"name": "Type", "required": false}
                    ]
                }
            };
            return {
                byKey: function (key) {
                    if (dict.hasOwnProperty(key)) {
                        return angular.copy(dict[key]);
                    }
                    $log.error("dictionary key '" + key + "' doesn't exist");
                    return {};
                },
                dict: function() {
                    return angular.copy(dict);
                }
            }
        }];
    })();
