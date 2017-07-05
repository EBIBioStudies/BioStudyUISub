export const DefaultTemplate = {
    "sections": [
        {
            "type": "Study",
            "required": true,
            "fields": [
                {
                    "name": "Title",
                    "type": "text",
                    "required": true,
                    "minlength": 50
                },
                {
                    "name": "Release Date",
                    "type": "date",
                    "required": true
                },
                {
                    "name": "Description",
                    "type": "textarea",
                    "required": true,
                    "minlength": 50
                }
            ],
            "features": [
                {
                    "type": "Annotation",
                    "singleRow": true,
                    "title": "Describe your study",
                    "description": "Provide an adequate overview of the Study, make it easier to find and interpret",
                    "required": true,
                    "columns": [
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
                    ]
                },
                {
                    "type": "Contact",
                    "singleRow": false,
                    "title": "Contacts",
                    "description": "Include contact information for one or more authors of the Study",
                    "required": true,
                    "minrows": 1,
                    "columns": [
                        {
                            "name": "Name",
                            "type": "text",
                            "required": true
                        },
                        {
                            "name": "Organisation",
                            "type": "text",
                            "required": true,
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
                        }
                    ]
                },
                {
                    "type": "Publication",
                    "singleRow": false,
                    "title": "Publications",
                    "description": "Search by PubMed identifier, or add information manually if not in PubMed",
                    "required": true,
                    "columns": [
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
                    ]
                },
                {
                    "type": "Link",
                    "singleRow": false,
                    "title": "Links",
                    "description": "Provide additional relevant information on the web",
                    "required": true,
                    "columns": [
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
                    ]
                },
                {
                    "type": "File",
                    "singleRow": false,
                    "title": "Files",
                    "description": "Include Study data, describe the purpose of each file",
                    "required": true,
                    "columns": [
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
                    ]
                }
            ]
        }
    ]
}
