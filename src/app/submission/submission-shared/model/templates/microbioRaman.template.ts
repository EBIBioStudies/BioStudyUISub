export const microbioRamanTemplate = {
  name: 'MicrobioRaman',
  title: 'MicrobioRaman',
  description: 'Microbiological Raman Spectroscopy Data',
  sectionType: {
    display: 'required',
    displayAnnotations: false,
    tableGroups: [[]],
    name: 'Study',
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        valueType: {
          name: 'largetext',
          placeholder: 'Project title'
        },
        display: 'required',
        asyncValueValidatorName: 'forStudyTitle'
      },
      {
        name: 'ReleaseDate',
        title: 'Release Date',
        icon: 'fa-calendar-alt',
        display: 'required',
        valueType: {
          name: 'date',
          allowPast: false
        },
        helpContextual: {
          description: 'Desired release date (GMT), for example, to ensure compliance with a publication embargo'
        }
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: {
          name: 'largetext',
          placeholder:
            'Brief description of the project; details if isotopes (e.g., stable isotope probing (SIP)) or fluorescent probes (e.g., fluorescence in situ hybridization (FISH) probes) were used'
        }
      },
      {
        name: 'Peak identification',
        icon: 'fa-briefcase',
        valueType: {
          name: 'text',
          placeholder:
            'Identification of peaks and methods used for identification (e.g., literature, public or commercial databases); peak shifts if isotopes (e.g., SIP) were used'
        },
        display: 'optional'
      },
      {
        name: 'Software',
        icon: 'fa-briefcase',
        valueType: {
          name: 'text',
          placeholder: 'If a commercial Raman system was used for measurement, the name and version of software'
        },
        display: 'optional'
      }
    ],
    tableTypes: [
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
            helpText: 'Add org',
            helpLink: 'help#new-item-dropdown',
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
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'Department',
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'Funding',
            valueType: { name: 'text' },
            display: 'optional'
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
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'Issn',
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'DOI',
            valueType: { name: 'text' },
            display: 'optional'
          }
        ]
      },
      {
        name: 'File',
        title: 'Raw Data File',
        icon: 'fa-wave-square',
        rowAsSection: true,
        uniqueCols: true,
        description:
          'Unprocessed raw Raman data (composed of wavenumbers and corresponding Raman intensities) and data labels; format as TSV, CSV or other universal file format',
        display: 'required',
        columnTypes: [
          {
            name: 'File',
            valueType: { name: 'file', allowFolders: false },
            display: 'required'
          },
          {
            name: 'Type',
            valueType: { name: 'text', defaultValue: 'Raw spectrum' },
            display: 'required'
          }
        ]
      }
    ],
    sectionTypes: [
      {
        display: 'required',
        displayAnnotations: false,
        name: 'Sample',
        sectionExample: 'The biological context and treatment',
        fieldTypes: [
          {
            name: 'Name of cell or compound',
            icon: 'fa-file-invoice',
            valueType: {
              name: 'text',
              placeholder: 'Sample names'
            },
            display: 'required'
          },
          {
            name: 'Source',
            icon: 'fa-vial',
            valueType: {
              name: 'text',
              placeholder:
                'Source of a sample, such as a strain collection, a chemical supplier, or the environment or tissue from which a sample was obtained'
            },
            display: 'required'
          },
          {
            name: 'Composition',
            icon: 'fa-cogs',
            valueType: {
              name: 'largetext',
              placeholder:
                'Entities contained in the sample, including not just the cells of interest, but also the medium, as well as any extraneous materials such as tissue, debris, biofilm matrix, or soil'
            },
            display: 'required'
          },
          {
            name: 'Preparation',
            icon: 'fa-temperature-low',
            valueType: {
              name: 'largetext',
              placeholder:
                'For example, preservation after sampling, culturing condition (e.g., sample volume, medium, light condition/diel cycle, pH, temperature, antibiotics, oxic/anoxic), sample age, fixed or unfixed, whether the cells were dry or wet for Raman measurement; whether isotopes (e.g., SIP) or fluorescent probes (e.g., FISH probes) were used'
            },
            display: 'required'
          },
          {
            name: 'Mounting substrate',
            icon: 'fa-layer-group',
            valueType: { name: 'text', placeholder: 'E.g., glass coverslip, aluminum slide, CaF2 slide, quartz slide' },
            display: 'required'
          }
        ],
        tableTypes: [
          {
            name: 'File',
            title: 'Image File',
            display: 'desirable',
            description:
              'Image files from Raman imaging; image files from light or electron microscopy (e.g., bright-field or SEM images of a sample, fluorescence images for FISH)',
            icon: 'fa-file-image',
            uniqueCols: true,
            rowAsSection: true,
            allowImport: true,
            columnTypes: [
              {
                name: 'File',
                valueType: { name: 'file', allowFolders: false },
                display: 'required'
              },
              {
                name: 'Type',
                valueType: { name: 'text', defaultValue: 'Image file' },
                display: 'required'
              }
            ]
          }
        ]
      },
      {
        display: 'required',
        displayAnnotations: false,
        name: 'Setup',
        sectionExample: 'Experimental conditions',
        fieldTypes: [
          {
            name: 'Raman system',
            icon: 'fa-microscope',
            valueType: { name: 'text', placeholder: 'Manufacturer and model of the scope' },
            display: 'required'
          },
          {
            name: 'Measurement type',
            icon: 'fa-ruler-combined',
            valueType: {
              name: 'select',
              values: [
                'coherent anti-Stokes Raman scattering (CARS)',
                'hyper Raman scattering (HRS)',
                'normal Raman scattering',
                'polarized Raman spectroscopy',
                'resonance Raman scattering',
                'spatially offset Raman spectroscopy (SORS)',
                'stimulated Raman scattering (SRS)',
                'surface-enhanced Raman scattering (SERS)',
                'time-gated (TG) Raman spectroscopy',
                'tip-enhanced Raman scattering (TERS)'
              ]
            },
            display: 'required'
          }
        ],
        tableTypes: [
          {
            name: 'Lasers and connected components/parameter',
            display: 'required',
            description:
              'Wavelength of laser (nm), power of excitation laser (mW), neutral density filter (%) and other characteristics',
            icon: 'fa-grip-lines',
            uniqueCols: true,
            allowImport: true,
            columnTypes: [
              {
                name: 'Description',
                valueType: { name: 'text' },
                display: 'desirable'
              },
              {
                name: 'Manufacturer and model',
                valueType: { name: 'text' },
                display: 'desirable'
              },
              {
                name: 'Wavelength (nm)',
                valueType: { name: 'text' },
                display: 'required'
              },
              {
                name: 'Power (mW)',
                valueType: { name: 'text' },
                display: 'required'
              },
              {
                name: 'Continuous wave or pulsed',
                valueType: { name: 'text', placeholder: 'If pulsed, pulse duration and repetition rate' },
                display: 'required'
              },
              {
                name: 'Excitation intensity',
                valueType: { name: 'text', placeholder: 'For nonlinear Raman spectroscopy (e.g., CARS/SRS)' },
                display: 'desirable'
              },
              {
                name: 'Polarization state',
                valueType: { name: 'text', placeholder: 'For polarized Raman spectroscopy' },
                display: 'desirable'
              },
              {
                name: 'Laser spot shape',
                valueType: { name: 'select', values: ['circular', 'elliptical', 'torus', 'square', 'rectangular'] },
                display: 'required'
              },
              {
                name: 'Laser illumination spot size',
                valueType: { name: 'text', placeholder: 'E.g., diameter for a circular shape' },
                display: 'required'
              },
              {
                name: 'Neutral density filter (%)',
                valueType: { name: 'text', placeholder: '100% if not used' },
                display: 'required'
              },
              {
                name: 'Grating',
                valueType: { name: 'text', placeholder: '0 if not used' },
                display: 'required'
              },
              {
                name: 'Acquisition time (sec)',
                display: 'required',
                valueType: { name: 'text' }
              },
              {
                name: 'Accumulation number',
                display: 'required',
                valueType: { name: 'text', placeholder: 'For averaging' }
              },
              {
                name: 'Spectral window (cm⁻¹)',
                display: 'required',
                valueType: { name: 'text' }
              },
              {
                name: 'Resolution (cm⁻¹)',
                display: 'required',
                valueType: { name: 'text' }
              }
            ]
          }
        ]
      },
      {
        display: 'desirable',
        displayAnnotations: false,
        minRequired: 0,
        name: 'Treated spectrum',
        sectionExample: 'Data processing',
        fieldTypes: [
          {
            name: 'Software',
            icon: 'fa-briefcase',
            valueType: {
              name: 'text',
              placeholder:
                'If manufacturer’s software was used for data processing and analysis, the name and version of software'
            },
            display: 'desirable'
          }
        ],
        tableTypes: [
          {
            name: 'File',
            title: 'Processed Data File',
            icon: 'fa-wave-square',
            display: 'desirable',
            rowAsSection: true,
            uniqueCols: true,
            columnTypes: [
              {
                name: 'File',
                valueType: { name: 'file', allowFolders: false },
                display: 'required'
              },
              {
                name: 'Type',
                valueType: {
                  name: 'select',
                  values: [
                    'principal component analysis',
                    'hierarchical cluster analysis',
                    'linear discriminant analysis'
                  ]
                },
                helpContextual: {
                  description: 'Processed Raman data and data analysis',
                  examples: [
                    'principal component analysis',
                    'hierarchical cluster analysis',
                    'linear discriminant analysis'
                  ]
                },
                display: 'required'
              }
            ]
          },
          {
            name: 'Data treatments',
            icon: 'fa-list',
            description:
              'List of computational algorithms and their parameters and sources used for data processing and analysis',
            display: 'desirable',
            columnTypes: [
              {
                name: 'Treatment',
                valueType: { name: 'text', placeholder: 'Treatment description' },
                display: 'required'
              }
            ]
          },
          {
            name: 'Software',
            icon: 'fa-comment',
            valueType: {
              name: 'text',
              placeholder: 'If manufacturer’s software was used for data processing, the name and version of software.'
            },
            display: 'optional'
          }
        ]
      },
      {
        name: 'Instrument metadata',
        displayAnnotations: true,
        minRequired: 0,
        icon: 'fa-file-invoice',
        sectionExample: 'Additional instrument information that could help users to reproduce the measurements',
        display: 'desirable',
        annotationsType: {
          title: 'Additional instrument details',
          description:
            'Provide any additional details that could help users to reproduce the measurements. Select from the list, or add your own.',
          icon: 'fa-tag',
          display: 'desirable',
          singleRow: true,
          allowImport: false,
          columnTypes: [
            {
              name: 'Type of spike filter',
              valueType: { name: 'text' },
              display: 'optional'
            },
            {
              name: 'Detector specifications',
              valueType: { name: 'text' },
              display: 'optional'
            },
            {
              name: 'Details of a microscope objective or a focusing lens',
              valueType: { name: 'text' },
              display: 'optional'
            },
            {
              name: 'Confocality',
              valueType: { name: 'text' },
              display: 'optional'
            },
            {
              name: 'Spectral binning',
              valueType: { name: 'text' },
              display: 'optional'
            }
          ]
        }
      }
    ]
  }
};
