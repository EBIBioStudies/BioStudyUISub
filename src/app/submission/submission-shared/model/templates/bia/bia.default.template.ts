export const biaDefaultTemplate = {
  name: 'BioImages',
  title: 'BioImages',
  description: 'SUPER-USER FORM for REMBI submissions',
  sectionType: {
    display: 'readonly',
    displayAnnotations: true,
    tableGroups: [],
    name: 'Study',
    banner: {
      src: 'images/logo_bia.svg',
      alt: 'BioImage Archive logo',
      backgroundColor: '#038392',
      contactUs: {
        text:
          'SUPER-USER FORM for a BioImage Archive REMBI submission. YOU MAY BREAK YOUR SUBMISSION by using this template for anything other than fixing typos, as all validations/helpers are bypassed. Consider using the REMBI submission generation scripts, or contact ',
        email: 'bioimage-archive@ebi.ac.uk'
      }
    },
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        valueType: {
          name: 'largetext'
        },
        display: 'desirable',
        helpContextual: {
          description:
            'The title for your dataset. This will be displayed when search results including your data are shown. Often this will be the same as an associated publication.',
          examples: [
            'Visualization of loop extrusion by DNA nanoscale tracing in single cells',
            'SARS-COV-2 drug repurposing - Caco2 cell line',
            'Large-scale electron microscopy database for human type 1 diabetes'
          ]
        }
      },
      {
        name: 'ReleaseDate',
        title: 'Release Date',
        icon: 'fa-calendar-alt',
        display: 'desirable',
        valueType: {
          name: 'date',
          allowPast: false
        },
        helpContextual: {
          description:
            'The date at which your dataset should become publicly visible. This can be changed after submission if needed.'
        }
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: {
          name: 'largetext'
        },
        display: 'desirable',
        helpContextual: {
          description:
            'Use this field to describe your dataset. This can be the abstract to an accompanying publication.'
        }
      },
      {
        name: 'Keywords',
        icon: 'fa-address-card',
        description: 'Add keywords<br><a href="/bioimage-archive/help-submission-form/#keywords">Examples</a>',
        display: 'desirable',
        valueType: {
          name: 'select',
          multiple: true
        },
        helpContextual: {
          description: 'Keywords describing your data that can be used to aid search and classification.',
          examples: ['RNA localisation', 'CRISPR', 'Brain']
        }
      },
      {
        name: 'Acknowledgements',
        icon: 'fa-comment',
        valueType: {
          name: 'largetext'
        },
        display: 'desirable',
        helpContextual: {
          description: 'Any people or groups that should be acknowledged as part of the dataset.'
        }
      },
      {
        display: 'desirable',
        name: 'License',
        uniqueValues: false,
        defaultValue: 'CC0',
        valueType: {
          name: 'select',
          values: ['CC0', 'CC BY 4.0'],
          enableValueAdd: false
        },
        helpContextual: {
          description: 'The license under which the data are available.',
          examplesHtml: [
            'Full text for the <a href="https://creativecommons.org/share-your-work/public-domain/cc0/" target="_blank" >CC0</a> license',
            'Full text for the <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank">CC BY 4.0</a> license'
          ]
        }
      }
    ],
    tableTypes: [
      {
        name: 'Contact',
        icon: 'fa-address-card',
        description: 'Add the contact details for the authors involved in the study.',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Name',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'The full name of the author.'
            }
          },
          {
            name: 'E-mail',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Author e-mail address.'
            }
          },
          {
            name: 'Organisation',
            valueType: {
              name: 'org',
              multiple: true
            },
            display: 'desirable',
            helpContextual: {}
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
            display: 'desirable',
            helpContextual: {
              description: 'Author role in the study.'
            }
          },
          {
            name: 'ORCID',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Author ORCID ID.'
            }
          }
        ],
        display: 'desirable',
        helpContextual: {}
      },
      {
        name: 'Publication',
        description: "The publication for which this submission's data was collected.",
        icon: 'fa-book',
        uniqueCols: true,
        rowAsSection: true,
        allowCustomCols: true,
        columnTypes: [
          {
            name: 'Pubmed ID',
            valueType: {
              name: 'pubmedid'
            },
            display: 'desirable',
            helpContextual: {
              description: 'PubMed identifier for the publication.'
            }
          },
          {
            name: 'Title',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Title of associated publication.'
            }
          },
          {
            name: 'Authors',
            valueType: {
              name: 'text',
              placeholder: 'First Author, Second Author, Third Author'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Authors of associated publication.'
            }
          },
          {
            name: 'DOI',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Digital Object Identifier (DOI).'
            }
          },
          {
            name: 'Year',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Year of publication.'
            }
          }
        ],
        display: 'desirable',
        helpContextual: {}
      },
      {
        name: 'Link',
        icon: '',
        description: '',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Link',
            valueType: {
              name: 'idlink'
            },
            display: 'desirable',
            helpContextual: {
              description: 'The URL of a link relevant to the dataset.'
            }
          },
          {
            name: 'Description',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'The description of the linked content.',
              examples: ['Image analysis code', 'Sequencing data', 'Project website']
            }
          }
        ],
        display: 'desirable',
        helpContextual: {}
      }
    ]
  }
};
