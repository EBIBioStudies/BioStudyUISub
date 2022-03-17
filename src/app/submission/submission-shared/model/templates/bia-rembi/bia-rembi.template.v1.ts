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
              name: 'select',
              multiple: true,
              values: [
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
                "King's College London",
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
