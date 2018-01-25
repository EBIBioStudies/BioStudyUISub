export const DefaultTemplate = {
    'name': 'DeafultTemplate',
    'sectionType': {
        'name': 'Study',
        'annotationsType': {
            'title': 'Describe your study',
            'description': 'Provide any supplementary details of the study that may help discover and/or interpret it',
            'icon': 'fa-tag',
            'columnTypes': [
                {
                    'name': 'Organism',
                    'valueType': 'text',
                    'values': ['Homo sapiens', 'Gallus gallus', 'Rattus norvegicus', 'Mus musculus', 'Arabidopsis thaliana', 'Escherichia coli', 'Danio rerio']
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
                'valueType': 'textblob',
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
                'description': 'Include the contact details for the authors of the study',
                'icon': 'fa-vcard',
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'E-mail',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Organisation',
                        'valueType': 'text',
                        'values': ['European Bioinformatics Institute', 'Wellcome Sanger Institute', 'Francis Crick Institute', 'MRC Laboratory of Molecular Biology'],
                        'required': true
                    },
                    {
                        'name': 'Role',
                        'valueType': 'text'
                    },
                    {
                        'name': 'ORCID',
                        'valueType': 'orcid',
                        'displayed': true
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
                'name': 'Publication',
                'title': 'Add Publications',
                'description': 'Add the details of publications relevant or complementary to the study',
                'icon': 'fa-book',
                'columnTypes': [
                    {
                        'name': 'PMID',
                        'valueType': 'pubmedid',
                        'displayed': true
                    },
                    {
                        'name': 'Authors',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Title',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Year',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Volume',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Issue',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Issn',
                        'valueType': 'text'
                    },
                    {
                        'name': 'DOI',
                        'valueType': 'text'
                    },
                ]
            }
        ]
    }
};
