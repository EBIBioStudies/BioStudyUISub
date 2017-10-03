export const DefaultTemplate = {
    'name': 'DeafultTemplate',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'annotationsType': {
            'title': 'Describe your study',
            'description': 'Provide enough details of the study to make it easier to find and interpret',
            'columnTypes': [
                {
                    'name': 'Organism',
                    'valueType': 'text'
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
                'valueType': 'text',
                'required': true,
                'minlength': 50
            },
            {
                'name': 'Release Date',
                'valueType': 'date',
                'required': true
            },
            {
                'name': 'Description',
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
                'description': 'Provide additional relevant information on the web',
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
                'description': 'Include study data, describing the purpose of each file',
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
