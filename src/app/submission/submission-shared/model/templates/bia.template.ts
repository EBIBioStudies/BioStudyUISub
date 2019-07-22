export const BIATemplate = {
    'name': 'BioImages',
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
                'valueType': {'name': 'largetext'}
            },
            {
                'name': 'Study Type',
                'icon': 'fa-comment',
                'valueType': {
                    'name': 'select',
                    'values': [
                        'High content screen',
                        'High content analysis of cells'
                    ]
                }
            }
        ],
        'featureTypes': [
            {
                'name': 'Keywords',
                'title': 'Add Keywords',
                'icon': 'fa-address-card',
                'description': 'Add keywords',
                'uniqueCols': true,
                'display': 'desirable',
                'columnTypes': [
                    {
                        'name': 'Keyword',
                        'valueType': { 'name': 'text' },
                        'display': 'desirable'
                    }
                ]
            },
            {
                'name': 'Contact',
                'title': 'Add Contacts',
                'icon': 'fa-address-card',
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
                                'Australia Bioinformatics Resource (EMBL-ABR)',
                                'Beijing Genomics Institute (BGI)',
                                'Biomedicine Institute of Valencia (IBV)',
                                'Broad Institute',
                                'Center for Computational Biology and Bioinformatics of Korea (CCBB)',
                                'Centre for Biological Research (CIB)',
                                'Centre for Molecular Biology Severo Ochoa (CBMSO)',
                                'Chinese National Human Genome Center (CHGC)',
                                'Cold Spring Harbor Laboratory (CSHL)',
                                'Dana-Farber Cancer Institute',
                                'ETH Zürich',
                                'European Bioinformatics Institute (EMBL-EBI)',
                                'European Molecular Biology Laboratory (EMBL)',
                                'F. Hoffmann-La Roche Ltd',
                                'Francis Crick Institute',
                                'Garvan Institute of Medical Research',
                                'Genedata AG',
                                'Genetic Information Research Institute (GIRI)',
                                'Genome Institute of Singapore (GIS)',
                                'Georgetown University Medical Center',
                                'German Institute of Medical Documentation and Information',
                                'Howard Hughes Medical Institute (HHMI)',
                                'Icahn Institute for Genomics and Multiscale Biology',
                                'Imperial College London',
                                'InSphero AG',
                                'Institute of Biotechnology and Pharmaceutical Research of Taiwan (IBPR)',
                                'Institute of Molecular and Cell Biology of Singapore (IMCB)',
                                'Institute of Molecular and Genomic Medicine of Taiwan',
                                'Instituto de Investigación Sanitaria La Fe (IIS La Fe)',
                                'International Plant Genetic Resources Institute (IPGRI)',
                                'Johns Hopkins University',
                                'Joint Genome Institute (JGI)',
                                'King\'s College London',
                                'Kyoto University Bioinformatics Center',
                                'Luxcel Biosciences',
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
                                'Maastricht University',
                                'Mary Lyon Centre (MLC)',
                                'Max Planck Institute for Molecular Cell Biology and Genetics',
                                'Microdiscovery GMBH',
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
                                'Optibrium Ltd',
                                'RWTH Aachen University',
                                'Royan Institute',
                                'Salk Institute for Biological Studies',
                                'Science for Life Laboratory (SciLifeLab)',
                                'Swiss Institute of Bioinformatics (SIB)',
                                'The Centre for Applied Genomics of Toronto (TCAG)',
                                'The Institute of Biomedical Research of Barcelona (IIBB)',
                                'The Jackson Laboratory Cancer Center (JAXCC)',
                                'The Scripps Research Institute (TSRI)',
                                'Translational Genomics Research Institute (TGen)',
                                'Wellcome Sanger Institute',
                                'Wellcome Trust Centre for Human Genetics',
                                'Wellcome Trust Sanger Institute',
                                'Whitehead Institute for Biomedical Research'
                            ]
                        },
                        'display': 'required'
                    },
                    {
                        'name': 'ORCID',
                        'valueType': {'name': 'orcid'},
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
                'description': 'Add the protocols involved in the study.',
                'icon': 'fa-address-card',
                'name': 'Study Protocols',
                'title': 'Study Protocols',
                'uniqueCols': true,
                'columnTypes': [
                    {
                        'name': 'Name',
                        'valueType': { 'name': 'text' },
                        'display': 'required',
                        'uniqueValues': true
                    },
                    {
                        'name': 'Type',
                        'valueType': {
                            'name': 'select',
                            'values': [
                                'Data Analysis Protocol',
                                'Growth protocol',
                                'Image acquisition and feature extraction protocol',
                                'Library Protocol',
                                'Treatment protocol'
                            ]
                        },
                        'display': 'required'
                    },
                    {
                        'name': 'Description',
                        'valueType': { 'name': 'largetext' },
                        'display': 'desirable'
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
        ],
        'sectionTypes': [
            {
                'name': 'Study Component',
                'sectionExample': '(e.g., Screens)',
                'display': 'required',
                'minRequired': 1,
                'fieldTypes': [
                    {
                        'name': 'Name',
                        'icon': 'fa-comment',
                        'valueType': {'name': 'text'},
                        'display': 'required'
                    },
                    {
                        'name': 'Description',
                        'icon': 'fa-comment',
                        'valueType': {'name': 'largetext'},
                        'display': 'required'
                    },
                    {
                        'name': 'Imaging Method',
                        'icon': 'fa-comment',
                        'valueType': {'name': 'text'}
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
                                'ORF overexpression screen',
                                'Other'
                            ]
                        }
                    },
                    {
                        'name': 'Type',
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
                        'name': 'File List',
                        'icon': 'fa-file',
                        'valueType': {'name': 'file'},
                        'display': 'required'
                    }
                ],
                'featureTypes': [
                    {
                        'name': 'Protocols',
                        'title': 'Protocols',
                        'icon': 'fa-address-card',
                        'description': 'Add the protocols used in this study component.',
                        'uniqueCols': true,
                        'dependency': 'Study Protocols',
                        'columnTypes': [
                            {
                                'dependencyColumn': 'Name',
                                'display': 'required',
                                'name': 'Protocol',
                                'uniqueValues': true,
                                'valueType': {
                                    'name': 'select',
                                    'values': []
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
