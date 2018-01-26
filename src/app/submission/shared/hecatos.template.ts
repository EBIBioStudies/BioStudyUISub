export const DefaultTemplate = {
    'name': 'DeafultTemplate',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'annotationsType': {
            'singleRow': true,
            'title': 'Describe your study',
            'description': 'Provide an adequate overview of the Study, make it easier to find and interpret',
            'columnTypes': [
                {
                    'name': 'Factor',
                    'valueType': 'text'
                }
            ]
        },
        'fieldTypes': [
            {
                'name': 'Title',
                'valueType': 'text',
                'required': true,
                'maxlength': 50
            },
            {
                'name': 'Description',
                'valueType': 'textblob',
                'minlength': 50
            },
            {
                'name': 'Design type',
                'valueType': 'text'
            },
            {
                'name': 'Assay measurement type',
                'valueType': 'text'
            },
            {
                'name': 'Assay technology type',
                'valueType': 'text'
            },
            {
                'name': 'Assay technology platform',
                'valueType': 'text'
            },
            {
                'name': 'Organism',
                'valueType': 'text'
            },
            {
                'name': 'Organ',
                'valueType': 'text'
            },
            {
                'name': 'Sample type',
                'valueType': 'text'
            },
            {
                'name': 'Biological replicate',
                'valueType': 'text'
            },
            {
                'name': 'Compound',
                'valueType': 'text'
            },
            {
                'name': 'CHEMBL ID',
                'valueType': 'text'
            },
            {
                'name': 'StdInChIKey',
                'valueType': 'text'
            },
            {
                'name': 'Dose',
                'valueType': 'text'
            },
            {
                'name': 'Protocol Type',
                'valueType': 'text'
            },
            {
                'name': 'Data type',
                'valueType': 'text'
            }
        ],
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'description': 'Include contact information for one or more authors of the Study',
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
                'name': 'File',
                'title': 'Add Files',
                'description': 'Include Study data, identification, date and time point',
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': 'file',
                        'required': true
                    },
                    {
                        'name': 'Roche ID',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Sampling date',
                        'valueType': 'date'
                    },
                    {
                        'name': 'Sampling time point',
                        'valueType': 'text'
                    }
                ]
            }
        ]
    }
};
