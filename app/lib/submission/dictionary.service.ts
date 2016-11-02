import {Injectable, Inject} from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class DictionaryService {
    private data;

    constructor() {

        this.data = {
            "annotation": {
                "title": "Describe your study",
                "description": "Provide an adequate overview of the Study, make it easier to find and interpret",
                "attributes": [
                    {"name": "Organism", type: "text", "required": false},
                    {"name": "Experimental design", type: "text", "required": false},
                    {"name": "Experimental factor", type: "text", "required": false},
                    {"name": "Organ", type: "text", "required": false},
                    {"name": "Cell type", type: "text", "required": false}
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
                "title": "Publications",
                "description": "Search by PubMed identifier, or add information manually if not in PubMed",
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
                    {"name": "DOI", type: "text", "required": false},
                    {"name": "Title", type: "text", "required": true},
                    {"name": "Authors", type: "text", "required": false},
                    {"name": "Type", type: "text", "required": false},
                    {"name": "Issue", type: "text", "required": false},
                    {"name": "Issn", type: "text", "required": false},
                    {"name": "Year", type: "text", "required": false},
                    {"name": "Volume", type: "text", "required": false}
                ]
            },
            "link": {
                "title": "Links",
                "description": "Provide additional relevant information on the web",
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
                "attributes": [
                    {"name": "URL", type: "text", "required": true},
                    {"name": "Description", type: "text", "required": true},
                    {"name": "Type", type: "text", "required": false}
                ]
            },
            "contact": {
                "title": "Contacts",
                "description": "Include contact information for one or more authors of the Study",
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
                    {"name": "Name", type: "text", "required": true},
                    {"name": "Organisation", type: "text", "required": true, "typeahead": true},
                    {"name": "E-mail", type: "text", "required": true},
                    {"name": "Role", type: "text", "required": false},
                    {"name": "ORCID", type: "text", "required": false},
                    {"name": "Address", type: "text", "required": false},
                    {"name": "Departement", type: "text", "required": false},
                    {"name": "Funding", type: "text", "required": false}
                ]
            },

            "file": {
                "title": "Files",
                "description": "Include Study data, describe the purpose of each file",
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
                        "popup": "Edit file annotations"
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
                "attributes": [
                    {"name": "Path", type: "file", "required": true},
                    {"name": "Description", type: "text", "required": true},
                    {"name": "Type", type: "text", "required": false}
                ]
            }
        };
    }

    byKey(key: string) {
        if (this.data.hasOwnProperty(key)) {
            return _.cloneDeep(this.data[key]);
        }

        console.error("dictionary key '" + key + "' doesn't exist");
        return {};
    }

    dict() {
        return _.cloneDeep(this.data);
    }
}
