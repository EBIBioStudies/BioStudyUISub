export const DefaultTemplate = {
    'name': 'Default',
    'description': 'Generic submission for stand-alone or generic studies',
    'sectionType': {
        'name': 'Study',
        'featureGroups': [
            ['Link', 'File']
        ],
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'display': 'required',
                'valueType': {
                    'name': 'largetext',
                    'minlength': 25,
                }
            },
            {
                'name': 'ReleaseDate',
                'icon': 'fa-calendar-alt',
                'display': 'required',
                'valueType': {
                    'name': 'date',
                    'allowPast': false
                }
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'display': 'required',
                'valueType': {
                    'name': 'largetext',
                    'minlength': 50
                }
            }
        ],
        'annotationsType': {
            'title': 'Describe your study',
            'description': 'Provide any additional details that may help discover or interpret the study.',
            'icon': 'fa-tag',
            'display': 'desirable',
            'singleRow': true,
            'columnTypes': [
                {
                    'name': 'AttachTo',
                    'valueType': {'name': 'text'},
                    'display': 'readonly'
                },
                {
                    'name': 'Organism',
                    'valueType': {
                        'name': 'select',
                        'values': [
                            'Homo sapiens (human)',
                            'Mus musculus (mouse)',
                            'Arabidopsis thaliana (thale cress)',
                            'Rattus norvegicus (brown rat)',
                            'Drosophila melanogaster (fruit fly)',
                            'Oryza sativa Japonica (common rice)',
                            'Anas platyrhyncho (mallard)',
                            'Anolis carolinensis (anole)',
                            'Anopheles gambiae (marsh mosquito)',
                            'Arabidopsis lyrata (rock cress)',
                            'Aspergillus fumigatus',
                            'Bos Taurus (cow)',
                            'Brachypodium distachyon (stiff brome)',
                            'Brassica oleracea (cabbage)',
                            'Brassica rapa (turnip)',
                            'Caenorhabditis elegans',
                            'Canis familiaris (dog)',
                            'Chlorocebus sabaeus (green monkey)',
                            'Ciona intestinalis (sea squirt)',
                            'Ciona savignyi (Pacific sea squirt)',
                            'Danio rerio (zebrafish)',
                            'Dasypus novemcinctus (nine-banded armadillo)',
                            'Equus caballus (horse)',
                            'Gallus gallus (chicken)',
                            'Glycine max (soybean)',
                            'Gorilla gorilla',
                            'Hordeum vulgare (barley)',
                            'Macaca mulatta (rhesus monkey)',
                            'Medicago truncatula (barrel clover)',
                            'Monodelphis domestica (short-tailed opossum)',
                            'Musa acuminata (banana)',
                            'Ornithorhynchus anatinus (platypus)',
                            'Oryctolagus cuniculus (rabbit)',
                            'Oryza rufipogon (brownbeard rice)',
                            'Ovis aries (sheep)',
                            'Pan troglodytes (chimpanzee)',
                            'Papio Anubis (baboom)',
                            'Physcomitrella patens (moss)',
                            'Pongo abelii (orangutan)',
                            'Populus trichocarpa (poplar tree)',
                            'Saccharomyces cerevisiae (brewer\'s yeast)',
                            'Schistosoma mansoni (blood fluke)',
                            'Schizosaccharomyces pombe (fission yeast)',
                            'Solanum lycopersicum (tomato)',
                            'Solanum tuberosum (potato)',
                            'Sorghum bicolor',
                            'Sus scrofa (pig)',
                            'Tetraodon nigroviridis (green pufferfish)',
                            'Theobroma cacao (chocolate)',
                            'Triticum aestivum (wheat)',
                            'Vitis vinifera (grape)',
                            'Xenopus tropicalis (frog)',
                            'Yarrowia lipolytica',
                            'Zea mays (corn)'
                        ]
                    }
                },
                {
                    'name': 'Experimental design',
                    'valueType': {'name': 'text'}
                },
                {
                    'name': 'Experimental factor',
                    'valueType': {'name': 'text'}
                },
                {
                    'name': 'Organ',
                    'valueType': {'name': 'text'}
                },
                {
                    'name': 'Cell type',
                    'valueType': {'name': 'text'}
                }
            ]
        },
        'featureTypes': [
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'description': 'Add the contact details for the authors involved in the study.',
                'icon': 'fa-address-card',
                'display': 'required',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': {'name': 'text'},
                        'display': 'required'
                    },
                    {
                        'name': 'E-mail',
                        'valueType': {'name': 'text'},
                        'display': 'required'
                    },
                    {
                        'name': 'Organisation',
                        'valueType': {
                            'name': 'select',
                            'values': [
                                'Australia Bioinformatics Resource (EMBL-ABR)',
                                'Beijing Genomics Institute (BGI)',
                                'Biomedicine Institute of Valencia (IBV)',
                                'Broad Institute',
                                'Centre for Biological Research (CIB)',
                                'Centre for Molecular Biology Severo Ochoa (CBMSO)',
                                'Center for Computational Biology and Bioinformatics of Korea (CCBB)',
                                'Chinese National Human Genome Center (CHGC)',
                                'Cold Spring Harbor Laboratory (CSHL)',
                                'Dana-Farber Cancer Institute',
                                'European Bioinformatics Institute (EMBL-EBI)',
                                'European Molecular Biology Laboratory (EMBL)',
                                'Francis Crick Institute',
                                'Garvan Institute of Medical Research',
                                'Genetic Information Research Institute (GIRI)',
                                'Genome Institute of Singapore (GIS)',
                                'Georgetown University Medical Center',
                                'German Institute of Medical Documentation and Information',
                                'Howard Hughes Medical Institute (HHMI)',
                                'Icahn Institute for Genomics and Multiscale Biology',
                                'Institute of Biotechnology and Pharmaceutical Research of Taiwan (IBPR)',
                                'Institute of Molecular and Cell Biology of Singapore (IMCB)',
                                'Institute of Molecular and Genomic Medicine of Taiwan',
                                'Instituto de Investigación Sanitaria La Fe (IIS La Fe)',
                                'International Plant Genetic Resources Institute (IPGRI)',
                                'Johns Hopkins University',
                                'Joint Genome Institute (JGI)',
                                'Kyoto University Bioinformatics Center',
                                'MRC Biostatistics Unit (BSU)',
                                'MRC Cancer Unit',
                                'MRC Centre for Drug Safety Science (CDSS)',
                                'MRC Human Genetics Unit',
                                'MRC Institute of Genetics and Molecular Medicine (IGMM)',
                                'MRC Laboratory for Molecular Cell Biology (LMCB)',
                                'MRC Laboratory of Molecular Biology (LMB)',
                                'MRC Mammalian Genetics Unit (MGU)',
                                'MRC Toxicology Unit',
                                'MRC Weatherall Institute of Molecular Medicine (WIMM)',
                                'Mary Lyon Centre (MLC)',
                                'National Center for Biotechnology Information (NCBI)',
                                'National Human Genome Research Institute (NHGRI)',
                                'National Institute of Cancer Research of Taiwan',
                                'National Institute of Genetics of Japan (NIG)',
                                'National Institutes of Health (NIH)',
                                'Netherlands Bioinformatics Centre (NBIC)',
                                'New York Genome Center (NYGC)',
                                'New York University School of Medicine',
                                'Okinawa Institute of Science and Technology (OIST)',
                                'Ontario Institute for Cancer Research (OICR)',
                                'Royan Institute',
                                'Salk Institute for Biological Studies',
                                'Science for Life Laboratory (SciLifeLab)',
                                'Swiss Institute of Bioinformatics (SIB)',
                                'The Centre for Applied Genomics of Toronto (TCAG)',
                                'The Institute of Biomedical Research of Barcelona (IIBB)',
                                'The Jackson Laboratory Cancer Center (JAXCC)',
                                'The Scripps Research Institute (TSRI)',
                                'Translational Genomics Research Institute (TGen)',
                                'Wellcome Trust Centre for Human Genetics',
                                'Wellcome Trust Sanger Institute',
                                'Whitehead Institute for Biomedical Research'
                            ]
                        },
                        'display': 'required'
                    },
                    {
                        'name': 'Role',
                        'valueType': {'name': 'text'}
                    },
                    {
                        'name': 'ORCID',
                        'valueType': {'name': 'orcid'},
                        'display': 'desirable'

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
                'description': 'Provide pointers to data held in external databases or to related information on the web. ' +
                    'Compact URIs from <a target="_blank" href="https://www.ebi.ac.uk/miriam/main/collections">Identifiers.org</a> ' +
                    'are supported. URLs must include the scheme, e.g. "http://".',
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
                'description': 'List the data files for the study and describe their respective scopes.',
                'icon': 'fa-file',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': {'name': 'file'},
                        'display': 'required'
                    },
                    {
                        'name': 'Description',
                        'valueType': {'name': 'text'},
                        'display': 'required'
                    },
                    {
                        'name': 'Type',
                        'valueType': {'name': 'text'},
                        'display': 'desirable'
                    }
                ]
            },
            {
                'name': 'LibraryFile',
                'title': 'Add Library File',
                'description': 'Specify library file',
                'icon': 'fa-file',
                'singleRow': true,
                'uniqueCols': true,
                'allowCustomCols': false,
                'columnTypes': [
                    {
                        'name': 'Path',
                        'valueType': {'name': 'file'},
                        'display': 'required'
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
};
