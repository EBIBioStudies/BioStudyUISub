export const DefaultTemplate = {
    'name': 'Default',
    'description': 'Generic submission for stand-alone or unsupported studies',
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
                        'values': ['European Bioinformatics Institute',
                            'European Molecular Biology Laboratory',
                            'Swiss Institute of Bioinformatics',
                            'Netherlands Bioinformatics Centre',
                            'Science for Life Laboratory',
                            'Australia Bioinformatics Resource',
                            'Wellcome Trust Sanger Institute',
                            'Wellcome Trust Centre for Human Genetics',
                            'International Plant Genetic Resources Institute',
                            'Francis Crick Institute',
                            'MRC Human Genetics Unit',
                            'MRC Institute of Genetics and Molecular Medicine',
                            'MRC Laboratory of Molecular Biology',
                            'MRC Centre for Drug Safety Science',
                            'MRC Biostatistics Unit',
                            'MRC Cancer Unit',
                            'MRC Laboratory for Molecular Cell Biology',
                            'MRC Weatherall Institute of Molecular Medicine',
                            'MRC Mammalian Genetics Unit',
                            'MRC Toxicology Unit',
                            'Mary Lyon Centre',
                            'Translational Genomics Research Institute',
                            'National Center for Biotechnology Information',
                            'Genetic Information Research Institute',
                            'Joint Genome Institute',
                            'Salk Institute for Biological Studies',
                            'Broad Institute',
                            'Dana-Farber Cancer Institute',
                            'Whitehead Institute for Biomedical Research',
                            'New York Genome Center',
                            'Icahn Institute for Genomics and Multiscale Biology',
                            'Cold Spring Harbor Laboratory',
                            'Scripps Research Institute',
                            'Garvan Institute of Medical Research',
                            'Beijing Genomics Institute',
                            'Chinese National Human Genome Center',
                            'Royan Institute',
                            'Genome Institute of Singapore',
                            'Institute of Molecular and Cell Biology of Singapore',
                            'Institute of Molecular and Genomic Medicine of Taiwan',
                            'Institute of Biotechnology and Pharmaceutical Research of Taiwan',
                            'National Institute of Cancer Research of Taiwan',
                            'National Institute of Genetics of Japan',
                            'Okinawa Institute of Science and Technology',
                            'The Centre for Applied Genomics of Toronto'
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
                'description': 'List the data files for the study and describe their respective scopes',
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
