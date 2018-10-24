export const BIATemplate = {
    'name': 'High Content Screen Image Template',
    'description': 'High Content Screen Image Study',
    'sectionType': {
        'name': 'Study',
        'display': 'required',
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'valueType': {'name': 'largetext', 'minlength': 25},
                'display': 'required',
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': {'name': 'largetext'}
            },
            {
                'name': 'Study Type',
                'icon': 'fa-comment',
                'valueType': {
                    'name': 'select',
                    'values': [
                        'high content screen',
                        'high content analysis of cells'
                    ]
                }
            },
            {
                'name': 'Key words',
                'icon': 'fa-comment',
                'valueType': {'name': 'largetext'}
            },
        ],
        'sectionType': {
            'name': 'Screen',
            'display': 'required',
            'minCount': 3,
            'fieldTypes': [
                {
                    'name': 'Screen Number',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'text'},
                },
                {
                    'name': 'Screen Name',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'largetext'}
                },
                {
                    'name': 'Description',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'largetext'}
                },
                {
                    'name': 'Imaging Method',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'largetext'}
                },
                {
                    'name': 'Technology Type',
                    'icon': 'fa-comment',
                    'valueType': {
                        'name': 'select',
                        'values': [
                            'gene deletion screen',
                            'RNAi screen',
                            'protein screen',
                            'compound screen',
                            'antibody screen',
                            'ORF overexpression screen'
                        ]
                    }
                },
                {
                    'name': 'Screen Type',
                    'icon': 'fa-comment',
                    'valueType': {
                        'name': 'select',
                        'values': [
                            'primary screen',
                            'secondary screen',
                            'validation screen'
                        ]
                    }
                },
                {
                    'name': 'Growth Protocol',
                    'icon': 'fa-comment',
                    'valueType': 'text'
                },
                {
                    'name': 'Library Protocol',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'text'}
                },
                {
                    'name': 'Image Acquisition and Feature Extraction Protocol',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'text'}
                },
                {
                    'name': 'Data Analysis Protocol',
                    'icon': 'fa-comment',
                    'valueType': {'name': 'text'}
                }
            ],
            'featureTypes': [
                {
                    'name': 'Contact',
                    'title': 'Add Contacts',
                    'icon': 'fa-vcard',
                    'description': 'Add the contact details for the authors involved in the study.',
                    'uniqueCols': true,
                    'display': 'required',
                    'columnTypes': [
                        {
                            'name': 'Name',
                            'valueType': {'name': 'text'},
                            'required': true
                        },
                        {
                            'name': 'E-mail',
                            'valueType': {'name': 'text'},
                            'required': true
                        },
                        {
                            'name': 'Organisation',
                            'valueType': {
                                'name': 'select',
                                'values': [
                                    'ETH Zürich',
                                    'European Bioinformatics Institute (EMBL-EBI)',
                                    'European Molecular Biology Laboratory (EMBL)',
                                    'F. Hoffmann-La Roche Ltd',
                                    'Francis Crick Institute',
                                    'Genedata AG',
                                    'Imperial College London',
                                    'InSphero AG',
                                    'Instituto de Investigación Sanitaria La Fe (IIS La Fe)',
                                    'King\'s College London',
                                    'Luxcel Biosciences',
                                    'MRC Laboratory of Molecular Biology',
                                    'Maastricht University',
                                    'Max Planck Institute for Molecular Cell Biology and Genetics',
                                    'Microdiscovery GMBH',
                                    'Optibrium Ltd',
                                    'RWTH Aachen University',
                                    'Wellcome Sanger Institute'
                                ]
                            },
                            'display': 'required'
                        },
                        {
                            'name': 'ORCID',
                            'valueType': {'name': 'text'},
                            'display': 'desirable'
                        },
                        {
                            'name': 'Role',
                            'valueType': {'name': 'text'}
                        },
                        {
                            'name': 'Address',
                            'valueType': {'name': 'text'}
                        },
                        {
                            'name': 'Department',
                            'valueType': {'name': 'text'}
                        },
                        {
                            'name': 'Funding',
                            'valueType': {'name': 'text'}
                        }
                    ]
                },
                {
                    'name': 'Link',
                    'title': 'Add Links',
                    'description': 'Add the bibliography relevant to the study. Autofill is available when searching by ' +
                        '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. ' +
                        'For other IDs, you may use ' +
                        '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">PubMed\'s converter</a>.',
                    'icon': 'fa-link',
                    'uniqueCols': true,
                    'columnTypes': [
                        {
                            'name': 'Pointer',
                            'valueType': {'name': 'idlink'},
                            'display': 'required'
                        },
                        {
                            'name': 'Description',
                            'valueType': {'name': 'text'},
                            'display': 'required'
                        }
                    ]
                },
                {
                    'name': 'File',
                    'title': 'Add Files',
                    'description': 'Add the library file for the study and describe their respective scopes.',
                    'icon': 'fa-file',
                    'uniqueCols': true,
                    'display': 'required',
                    'columnTypes': [
                        {
                            'name': 'Path',
                            'valueType': {'name': 'file'},
                            'display': 'required'
                        },
                        {
                            'name': 'Format',
                            'valueType': 'text',
                            'display': 'desirable'
                        },
                        {
                            'name': 'Library Type',
                            'valueType': {
                                'name': 'select',
                                'values': [
                                    'siRNA library',
                                    'diploid homozygous deletion library',
                                    'haploid deletion library',
                                    'compound library',
                                    'tag protein fusion library',
                                    'GFP protein fusion library',
                                    'YFP protein fusion library',
                                    'HA­-Flag protein fusion library',
                                    'ORF library',
                                    'antibody library',
                                    'none'
                                ]
                            },
                            'display': 'desirable'
                        },
                        {
                            'name': 'Description',
                            'valueType': {'name': 'text'},
                            'display': 'desirable'
                        }
                    ]
                },
                {
                    'name': 'Publication',
                    'title': 'Add Publications',
                    'description': 'Add the bibliography relevant to the study. Autofill is available when searching by ' +
                        '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. For other IDs, you ' +
                        'may use <a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">this converter</a>.',
                    'icon': 'fa-book',
                    'uniqueCols': true,
                    'columnTypes': [
                        {
                            'name': 'PMID',
                            'valueType': {'name': 'pubmedid'},
                            'display': 'desirable'
                        },
                        {
                            'name': 'Authors',
                            'valueType': {'name': 'text'},
                            'display': 'required'
                        },
                        {
                            'name': 'Title',
                            'valueType': {'name': 'text'},
                            'display': 'required'
                        },
                        {
                            'name': 'Year',
                            'valueType': {'name': 'text'},
                            'display': 'required'
                        },
                        {
                            'name': 'Volume',
                            'valueType': {'name': 'text'},
                            'display': 'desirable'
                        },
                        {
                            'name': 'Issue',
                            'valueType': {'name': 'text'},
                            'display': 'desirable'
                        },
                        {
                            'name': 'Type',
                            'valueType': {'name': 'text'}
                        },
                        {
                            'name': 'Issn',
                            'valueType': {'name': 'text'}
                        },
                        {
                            'name': 'DOI',
                            'valueType': {'name': 'text'}
                        }
                    ]
                }
            ]
        }
    }
};
