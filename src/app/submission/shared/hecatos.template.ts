export const DefaultTemplate = {
    'name': 'DeafultTemplate',
    'sectionType': {
        'name': 'Study',
        'required': true,
        'annotationsType': {
            'title': 'Describe your study',
            'icon': 'fa-tag',
            'description': 'Provide any supplementary details of the study that may help discover and/or interpret it',
            'columnTypes': [
                {
                    'name': 'Factor',
                    'valueType': 'text',
                    'values': ['Age', 'Compound', 'Dose', 'Dose duration', 'Dose frequency', 'Post treatment duration',
                         'Sampling time point', 'Sampling date', 'Time range', 'Incubation time with respective conc. [uM]'],
                    'displayed': true
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
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'textblob',
                'required': true,
                'minlength': 50
            },
            {
                'name': 'Design Type',
                'valueType': 'text'
            },
            {
                'name': 'Assay Measurement Type',
                'valueType': 'text'
            },
            {
                'name': 'Assay Technology Type',
                'valueType': 'text'
            },
            {
                'name': 'Assay Technology Platform',
                'valueType': 'text'
            },
            {
                'name': 'Organism',
                'valueType': 'text',
                'values': ['Homo sapiens', 'Mus musculus', 'Arabidopsis thaliana', 'Rattus norvegicus',
                    'Drosophila melanogaster', 'Oryza sativa Japonica Group', 'Anas platyrhyncho',
                    'Anolis carolinensis', 'Anopheles gambiae', 'Arabidopsis lyrata', 'Aspergillus fumigatus',
                    'Bos Taurus', 'Brachypodium distachyon', 'Brassica oleracea', 'Brassica rapa',
                    'Caenorhabditis elegans', 'Canis familiaris', 'Chlorocebus sabaeus', 'Ciona intestinalis',
                    'Ciona savignyi', 'Danio rerio', 'Dasypus novemcinctus', 'Equus caballus', 'Gallus gallus',
                    'Glycine max', 'Gorilla gorilla', 'Hordeum vulgare', 'Macaca mulatta', 'Medicago truncatula',
                    'Monodelphis domestica', 'Musa acuminate', 'Ornithorhynchus anatinus', 'Oryctolagus cuniculus',
                    'Oryza rufipogon', 'Ovis aries', 'Pan troglodytes', 'Papio Anubis',  'Physcomitrella patens',
                    'Pongo abelii', 'Populus trichocarpa', 'Saccharomyces cerevisiae', 'Schistosoma mansoni',
                    'Schizosaccharomyces pombe', 'Solanum lycopersicum', 'Solanum tuberosum', 'Sorghum bicolor',
                    'Sus scrofa', 'Tetraodon nigroviridis', 'Theobroma cacao', 'Triticum aestivum', 'Vitis vinifera',
                    'Xenopus tropicalis', 'Yarrowia lipolytica', 'Zea mays']
            },
            {
                'name': 'Organ',
                'valueType': 'text'
            },
            {
                'name': 'Sample Type',
                'valueType': 'text'
            },
            {
                'name': 'Biological Replicate',
                'valueType': 'text'
            },
            {
                'name': 'Compound',
                'valueType': 'text'
            },
            {
                'name': 'Chembl ID',
                'valueType': 'text'
            },
            {
                'name': 'Std In Chi Key',
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
                'name': 'Data Type',
                'valueType': 'text'
            }
        ],
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'icon': 'fa-vcard',
                'description': 'Include the contact details for the authors of the study',
                'uniqueCols': true,
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
                        'name': 'E-mail',
                        'valueType': 'text',
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
                'name': 'File',
                'title': 'Add Files',
                'icon': 'fa-file',
                'description': 'List the data files for the study and describe their respective scopes',
                'uniqueCols': true,
                'required': true,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': 'file',
                        'required': true
                    },
                    {
                        'name': 'Sampling date',
                        'valueType': 'date',
                        'displayed': true
                    },
                    {
                        'name': 'Sampling time point',
                        'valueType': 'text',
                        'displayed': true
                    },
                    {
                        'name': 'Roche ID',
                        'valueType': 'text'
                    }
                ]
            },
            {
                'name': 'Link',
                'title': 'Add Links',
                'description': 'Provide links to any additional documentation that may be of relevance',
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
                'description': 'Add the details of publications relevant or complementary to the study',
                'icon': 'fa-book',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'PMID',
                        'valueType': 'pubmedid',
                        'displayed': true
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
