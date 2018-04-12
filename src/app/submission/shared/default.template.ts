export const DefaultTemplate = {
    'name': 'Default',
    'description': 'Generic submission for stand-alone or generic studies',
    'sectionType': {
        'name': 'Study',
        'group': ['File', 'Link'],
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'valueType': 'textblob',
                'required': true,
                'minlength': 25
            },
            {
                'name': 'Release Date',
                'icon': 'fa-calendar',
                'valueType': 'date',
                'allowPast': false,
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
        'annotationsType': {
            'title': 'Describe your study',
            'description': 'Provide any additional details that may help discover or interpret the study.',
            'icon': 'fa-tag',
            'columnTypes': [
                {
                    'name': 'AttachTo',
                    'valueType': 'text',
                    'readonly': true
                },
                {
                    'name': 'Organism',
                    'valueType': 'text',
                    'values': [
                        'Homo sapiens',
                        'Mus musculus',
                        'Arabidopsis thaliana',
                        'Rattus norvegicus',
                        'Drosophila melanogaster',
                        'Oryza sativa Japonica Group',
                        'Anas platyrhyncho',
                        'Anolis carolinensis',
                        'Anopheles gambiae',
                        'Arabidopsis lyrata',
                        'Aspergillus fumigatus',
                        'Bos Taurus',
                        'Brachypodium distachyon',
                        'Brassica oleracea',
                        'Brassica rapa',
                        'Caenorhabditis elegans',
                        'Canis familiaris',
                        'Chlorocebus sabaeus',
                        'Ciona intestinalis',
                        'Ciona savignyi',
                        'Danio rerio',
                        'Dasypus novemcinctus',
                        'Equus caballus',
                        'Gallus gallus',
                        'Glycine max',
                        'Gorilla gorilla',
                        'Hordeum vulgare',
                        'Macaca mulatta',
                        'Medicago truncatula',
                        'Monodelphis domestica',
                        'Musa acuminate',
                        'Ornithorhynchus anatinus',
                        'Oryctolagus cuniculus',
                        'Oryza rufipogon',
                        'Ovis aries',
                        'Pan troglodytes',
                        'Papio Anubis',
                        'Physcomitrella patens',
                        'Pongo abelii',
                        'Populus trichocarpa',
                        'Saccharomyces cerevisiae',
                        'Schistosoma mansoni',
                        'Schizosaccharomyces pombe',
                        'Solanum lycopersicum',
                        'Solanum tuberosum',
                        'Sorghum bicolor',
                        'Sus scrofa',
                        'Tetraodon nigroviridis',
                        'Theobroma cacao',
                        'Triticum aestivum',
                        'Vitis vinifera',
                        'Xenopus tropicalis',
                        'Yarrowia lipolytica',
                        'Zea mays'
                    ]
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
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'description': 'Add the contact details for the authors involved in the study.',
                'icon': 'fa-vcard',
                'required': true,
                'uniqueCols': true,
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
                            'Australia Bioinformatics Resource',
                            'Beijing Genomics Institute',
                            'Broad Institute',
                            'Chinese National Human Genome Center',
                            'Cold Spring Harbor Laboratory',
                            'Dana-Farber Cancer Institute',
                            'European Bioinformatics Institute (EBI)',
                            'European Molecular Biology Laboratory (EMBL)',
                            'Francis Crick Institute',
                            'Garvan Institute of Medical Research',
                            'Genetic Information Research Institute',
                            'Genome Institute of Singapore',
                            'Icahn Institute for Genomics and Multiscale Biology',
                            'Institute of Biotechnology and Pharmaceutical Research of Taiwan',
                            'Institute of Molecular and Cell Biology of Singapore',
                            'Institute of Molecular and Genomic Medicine of Taiwan',
                            'International Plant Genetic Resources Institute',
                            'Joint Genome Institute',
                            'MRC Biostatistics Unit',
                            'MRC Cancer Unit',
                            'MRC Centre for Drug Safety Science',
                            'MRC Human Genetics Unit',
                            'MRC Institute of Genetics and Molecular Medicine',
                            'MRC Laboratory for Molecular Cell Biology',
                            'MRC Laboratory of Molecular Biology',
                            'MRC Mammalian Genetics Unit',
                            'MRC Toxicology Unit',
                            'MRC Weatherall Institute of Molecular Medicine',
                            'Mary Lyon Centre',
                            'National Center for Biotechnology Information',
                            'National Institute of Cancer Research of Taiwan',
                            'National Institute of Genetics of Japan',
                            'Netherlands Bioinformatics Centre',
                            'New York Genome Center',
                            'Okinawa Institute of Science and Technology',
                            'Royan Institute',
                            'Salk Institute for Biological Studies',
                            'Science for Life Laboratory',
                            'Scripps Research Institute',
                            'Swiss Institute of Bioinformatics',
                            'The Centre for Applied Genomics of Toronto',
                            'Translational Genomics Research Institute',
                            'Wellcome Trust Centre for Human Genetics',
                            'Wellcome Trust Sanger Institute',
                            'Whitehead Institute for Biomedical Research'
                        ],
                        'required': true
                    },
                    {
                        'name': 'Role',
                        'valueType': 'text'
                    },
                    {
                        'name': 'ORCID',
                        'valueType': 'orcid',
                        'displayed': true,
                        'removable': false
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
                        'valueType': 'text',
                        'displayed': true
                    }
                ]
            },
            {
                'name': 'Publication',
                'title': 'Add Publications',
                'description': 'Add the details of publications relevant to the study. Autofill is ' +
                               'available when searching by PubMed identifier.',
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
