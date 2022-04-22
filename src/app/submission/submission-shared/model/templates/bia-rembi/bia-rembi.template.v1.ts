export const biaRembiTemplateV1 = {
  name: 'BioImages-REMBI.v1',
  title: 'BioImages-REMBI',
  description: 'BioImage Archive Study - REMBI schema',
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
        asyncValueValidatorName: 'forStudyTitle'
      },
      {
        name: 'ReleaseDate',
        title: 'Submission publication date',
        icon: 'fa-calendar-alt',
        display: 'required',
        valueType: {
          name: 'date',
          allowPast: false
        }
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: { name: 'largetext' }
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
        }
      }
    ],
    tableTypes: [
      {
        name: 'Publication',
        description: "The publication for which this submission's data was collected.",
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        rowAsSection: true,
        allowCustomCols: true,
        columnTypes: [
          {
            name: 'Title',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Authors',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'DOI',
            valueType: { name: 'text' },
            display: 'required'
          }
        ]
      },
      {
        name: 'Contact',
        icon: 'fa-address-card',
        description: 'Add the contact details for the authors involved in the study.',
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
          }
        ]
      },
      {
        name: 'Keywords',
        icon: 'fa-address-card',
        description: 'Add keywords',
        uniqueCols: true,
        allowCustomCols: false,
        display: 'desirable',
        columnTypes: [
          {
            name: 'Keyword',
            valueType: { name: 'text' },
            display: 'desirable'
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
            display: 'required'
          },
          {
            name: 'Description',
            icon: 'fa-comment',
            valueType: { name: 'largetext' },
            display: 'required'
          },
          {
            name: 'File List',
            icon: 'fa-file',
            valueType: { name: 'file', allowFolders: false },
            display: 'required'
          }
        ],
        sectionTypes: [
          {
            display: 'required',
            displayAnnotations: false,
            minRequired: 0,
            name: 'Biosample',
            sectionExample: 'Organism, cell line',
            fieldTypes: [
              {
                name: 'Biological identity',
                icon: 'fa-vial',
                valueType: {
                  name: 'select',
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
                }
              },
              {
                name: 'Organism',
                icon: 'fa-comment',
                valueType: { name: 'largetext' },
                display: 'required'
              }
            ]
          },
          {
            display: 'required',
            displayAnnotations: false,
            minRequired: 0,
            name: 'Specimen',
            sectionExample: 'Specifics about specimen handling - Sample preparation, Growth protocols',
            fieldTypes: [
              {
                name: 'Growth protocol',
                icon: 'fa-comment',
                valueType: { name: 'text' },
                display: 'required'
              },
              {
                name: 'Sample preparation protocol',
                icon: 'fa-comment',
                valueType: { name: 'largetext' },
                display: 'required'
              }
            ]
          },
          {
            display: 'required',
            displayAnnotations: false,
            minRequired: 0,
            name: 'Image acquisition',
            sectionExample: 'Everything between the specimen and persistent storage',
            fieldTypes: [
              {
                name: 'Imaging method',
                icon: 'fa-microscope',
                valueType: {
                  name: 'select',
                  values: [
                    'ANSOM',
                    'CARS',
                    'EDAX imaging',
                    'EELS imaging',
                    'FLIM',
                    'FLIP',
                    'FRAP',
                    'FRET',
                    'OCT',
                    'SPIM',
                    'X-ray computed tomography',
                    'X-ray microscopy',
                    'X-ray radiography',
                    'X-ray tomography',
                    'acrylic painted graphic',
                    'animation',
                    'array-scan confocal microscopy',
                    'atomic force microscopy',
                    'back-scattered_electron imaging',
                    'black and white graphic',
                    'bright-field microscopy',
                    'camera lucida assisted graphic',
                    'charcoal pencil graphic',
                    'color graphic',
                    'colored pencil graphic',
                    'computed tomography',
                    'computer graphic',
                    'confocal microscopy',
                    'dark-field microscopy',
                    'diagram',
                    'differential interference contrast microscopy',
                    'electron microscopy',
                    'evanescent wave microscopy',
                    'evanescent wave scattering',
                    'fluorescence microscopy',
                    'fluorescence polarization microscopy',
                    'focussed ion beam scanning electron microscopy (FIB-SEM)',
                    'free hand graphic',
                    'graphic illustration',
                    'graphite pencil graphic',
                    'grey scale graphic',
                    'high-voltage electron microscopy (HVEM)',
                    'intermediate voltage electron microacopy (IVEM)',
                    'light microscopy',
                    'line art graphic',
                    'macroscopy',
                    'microscopy',
                    'microscopy with lenses',
                    'montage',
                    'multi-photon microscopy',
                    'nearfield scanning optical microscopy (ANSOM)',
                    'oil painted graphic',
                    'orientation-independent polarization microscopy',
                    'painted graphic',
                    'pastel painted graphic',
                    'pen and ink graphic',
                    'phase contrast microscopy',
                    'polarization microscopy',
                    'portrayed image',
                    'radiography',
                    'recorded image',
                    'scanning electron microscopy (SEM)',
                    'scanning probe microscopy',
                    'scanning tunneling microscopy',
                    'scanning-transmission electron microscopy',
                    'secondary_electron imaging',
                    'serial block face SEM (SBFSEM)',
                    'single-spot confocal microscopy',
                    'slit-scan confocal microscopy',
                    'spinning disk confocal microscopy',
                    'time lapse microscopy',
                    'tomography',
                    'transmission electron microscopy (TEM)',
                    'two-photon laser scanning microscopy'
                  ]
                }
              },
              {
                name: 'Instrument',
                icon: 'fa-comment',
                valueType: { name: 'text' },
                display: 'required'
              },
              {
                name: 'Image acquisition overview',
                icon: 'fa-comment',
                valueType: { name: 'largetext' },
                display: 'required'
              }
            ]
          },
          {
            display: 'required',
            displayAnnotations: false,
            minRequired: 0,
            name: 'Image analysis',
            sectionExample: 'Everything between persistent storage and submission data',
            fieldTypes: [
              {
                name: 'Image analysis overview',
                icon: 'fa-comment',
                valueType: { name: 'largetext' },
                display: 'required'
              }
            ]
          }
        ]
      }
    ]
  }
};
