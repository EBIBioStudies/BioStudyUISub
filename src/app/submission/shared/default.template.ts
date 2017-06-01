export default {
    "sections": [
        {
            "key": "study",
            "pageTabSection": "Study",
            "mincount": 1,
            "maxcount": 1,
            "fields": [
                {
                    "key": "title",
                    "name": "Title",
                    "type": "text",
                    "required": true,
                    "minlength": 50
                },
                {
                    "key": "description",
                    "name": "Description",
                    "type": "textarea",
                    "required": true,
                    "minlength": 50
                },
                {
                    "key": "releaseDate",
                    "name": "Release Date",
                    "type": "date",
                    "required": true
                }
            ],

            "annotations": {
                "title": "Describe your study",
                "description": "Provide an adequate overview of the Study, make it easier to find and interpret",
                "attributes": [
                    {
                        "name": "Organism",
                        "type": "text",
                        "required": false
                    },
                    {
                        "name": "Experimental design",
                        "type": "text",
                        "required": false
                    },
                    {
                        "name": "Experimental factor",
                        "type": "text",
                        "required": false
                    },
                    {
                        "name": "Organ",
                        "type": "text",
                        "required": false
                    },
                    {
                        "name": "Cell type",
                        "type": "text",
                        "required": false
                    }
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

            "subsections": [
                {
                    "key": "contact",
                    "pageTabSubsection": "Author",
                    "mincount": 1,
                    "title": "Contacts",
                    "description": "Include contact information for one or more authors of the Study",
                    "attributes": [
                        {
                            "name": "Name",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Organisation",
                            "type": "text",
                            "required": true,
                            "typeahead": true
                        },
                        {
                            "name": "E-mail",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Role",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "ORCID",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Address",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Department",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Funding",
                            "type": "text",
                            "required": false
                        }],
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
                    }
                },
                {
                    "key": "publication",
                    "pageTabSubsection": "Publication",
                    "title": "Publications",
                    "description": "Search by PubMed identifier, or add information manually if not in PubMed",
                    "attributes": [
                        {
                            "name": "DOI",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Title",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Authors",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Type",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Issue",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Issn",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Year",
                            "type": "text",
                            "required": false
                        },
                        {
                            "name": "Volume",
                            "type": "text",
                            "required": false
                        }
                    ],
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
                    }
                },
                {
                    "key": "link",
                    "pageTabProperty": "links",
                    "title": "Links",
                    "description": "Provide additional relevant information on the web",
                    "attributes": [
                        {
                            "name": "URL",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Description",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Type",
                            "type": "text",
                            "required": false
                        }
                    ],
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
                    }
                },
                {
                    "key": "file",
                    "pageTabProperty": "links",
                    "title": "Files",
                    "description": "Include Study data, describe the purpose of each file",
                    "attributes": [
                        {
                            "name": "Path",
                            "type": "file",
                            "required": true
                        },
                        {
                            "name": "Description",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Type",
                            "type": "text",
                            "required": false
                        }
                    ],
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
                    }
                }
            ]
        }
    ]
}
