export const HecatosTemplate = {
    'name': 'HeCaToS',
    'description': 'Hepatic and Cardiac Toxicity Systems modelling',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'valueType': 'largetext',
                'required': true,
                'minlength': 25
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'largetext'
            },
            {
                'name': 'Sample Type',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'cardiac microtissue',
                    'heart biopsy',
                    'liver microtissue',
                    'liver biopsy',
                    'serum sample'
                ]
            },
            {
                'name': 'Organism',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Homo sapiens (human)', 'Sus scrofa (pig)']
            },
            {
                'name': 'Organ',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['heart', 'liver']
            },
            {
                'name': 'Dose',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['therapeutic', 'toxic']
            },
            {
                'name': 'Raw/Processed',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['raw', 'processed']
            },
            {
                'name': 'Biological Replicate',
                'icon': 'fa-eyedropper',
                'valueType': 'text'
            },
            {
                'name': 'CHEMBL ID',
                'icon': 'fa-flask',
                'valueType': 'text',
                'values': [
                    'CHEMBL112',
                    'CHEMBL633',
                    'CHEMBL1542',
                    'CHEMBL118',
                    'CHEMBL160',
                    'CHEMBL178',
                    'CHEMBL139',
                    'CHEMBL92',
                    'CHEMBL53463',
                    'CHEMBL417',
                    'CHEMBL185',
                    'CHEMBL1117',
                    'CHEMBL64',
                    'CHEMBL58',
                    'CHEMBL426',
                    'CHEMBL16',
                    'CHEMBL428647',
                    'CHEMBL374478',
                    'CHEMBL109'
                ]
            },
            {
                'name': 'StdInChIKey',
                'icon': 'fa-flask',
                'valueType': 'text',
                'values': [
                    'RZVAJINKPMORJF-UHFFFAOYSA-N',
                    'IYIKLHRQXLHMJQ-UHFFFAOYSA-N',
                    'LMEKQMALGUDUQG-UHFFFAOYSA-N',
                    'RZEKVGVHFLEQIL-UHFFFAOYSA-N',
                    'STQGQHZAVUOBTE-VGBVRHCVSA-N',
                    'DCOPUUMXTXDBNB-UHFFFAOYSA-N',
                    'ZDZOTLJHXYCWBA-VCVYQWHSSA-N',
                    'AOJJSUZBOXZQNB-TZSSRYMLSA-N',
                    'AOJJSUZBOXZQNB-VTZDEGQISA-N',
                    'GHASVSINZRGABV-UHFFFAOYSA-N',
                    'XDXDZDZNSLXDNA-TZNDIEGXSA-N',
                    'QRXWMOHMRWLFEY-UHFFFAOYSA-N',
                    'KKZJGLLVHKMTCM-UHFFFAOYSA-N',
                    'FBOZXECLQNJBKD-UHFFFAOYSA-N',
                    'CXOFVDLJLONNDW-UHFFFAOYSA-N',
                    'RCINICONZNJXQF-MZXODVADSA-N',
                    'JQXXHWHPUNPDRT-WLSIYKJHSA-N',
                    'NIJJYAXOARWZEE-UHFFFAOYSA-N'
                ]
            },
            {
                'name': 'Design Type',
                'icon': 'fa-cogs',
                'valueType': 'text'
            },
            {
                'name': 'Assay Measurement Type',
                'icon': 'fa-cogs',
                'valueType': 'text'
            },
            {
                'name': 'Assay Technology Type',
                'icon': 'fa-cogs',
                'valueType': 'text'
            },
            {
                'name': 'Assay Technology Platform',
                'icon': 'fa-cogs',
                'valueType': 'text'
            },
            {
                'name': 'Protocol Type',
                'icon': 'fa-cogs',
                'valueType': 'text'
            },
            {
                'name': 'Data Type',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'genomic data',
                    'proteomics data',
                    'metabolomic data',
                    'functional data'
                ]
            }
        ],
        'annotationsType': {
            'title': 'Describe your study',
            'icon': 'fa-tag',
            'description': 'Provide any additional details that may help discover or interpret the study.',
            'columnTypes': [
                {
                    'name': 'AttachTo',
                    'valueType': 'text',
                    'displayed': true,
                    'readonly': true
                },
                {
                    'name': 'Factor Name',
                    'valueType': 'text',
                    'displayed': true,
                    'values': [
                        'Age',
                        'Compound',
                        'Dose',
                        'Dose duration',
                        'Dose frequency',
                        'Post treatment duration',
                        'Sampling time point',
                        'Sampling date',
                        'Time range',
                        'Incubation time with respective conc. [uM]'
                    ]
                },
                {
                    'name': 'Compound',
                    'icon': 'fa-flask',
                    'valueType': 'text',
                    'displayed': true,
                    'values': [
                        'Acetaminophen',
                        'Amiodarone',
                        'Azathioprine',
                        'Celecoxib',
                        'Cyclosporin',
                        'Daunorubicin',
                        'Diclofenac',
                        'Docetaxel',
                        'Doxorubicin',
                        'Epirubicin',
                        'Fluorouracil',
                        'Idarubicin',
                        'Isoniazid',
                        'Mitoxantrone',
                        'Methotrexate',
                        'Phenytoin',
                        'Paclitaxel',
                        'Rifampicin',
                        'Valproic Acid',
                        'DMSO(0.1%)',
                        'DMSO(Fluctuating)',
                        'None'
                    ]
                }
            ]
        },
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'icon': 'fa-vcard',
                'description': 'Add the contact details for the authors involved in the study.',
                'uniqueCols': true,
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
                        ],
                        'required': true
                    },
                    {
                        'name': 'ORCID',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Role',
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
                        'valueType': 'idlink',
                        'required': true
                    },
                    {
                        'name': 'Description',
                        'valueType': 'text',
                        'required': true
                    }
                ]
            },
            {
                'name': 'File',
                'title': 'Add Files',
                'description': 'List the data files for the study and describe their respective scopes.',
                'icon': 'fa-file',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': 'text',
                        'readonly': true,
                        'required': true
                    },
                    {
                        'name': 'Roche ID',
                        'valueType': 'text',
                        'removable': false,
                        'displayed': true
                    },
                    {
                        'name': 'Sampling date',
                        'valueType': 'date',
                        'removable': false,
                        'displayed': true
                    },
                    {
                        'name': 'Sampling time point',
                        'valueType': 'text',
                        'removable': false,
                        'displayed': true
                    },
                    {
                        'name': 'Description',
                        'valueType': 'text',
                        'removable': false,
                        'displayed': true
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
                        'valueType': 'pubmedid',
                        'displayed': true,
                        'removable': false
                    },
                    {
                        'name': 'Authors',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Title',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Year',
                        'valueType': 'text',
                        'required': true
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
            },
            {
                'name': 'ProtocolName',
                'title': 'Add protocols',
                'description': 'List the details of any experimental protocols employed.',
                'icon': 'fa-cogs',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Description',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'URI',
                        'valueType': 'text',
                        'displayed': true
                    }
                ]
            }
        ]
    }
};
