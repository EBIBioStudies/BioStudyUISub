export const microbioRamanTemplate = {
  name: 'MicrobioRaman',
  title: 'MicrobioRaman',
  description: 'Microbiological  Raman Spectroscopy Data',
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
          name: 'largetext'
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
        }
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: { name: 'largetext' }
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
      }
    ],
    sectionTypes: [
      {
        display: 'required',
        displayAnnotations: false,
        minRequired: 0,
        name: 'Sample',
        sectionExample: 'Name of cell or compound, source, composition, conditions, mounting substrate, etc.',
        fieldTypes: [
          {
            name: 'Name of cell or compound',
            icon: 'fa-file-invoice',
            valueType: {
              name: 'text',
              placeholder: 'Description of what is being assayed. Sample names from publications can also go here.'
            },
            display: 'optional'
          },
          {
            name: 'Source',
            icon: 'fa-vial',
            valueType: {
              name: 'text',
              placeholder:
                'Source of the sample, such as a strain collection, chemical supplier, or the environment or tissue sample was taken from.'
            },
            display: 'optional'
          },
          {
            name: 'Composition',
            icon: 'fa-cogs',
            valueType: {
              name: 'largetext',
              placeholder:
                'Entities are contained in the sample,  including not just the cells of interest, but the media, and well as any extraneous materials such as tissue, debris, biofilm matrix, or soil.'
            },
            display: 'optional'
          },
          {
            name: 'Sample condition',
            icon: 'fa-temperature-low',
            valueType: {
              name: 'largetext',
              placeholder: 'Are the cells dry or wet, are they fixed or unfixed, and what are they suspended in. '
            },
            display: 'optional'
          },
          {
            name: 'Mounting substrate',
            icon: 'fa-layer-group',
            valueType: { name: 'text', placeholder: 'Glass coverslip, aluminum slide, CaF2 Slide' },
            display: 'optional'
          }
        ],
        tableTypes: [
          {
            name: 'File',
            display: 'desirable',
            description: 'Image file if spectra is part of a hyperspectral Raman image.',
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
                name: 'Coordinates',
                valueType: { name: 'text', placeholder: 'coordinate value of spectra' },
                display: 'desirable'
              },
              {
                name: 'Spot size/spacing',
                valueType: { name: 'text', placeholder: 'Pixel size and spacing of spectra' },
                display: 'desirable'
              }
            ]
          }
        ]
      },
      {
        display: 'required',
        displayAnnotations: false,
        minRequired: 0,
        name: 'Setup',
        sectionExample: 'Information about setup of the system and lasers.',
        fieldTypes: [
          {
            name: 'Raman system used',
            icon: 'fa-microscope',
            valueType: { name: 'text', placeholder: 'Manufacturer and model of scope used' },
            display: 'optional'
          },
          {
            name: 'Measurement type',
            icon: 'fa-ruler-combined',
            valueType: {
              name: 'select',
              values: [
                'Spontaneous Raman Scattering',
                'Resonance Raman Scattering (RR)',
                'Coherent Anti-Stokes Raman Scattering (CARS)',
                'Stimulated Raman Scattering (SRS)',
                'Hyper Raman Scattering (HRS)',
                'Surface-enhanced Raman Scattering (SERS)'
              ]
            },
            display: 'optional'
          }
        ],
        tableTypes: [
          {
            name: 'File',
            icon: 'fa-wave-square',
            rowAsSection: true,
            uniqueCols: true,
            description:
              'Raw, untreated spectrum with wavenumbers, bins, and intensities at each bin; format as TSV,CSV or other universal file format.',
            display: 'required',
            singleRow: true,
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
          },
          {
            name: 'Laser',
            display: 'desirable',
            description: 'Wavelength of laser (nm); Power of excitation laser (mW); Neutral density filter (%).',
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
                name: 'Wavelength of laser (nm)',
                valueType: { name: 'text', placeholder: 'Laser wavelength in nanometers' },
                display: 'required'
              },
              {
                name: 'Power of excitation laser (mW)',
                valueType: { name: 'text', placeholder: 'Laser power in milliwatts, prior to ND filter' },
                display: 'required'
              },
              {
                name: 'Neutral density filter (%)',
                valueType: { name: 'text', placeholder: 'ND filter percentage, if applicable' },
                display: 'desirable'
              },
              {
                name: 'Acquisition time (sec)',
                display: 'required',
                valueType: { name: 'text', placeholder: 'Acquisition time of a single reading in seconds' }
              },
              {
                name: 'Number of acquisitions (for average)',
                display: 'required',
                valueType: { name: 'text', placeholder: 'Number of averaged or accumulated acquisitions' }
              },
              {
                name: 'Measurement window (cm⁻¹)',
                display: 'required',
                valueType: { name: 'text', placeholder: 'Start and end of measurement range in cm⁻¹' }
              },
              {
                name: 'Resolution (cm⁻¹)',
                display: 'required',
                valueType: { name: 'text', placeholder: 'Resolution of the spectrum in cm⁻¹' }
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
        sectionExample: 'Final spectrum data (as CSV) with all treatments specified below',
        tableTypes: [
          {
            name: 'File',
            icon: 'fa-wave-square',
            display: 'required',
            rowAsSection: true,
            uniqueCols: true,
            singleRow: true,
            columnTypes: [
              {
                name: 'File',
                valueType: { name: 'file', allowFolders: false },
                display: 'required'
              },
              {
                name: 'Type',
                valueType: { name: 'text', defaultValue: 'Treated spectrum' },
                display: 'required'
              }
            ]
          },
          {
            name: 'Data treatments',
            icon: 'fa-address-card',
            description:
              'Add data treatments, one per line e.g. De-noising applied, baseline subtraction methods used, any type of normalization applied to the spectrum',
            display: 'desirable',
            columnTypes: [
              {
                name: 'Treatment',
                valueType: { name: 'text', placeholder: 'Treatment description' },
                display: 'desirable'
              }
            ]
          }
        ]
      },
      {
        name: 'Instrument metadata',
        displayAnnotations: true,
        icon: 'fa-file-invoice',
        description: 'Magnification and numerical aperture (NA) of an objective, grating, pinhole size, etc.',
        display: 'desirable',
        columnTypes: [
          {
            name: 'Key',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Value',
            valueType: { name: 'text' },
            display: 'desirable'
          }
        ]
      }
    ]
  }
};
