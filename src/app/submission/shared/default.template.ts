export const DefaultTemplate = {
    "sectionTypes": [
        {
            "name": "Submission",
            "required": true,
            "maxcount": 1,
            "sectionTypes": [
                {
                    "name": "Study",
                    "required": true,
                    "maxcount": 1,
                    "fieldTypes": [
                        {
                            "name": "Title",
                            "valueType": "textline",
                            "required": true,
                            "minlength": 50
                        },
                        {
                            "name": "Release Date",
                            "valueType": "date",
                            "required": true
                        },
                        {
                            "name": "Description",
                            "valueType": "text",
                            "required": true,
                            "minlength": 50
                        }
                    ],
                    "featureTypes": [
                        {
                            "name": "Annotation",
                            "singleRow": true,
                            "title": "Describe your study",
                            "description": "Provide an adequate overview of the Study, make it easier to find and interpret",
                            "required": true,
                            "columnTypes": [
                                {
                                    "name": "Organism",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Experimental design",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Experimental factor",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Organ",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Cell type",
                                    "valueType": "textline"
                                }
                            ]
                        },
                        {
                            "name": "Contact",
                            "title": "Add Contacts",
                            "description": "Include contact information for one or more authors of the Study",
                            "required": true,
                            "minrows": 1,
                            "columnTypes": [
                                {
                                    "name": "Name",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Organisation",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "E-mail",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Role",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "ORCID",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Address",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Department",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Funding",
                                    "valueType": "textline"
                                }
                            ]
                        },
                        {
                            "name": "Publication",
                            "title": "Add Publications",
                            "description": "Search by PubMed identifier, or add information manually if not in PubMed",
                            "required": true,
                            "columnTypes": [
                                {
                                    "name": "DOI",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Title",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Authors",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Type",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Issue",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Issn",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Year",
                                    "valueType": "textline"
                                },
                                {
                                    "name": "Volume",
                                    "valueType": "textline"
                                }
                            ]
                        },
                        {
                            "name": "Link",
                            "title": "Add Links",
                            "description": "Provide additional relevant information on the web",
                            "required": true,
                            "columnTypes": [
                                {
                                    "name": "URL",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Description",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Type",
                                    "valueType": "textline"
                                }
                            ]
                        },
                        {
                            "name": "File",
                            "title": "Add Files",
                            "description": "Include Study data, describe the purpose of each file",
                            "required": true,
                            "columnTypes": [
                                {
                                    "name": "Path",
                                    "valueType": "file",
                                    "required": true
                                },
                                {
                                    "name": "Description",
                                    "valueType": "textline",
                                    "required": true
                                },
                                {
                                    "name": "Type",
                                    "valueType": "textline"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};