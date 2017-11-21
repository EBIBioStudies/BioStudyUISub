export const DefaultTemplate = {
    'name': 'DeafultTemplate',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'annotationsType': {
            'title': 'Describe your study',
            'description': 'Provide any supplementary details of the study that may help discover and/or interpret it',
            'icon': 'fa-tag',
            'columnTypes': [
                {
                    'name': 'Organism',
                    'valueType': 'text',
                    'required': true
                },
                {
                    'name': 'Experimental design',
                    'valueType': 'text'
                },
                {
                    'name': 'Experimental factor',
                    'valueType': 'text'
                },
                {
                    'name': 'Organ',
                    'valueType': 'text'
                },
                {
                    'name': 'Cell type',
                    'valueType': 'text'
                }
            ]
        },
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-font',
                'valueType': 'text',
                'required': true,
                'minlength': 50
            },
            {
                'name': 'Release Date',
                'icon': 'fa-calendar',
                'valueType': 'date',
                'required': true
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'textblob',
                'required': true,
                'minlength': 50
            }
        ],
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'description': 'Include contact information for one or more authors of the study',
                'icon': 'fa-vcard',
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Organisation',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'E-mail',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Role',
                        'valueType': 'text'
                    },
                    {
                        'name': 'ORCID',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Address',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Department',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Funding',
                        'valueType': 'text'
                    }
                ]
            },
            {
                'name': 'Publication',
                'title': 'Add Publications',
                'description': 'Search by PubMed identifier, or add information manually if not in PubMed',
                'icon': 'fa-book',
                'columnTypes': [
                    {
                        'name': 'DOI',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Title',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Authors',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Issue',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Issn',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Year',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Volume',
                        'valueType': 'text'
                    }
                ]
            },
            {
                'name': 'Link',
                'title': 'Add Links',
                'description': 'Provide links to any additional documentation that may be of relevance',
                'icon': 'fa-link',
                'columnTypes': [
                    {
                        'name': 'URL',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Description',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text'
                    }
                ]
            },
            {
                'name': 'File',
                'title': 'Add Files',
                'description': 'List the data files for the study and describe their respective scopes',
                'icon': 'fa-file',
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': 'file',
                        'required': true
                    },
                    {
                        'name': 'Description',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text'
                    }
                ]
            }
        ]
    }
};
