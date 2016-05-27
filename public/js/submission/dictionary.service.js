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
                    "previewTabHeading": "All publications",
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
                            "title": "Add publication annotation",
                            "popup": "Describe Publication"
                        },
                        "deleteAttr": {
                            "title": "Delete publication annotation",
                            "popup": "Delete publication annotation"
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
                    "previewTabHeading": "All links",
                    "actions": {
                        "add": {
                            "title": "Add link"
                        },
                        "delete": {
                            "popup": "Delete link"
                        },
                        "edit": {
                            "popup": "Edit link"
                        },
                        "addAttr": {
                            "title": "Add link annotation",
                            "popup": "Describe Link"
                        },
                        "deleteAttr": {
                            "title": "Delete link annotation",
                            "popup": "Delete link annotation"
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
                    "previewTabHeading": "All contacts",
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
                            "title": "Add contact annotation",
                            "popup": "Describe Contact"
                        },
                        "deleteAttr": {
                            "title": "Delete contact annotation",
                            "popup": "Delete contact annotation"
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
                    "previewTabHeading": "All files",
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
                            "title": "Add file annotation",
                            "popup": "Describe File"
                        },
                        "deleteAttr": {
                            "title": "Delete file annotation",
                            "popup": "Delete file annotation"
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
