export const testTemplate = {
  name: 'TestTemplate',
  title: 'TestTemplate',
  description: 'Template to be used in testing',
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
          isStudyTitle: true
        },
        display: 'required'
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
      },
      {
        name: 'Type',
        icon: 'fa-microscope',
        valueType: {
          name: 'select',
          values: ['compound library screen', 'electron microscopy volume map']
        }
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        display: 'required',
        valueType: {
          name: 'select',
          multiple: true,
          values: ['Homo sapiens (human)', 'Mus musculus (mouse)']
        }
      }
    ],
    tableTypes: [
      {
        name: 'Keywords',
        icon: 'fa-address-card',
        description: 'Add keywords',
        uniqueCols: true,
        display: 'desirable',
        columnTypes: [
          {
            name: 'Keyword',
            valueType: { name: 'text' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'Contact',
        icon: 'fa-address-card',
        description: 'Add the contact details for the authors involved in the study.',
        uniqueCols: true,
        display: 'required',
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
              values: ['European Molecular Biology Laboratory (EMBL)', 'European Bioinformatics Institute (EMBL-EBI)']
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
              values: ['corresponding author', 'data acquisition']
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
        description: 'Add the protocols involved in the study.',
        icon: 'fa-address-card',
        name: 'Study Protocols',
        uniqueCols: true,
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
              values: ['data Analysis Protocol', 'growth protocol']
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
            display: 'required'
          },
          {
            name: 'Description',
            icon: 'fa-comment',
            valueType: { name: 'largetext' },
            display: 'required'
          },
          {
            name: 'Type',
            icon: 'fa-comment',
            display: 'desirable',
            valueType: {
              name: 'select',
              values: ['primary screen', 'secondary screen', 'validation screen']
            }
          },
          {
            name: 'Imaging Method',
            icon: 'fa-comment',
            valueType: {
              name: 'select',
              values: ['bright-field microscopy', 'confocal fluorescence microscopy']
            }
          },
          {
            name: 'Technology Type',
            icon: 'fa-comment',
            valueType: {
              name: 'select',
              values: ['cell line screen', 'compound screen']
            }
          },
          {
            name: 'FileList',
            title: 'File List',
            icon: 'fa-file',
            valueType: { name: 'file' },
            display: 'required',
            helpLink: 'https://www.ebi.ac.uk/biostudies/BioImages/help',
            helpText: 'Help'
          },
          {
            name: 'Comment',
            icon: 'fa-comment',
            valueType: { name: 'largetext' },
            display: 'desirable'
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
