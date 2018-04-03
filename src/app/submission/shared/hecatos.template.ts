export const HecatosTemplate = {
    'name': 'HeCaToS',
    'description': 'Hepatic and Cardiac Toxicity Systems modelling',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'annotationsType': {
            'title': 'Describe your study',
            'icon': 'fa-tag',
            'description': 'Provide any factors that may help discover or interpret the study. For example, ' +
                           'age, dose frequency or time range.',
            'columnTypes': [
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
                },
                {
                    'name': 'Factor',
                    'valueType': 'text',
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
                    ],
                    'displayed': true
                },
                {
                    'name': 'AttachTo',
                    'valueType': 'text',
                    'readonly': true
                }
            ]
        },
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-font',
                'valueType': 'textblob',
                'required': true,
                'minlength': 25
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'textblob',
                'required': false,
                'minlength': 50
            },
            {
                'name': 'Sample Type',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Cardiac microtissue', 'Heart biopsy', 'Liver microtissue', 'Liver biopsy', 'Serum sample']
            },
            {
                'name': 'Organ',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Heart', 'Liver']
            },
            {
                'name': 'Organism',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Homo sapiens', 'Sus scrofa']
            },
            {
                'name': 'Dose',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Therapeutic', 'Toxic']
            },
            {
                'name': 'Biological Replicate',
                'icon': 'fa-eyedropper',
                'valueType': 'text'
            },
            {
                'name': 'Chembl ID',
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
                'name': 'Std In Chi Key',
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
                'values': ['Genomic data', 'Proteomics data', 'Metabolomic data']
            }
        ],
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
                            'European Bioinformatics Institute',
                            'European Molecular Biology Laboratory',
                            'Wellcome Sanger Institute',
                            'Francis Crick Institute',
                            'MRC Laboratory of Molecular Biology',
                            'Maastricht University',
                            'F. Hoffmann-La Roche AG',
                            'Insphero AG',
                            'Instituto de Investigación Sanitaria La Fe',
                            'ETH Zürich',
                            'Imperial College London',
                            'Luxcel Biosciences',
                            'Genedata AG',
                            'Max Planck Institute for Molecular Cell Biology and Genetics',
                            'King\'s College London',
                            'RWTH Aachen University',
                            'Microdiscovery GMBH',
                            'Optibrium limited'
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
                        'valueType': 'text',
                        'removable': false
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
                'icon': 'fa-file',
                'description': 'List the data files for the study and describe their respective scopes.',
                'uniqueCols': true,
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': 'file',
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
                'name': 'Link',
                'title': 'Add Links',
                'description': 'Provide pointers to data held in external databases or to related information on the web.',
                'icon': 'fa-link',
                'uniqueCols': true,
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
                'description': 'Add the details of publications relevant to the study. Autofill is ' +
                               'available when searching by PubMed identifier',
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
            }
        ]
    }
};
