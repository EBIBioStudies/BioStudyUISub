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
                'name': 'Project part',
                'icon': 'fa-comment',
                'valueType': 'text',
            },
            {
                'name': 'Organism',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': ['Homo sapiens (human)', 'Danio rerio (zebrafish)']
            },
            {
                'name': 'Organ',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'liver',
                    'brain',
                    'embryo',
                    'lung',
                    'kidney',
                    'whole body',
                    'other'
                ]
            },
            {
                'name': 'Cell type',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'cell line',
                    'primary cells',
                    'stem cells',
                    'stem cell derived'
                ]
            },
            {
                'name': 'Cell name',
                'icon': 'fa-eyedropper',
                'valueType': 'text',
                'values': [
                    'CELLLINE',
                    'HepG2',
                    'HEK',
                    'LUHMES'
                ]
            },
            {
                'name': 'Exposure time',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': ['6h', '12h', '24h']
            },
            {
                'name': 'Treatment modality',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'single dose',
                    'repeated dose',
                    'recovery'
                ]
            },
            {
                'name': 'Information domain',
                'icon': 'fa-cogs',
                'valueType': 'text',
                'values': [
                    'cytotoxicity',
                    'cell function',
                    'biochemical',
                    'reporter',
                    'metabolomics',
                    'transcriptomics',
                    'biokinetics',
                    'other'
                ]
            },
            {
                'name': 'Toxicity domain',
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
                },
                {
                    'name': 'Compound',
                    'valueType': 'text'
                },
                {
                    'name': 'Endpoint',
                    'valueType': 'text'
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
                            'European Bioinformatics Institute (EMBL-EBI)',
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
                'name': 'Link',
                'title': 'Add Links',
                'description': 'Provide pointers to data held in external databases or to related information on the web. ' +
                               'Compact URIs from <a target="_blank" href="https://www.ebi.ac.uk/miriam/main/collections">Identifiers.org</a> ' +
                               'are supported. URLs must include the scheme, e.g. "http://".',
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
                'name': 'Publication',
                'title': 'Add Publications',
                'description': 'Add the bibliography relevant to the study. Autofill is available when searching by ' +
                               '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. ' +
                               'For other IDs, you may use ' +
                               '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">PubMed\'s converter</a>.',
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
