export const EutoxriskTemplate = {
    'name': 'EU-ToxRisk',
    'description': 'Integrated European programme for mechanism-based Toxicity testing and Risk assessment',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'valueType': 'textblob',
                'required': true,
                'minlength': 25
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'textblob'
            },
            {
                'name': 'Project Part',
                'icon': 'fa-comment',
                'valueType': 'text',
            },
            {
                'name': 'Organism',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Homo sapiens', 'Danio rerio']
            },
            {
                'name': 'Organ',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'Liver',
                    'Brain',
                    'Embryo',
                    'Lung',
                    'Kidney',
                    'Whole body',
                    'Other'
                ]
            },
            {
                'name': 'Cell Type',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'Cell line',
                    'Primary cells',
                    'Stem cells',
                    'Stem cell derived'
                ]
            },
            {
                'name': 'Cell Name',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'HepG2',
                    'HEK',
                    'LUHMES'
                ]
            },
            {
                'name': 'Exposure Time',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': ['6h', '12h', '24h']
            },
            {
                'name': 'Treatment Modality',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'Single dose',
                    'Repeated dose',
                    'Recovery'
                ]
            },
            {
                'name': 'Information Domain',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'Cytotoxicity',
                    'Cell function',
                    'Biochemical',
                    'Reporter',
                    'Metabolomics',
                    'Transcriptomics',
                    'Biokinetics',
                    'Other'
                ]
            },
            {
                'name': 'Toxicity Domain',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'DART (Dev/Repro)',
                    'RDT (= organ toxicity)',
                    'BOTH',
                    'OTHER'
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
                            'BASF',
                            'BioDetection Systems B.V.',
                            'BioTalentum Ltd',
                            'Cosmetics Europe',
                            'Cyprotex Ltd',
                            'European Bioinformatics Institute (EBI)',
                            'European Molecular Biology Laboratory (EMBL)',
                            'F. Hoffmann-La Roche Ltd',
                            'Fraunhofer Institute for Toxicology and Experimental Medicine',
                            'Heidelberg University',
                            'InSphero AG',
                            'Ineris',
                            'Instituto de Investigación Sanitaria La Fe (IIS La Fe)',
                            'Italian National Health Institute (ISS)',
                            'Johns Hopkins Bloomberg School of Public Health',
                            'KU Leuven',
                            'Konstanz University',
                            'Leibniz Research Centre for Working Environment and Human Factors (IfADo)',
                            'Leiden University Medical Center (LUMC)',
                            'L’Oréal',
                            'Maastricht University',
                            'Mario Negri Institute for Pharmacological Research (IRCCS)',
                            'Medical University of Innsbruck',
                            'Netherlands Organisation for Applied Scientific Research (TNO)',
                            'Novo Nordisk Foundation Center for Protein Research',
                            'Pompeu Fabra University',
                            'Swetox',
                            'The Danish Environmental Protection Agency',
                            'The Federal Institute for Occupational Safety and Health (BAuA)',
                            'TissUse GmbH',
                            'Unilever',
                            'University of Vienna'
                        ],
                        'required': true
                    },
                    {
                        'name': 'Role',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'ORCID',
                        'valueType': 'text',
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
                'name': 'Endpoint',
                'title': 'Add endpoints',
                'icon': 'fa-medkit',
                'description': "Provide at least the method and analytical measure of the study's endpoints.",
                'uniqueCols': true,
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Method',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Analytical measure',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'Type',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Readout method',
                        'valueType': 'text'
                    }
                ]
            },
            {
                'name': 'Compound',
                'title': 'Add compounds',
                'icon': 'fa-flask',
                'description': "List all parent compounds by their most common chemical name. " +
                               "For example, \"Valproic acid\" instead of \"Valproate\".",
                'uniqueCols': true,
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': 'text',
                        'required': true
                    },
                    {
                        'name': 'CAS number',
                        'valueType': 'text'
                    },
                    {
                        'name': 'SMILES',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Supplier',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Order number',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Lot number',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Compound form',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Storage temp',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Stock solvent',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Stock conc',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Stock aliquot storage',
                        'valueType': 'text'
                    },
                    {
                        'name': 'Other info',
                        'valueType': 'text'
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
                        'valueType': 'text',
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
