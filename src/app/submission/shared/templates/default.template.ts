export const DefaultTemplate = {
    'name': 'Default',
    'description': 'Generic submission for stand-alone or generic studies',
    'sectionType': {
        'name': 'Study',
        'group': ['Link', 'File'],
        'fieldTypes': [
            {
                'name': 'Title',
                'icon': 'fa-title',
                'valueType': 'largetext',
                'required': true,
                'minlength': 25
            },
            {
                'name': 'ReleaseDate',
                'icon': 'fa-calendar',
                'valueType': 'date',
                'allowPast': false,
                'required': true
            },
            {
                'name': 'Description',
                'icon': 'fa-comment',
                'valueType': 'largetext',
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
                    }
                ]
            }
        ]
    }
};
