export const biaTemplateV3 = {
  name: 'BioImages.v3',
  title: 'BioImages',
  description: 'BioImage Archive Study',
  sectionType: {
    display: 'required',
    displayAnnotations: false,
    tableGroups: [[]],
    name: 'Study',
    banner: {
      src: 'images/logo_bia.svg',
      alt: 'BioImage Archive logo',
      backgroundColor: '#038392'
    },
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        valueType: {
          name: 'largetext',
          minlength: 25
        },
        display: 'required',
        asyncValueValidatorName: 'forStudyTitle',
        helpText: 'Examples',
        helpLink: '/bioimage-archive/help-submission-form/#title'
      },
      {
        name: 'ReleaseDate',
        title: 'Submission publication date',
        icon: 'fa-calendar-alt',
        display: 'required',
        valueType: {
          name: 'date',
          allowPast: false
        },
        helpText: 'Explanation',
        helpLink: '/bioimage-archive/help-submission-form/#release-date'
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: { name: 'largetext' },
        helpText: 'Examples',
        helpLink: '/bioimage-archive/help-submission-form/#description'
      },
      {
        name: 'Study Type',
        icon: 'fa-microscope',
        valueType: {
          name: 'select',
          values: [
            'compound library screen',
            'electron microscopy volume map',
            'in situ hybridization',
            'high content screen',
            'histology',
            'image cytometry',
            'image segmentation',
            'imaging method',
            'immunocytochemistry',
            'protein localization',
            'time-lapse imaging'
          ]
        },
        helpText: 'Examples',
        helpLink: '/bioimage-archive/help-submission-form/#study-type'
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        display: 'required',
        valueType: {
          name: 'select',
          multiple: true,
          values: [
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
            "Saccharomyces cerevisiae (brewer's yeast)",
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
        helpText: 'Examples',
        helpLink: '/bioimage-archive/help-submission-form/#organism'
      },
      {
        name: 'Keywords',
        icon: 'fa-address-card',
        description: 'Add keywords<br><a href="/bioimage-archive/help-submission-form/#keywords">Examples</a>',
        display: 'desirable',
        valueType: {
          name: 'select',
          multiple: true
        }
      }
    ],
    tableTypes: [
      {
        name: 'Contact',
        icon: 'fa-address-card',
        description:
          'Add the contact details for the authors involved in the study.' +
          '<br><a href="/bioimage-archive/help-submission-form/#contact">Examples</a>',
        uniqueCols: true,
        display: 'required',
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Name',
            valueType: { name: 'text' },
            display: 'required',
            required: true
          },
          {
            name: 'Organisation',
            helpText: 'Add org',
            helpLink: '/help#new-item-dropdown',
            valueType: {
              name: 'org',
              multiple: true
            },
            display: 'required',
            required: true
          },
          {
            name: 'E-mail',
            valueType: { name: 'text' },
            display: 'required',
            required: true
          },
          {
            name: 'ORCID',
            valueType: { name: 'orcid' },
            display: 'desirable'
          },
          {
            name: 'Role',
            valueType: {
              name: 'select',
              values: [
                'corresponding author',
                'data acquisition',
                'data analyst',
                'experiment performer',
                'first author',
                'investigator',
                'principal investigator',
                'software development',
                'submitter'
              ]
            },
            display: 'desirable'
          },
          {
            name: 'Address',
            valueType: { name: 'text' }
          },
          {
            name: 'Department',
            valueType: { name: 'text' }
          },
          {
            name: 'Funding',
            valueType: { name: 'text' }
          }
        ]
      },
      {
        description:
          'Add the protocols involved in the study.' +
          '<br><a href="/bioimage-archive/help-submission-form/#keywords">Examples</a>',
        icon: 'fa-address-card',
        name: 'Study Protocols',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Name',
            valueType: { name: 'text' },
            display: 'required',
            uniqueValues: true
          },
          {
            name: 'Type',
            valueType: {
              name: 'select',
              values: [
                'data Analysis Protocol',
                'growth protocol',
                'image acquisition and feature extraction protocol',
                'library Protocol',
                'treatment protocol'
              ]
            },
            display: 'required'
          },
          {
            name: 'Description',
            valueType: { name: 'largetext' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'Link',
        description:
          'Provide pointers to data held in external databases or to related information on the web. ' +
          'Compact URIs from <a target="_blank" href="https://www.ebi.ac.uk/miriam/main/collections">Identifiers.org</a> ' +
          'are supported. URLs must include the scheme, e.g. "http://".',
        icon: 'fa-link',
        uniqueCols: true,
        display: 'desirable',
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Link',
            valueType: { name: 'idlink' },
            display: 'required'
          },
          {
            name: 'Description',
            valueType: { name: 'text' },
            display: 'required'
          }
        ]
      },
      {
        name: 'Publication',
        description:
          'Add the bibliography relevant to the study. Autofill is available when searching by ' +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. For other IDs, you ' +
          'may use <a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">this converter</a>.',
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'PMID',
            valueType: { name: 'pubmedid' },
            display: 'desirable'
          },
          {
            name: 'Authors',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Title',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Year',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Volume',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Issue',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Type',
            valueType: { name: 'text' }
          },
          {
            name: 'Issn',
            valueType: { name: 'text' }
          },
          {
            name: 'DOI',
            valueType: { name: 'text' }
          }
        ]
      }
    ],
    sectionTypes: [
      {
        display: 'required',
        displayAnnotations: false,
        minRequired: 1,
        name: 'Study Component',
        sectionExample: '(e.g., Screens)',
        fieldTypes: [
          {
            name: 'Name',
            icon: 'fa-comment',
            valueType: { name: 'text' },
            display: 'required',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-submission-form/#study-components-name'
          },
          {
            name: 'Description',
            icon: 'fa-comment',
            valueType: { name: 'largetext' },
            display: 'required',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-submission-form/#study-components-description'
          },
          {
            name: 'Imaging Method',
            icon: 'fa-comment',
            valueType: {
              name: 'select',
              values: [
                'bright-field microscopy',
                'confocal fluorescence microscopy',
                'confocal microscopy',
                'dark-field microscopy',
                'fluorescence correlation spectroscopy',
                'fluorescence microscopy',
                'FRAP',
                'imaging mass cytometry',
                'light microscopy',
                'light sheet fluorescence microscopy',
                'multi-fluorescence high-resolution episcopic microscopy',
                'multi-photon microscopy',
                'phase contrast microscopy',
                'scanning electron microscopy (SEM)',
                'SPIM',
                'spinning disk confocal microscopy',
                'stimulated emission depletion (STED)',
                'STORM (stochastic optical reconstruction microscopy)',
                'structured illumination microscopy (SIM)',
                'transmission electron microscopy (TEM)',
                'two-photon laser scanning microscopy',
                'unsupervised transmission electron microscopy',
                'wide field fluorescence deconvolution microscopy',
                'wide-field epi-fluorescence microscopy'
              ]
            },
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-submission-form/#study-components-imaging-method'
          },
          {
            name: 'File List',
            icon: 'fa-file',
            valueType: { name: 'file', allowFolders: false },
            display: 'required',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-file-list/'
            // asyncValueValidatorName: 'forFileList'
          },
          {
            name: 'Comment',
            icon: 'fa-comment',
            valueType: { name: 'largetext' },
            display: 'desirable',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-submission-form/#study-components-comment'
          }
        ],
        tableTypes: [
          {
            name: 'Size',
            display: 'desirable',
            uniqueCols: true,
            allowCustomCols: false,
            columnTypes: [
              {
                name: 'Parameter',
                valueType: {
                  name: 'select',
                  values: ['Plates', '5D images', 'Planes', 'Average image dimension [XYZCT]', 'Total TB']
                },
                display: 'required'
              },
              {
                name: 'Value',
                valueType: { name: 'text' },
                display: 'required'
              }
            ]
          },
          {
            name: 'Other data files',
            description: 'List other data files for the imaging study',
            icon: 'fa-file',
            uniqueCols: true,
            display: 'disarable',
            columnTypes: [
              {
                name: 'File',
                valueType: { name: 'file' },
                display: 'required'
              },
              {
                name: 'Type',
                valueType: {
                  name: 'select',
                  values: ['Feature level data file', 'Processed data file', 'Library file', 'Other']
                },
                display: 'required'
              },
              {
                name: 'Description',
                valueType: { name: 'text' },
                display: 'desirable'
              }
            ]
          },
          {
            name: 'Protocols',
            icon: 'fa-address-card',
            description: 'Add the protocols used in this study component.',
            uniqueCols: true,
            dependency: 'Study Protocols',
            rowAsSection: true,
            columnTypes: [
              {
                dependencyColumn: 'Name',
                display: 'required',
                name: 'Protocol',
                uniqueValues: true,
                valueType: {
                  name: 'select',
                  values: []
                }
              }
            ]
          }
        ]
      }
    ]
  }
};
