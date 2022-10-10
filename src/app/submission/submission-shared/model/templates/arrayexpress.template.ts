export const arrayExpressTemplate = {
  name: 'ArrayExpress',
  title: 'ArrayExpress',
  description: 'ArrayExpress studies',
  display: 'readonly',
  sectionType: {
    name: 'Study',
    displayAnnotations: true,
    banner: {
      src: 'images/ae-logo-64.svg',
      alt: 'ArrayExpress logo',
      backgroundColor: 'rgb(94, 140, 192)'
    },
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        display: 'readonly',
        valueType: {
          name: 'largetext'
        }
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
        name: 'Study type',
        icon: 'fa-tag',
        display: 'readonly',
        valueType: {
          name: 'text'
        }
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        display: 'readonly',
        valueType: {
          name: 'text'
        }
      },
      {
        name: 'Description',
        icon: 'fa-tag',
        display: 'readonly',
        valueType: {
          name: 'largetext'
        }
      }
    ],
    tableTypes: [
      {
        name: 'Contact',
        description: 'Add the contact details for the authors involved in the study.',
        icon: 'fa-address-card',
        display: 'optional',
        uniqueCols: true,
        allowImport: true,
        rowAsSection: true,
        columnTypes: [
          {
            autosuggest: false,
            display: 'desirable',
            name: 'Name',
            valueType: { name: 'text' }
          },
          {
            autosuggest: false,
            name: 'Email',
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'Organisation',
            valueType: {
              name: 'org',
              multiple: true
            },
            display: 'optional'
          },
          {
            name: 'Role',
            valueType: { name: 'text' }
          },
          {
            name: 'ORCID',
            valueType: { name: 'orcid' },
            display: 'optional'
          }
        ]
      },
      {
        name: 'Publication',
        display: 'optional',
        description:
          'Add the bibliography relevant to the study. Autofill is available when searching by ' +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. ' +
          'For other IDs, you may use ' +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">PubMed\'s converter</a>.',
        icon: 'fa-book',
        uniqueCols: true,
        allowImport: false,
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
      },
      {
        name: 'Link',
        icon: 'fa-link',
        uniqueCols: true,
        allowImport: true,
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
            display: 'desirable'
          }
        ]
      },
      {
        name: 'File',
        icon: 'fa-file',
        uniqueCols: true,
        allowImport: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'File',
            valueType: { name: 'file' },
            display: 'required'
          },
          {
            name: 'Description',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Type',
            valueType: { name: 'text' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'MINSEQE Score',
        icon: 'fa-sliders-h',
        uniqueCols: true,
        allowImport: true,
        rowAsSection: true
      }
    ],
    sectionTypes: [
      {
        name: 'Samples',
        displayAnnotations: true,
        fieldTypes: [
          {
            name: 'Sample count',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          },
          {
            name: 'Experimental Factors',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          },
          {
            name: 'Source Characteristics',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          }
        ],
        tableTypes: [
          {
            name: 'Experimental Factors',
            displayAnnotations: true,
            rowAsSection: true
          },
          {
            name: 'Source Characteristics',
            displayAnnotations: true,
            rowAsSection: true
          }
        ]
      },
      {
        name: 'Assays and Data',
        displayAnnotations: true,
        fieldTypes: [
          {
            name: 'Assay count',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          },
          {
            name: 'Technology',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          },
          {
            name: 'Assay by Molecule',
            icon: 'fa-comment',
            valueType: { name: 'text' }
          }
        ],
        sectionTypes: [
          {
            name: 'Raw Data',
            tableTypes: [
              {
                name: 'File',
                description: 'List the raw data files for the experiment.',
                icon: 'fa-file',
                uniqueCols: true,
                allowImport: true,
                rowAsSection: true,
                columnTypes: [
                  {
                    name: 'File',
                    valueType: { name: 'file' },
                    display: 'required'
                  }
                ]
              }
            ]
          },
          {
            name: 'Processed Data',
            tableTypes: [
              {
                name: 'File',
                description: 'List the processed data files for the experiment.',
                icon: 'fa-file',
                uniqueCols: true,
                allowImport: true,
                rowAsSection: true,
                columnTypes: [
                  {
                    name: 'File',
                    valueType: { name: 'file' },
                    display: 'required'
                  }
                ]
              }
            ]
          },
          {
            name: 'Additional Files',
            tableTypes: [
              {
                name: 'File',
                description: 'List the additional data files for the experiment.',
                icon: 'fa-file',
                uniqueCols: true,
                allowImport: true,
                rowAsSection: true,
                columnTypes: [
                  {
                    name: 'File',
                    valueType: { name: 'file' },
                    display: 'required'
                  }
                ]
              }
            ]
          },
          {
            name: 'MAGE-TAB Files',
            tableTypes: [
              {
                name: 'File',
                description: 'List the MAGE-TAB files for the experiment.',
                icon: 'fa-file',
                uniqueCols: true,
                allowImport: true,
                rowAsSection: true,
                columnTypes: [
                  {
                    name: 'File',
                    valueType: { name: 'file' },
                    display: 'required'
                  }
                ]
              }
            ]
          },
          {
            name: 'Array Designs',
            tableTypes: [
              {
                name: 'File',
                description: 'List the MAGE-TAB files for the experiment.',
                icon: 'fa-file',
                uniqueCols: true,
                allowImport: true,
                rowAsSection: true,
                columnTypes: [
                  {
                    name: 'File',
                    valueType: { name: 'file' },
                    display: 'required'
                  }
                ]
              },
              {
                name: 'Link',
                icon: 'fa-link',
                uniqueCols: true,
                allowImport: true,
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
                    display: 'desirable'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'MINSEQE Score',
        icon: 'fa-sliders-h',
        singleRow: true,
        allowImport: false,
        displayAnnotations: true
      },
      {
        name: 'MIAME Score',
        icon: 'fa-sliders-h',
        singleRow: true,
        allowImport: false,
        displayAnnotations: true
      }
    ]
  }
};
