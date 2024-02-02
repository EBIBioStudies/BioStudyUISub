export const biaMifaTemplateV1 = {
  name: 'BioImages.MIFA.v1',
  title: 'BioImages - MIFA',
  description: 'BioImage Archive Annotations Submission (for Image Annotations only)',
  sectionType: {
    display: 'required',
    displayAnnotations: false,
    tableGroups: [],
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
        asyncValueValidatorName: 'forStudyTitle',
        display: 'required',
        helpContextual: {
          description: 'This will be displayed when search results including your data are shown.',
          examples: []
        }
      },
      {
        name: 'Description',
        icon: 'fa-comment',
        valueType: {
          name: 'largetext'
        },
        display: 'required',
        helpContextual: {
          description:
            'Use this field to describe your dataset. This can be the abstract to an accompanying publication.'
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
        },
        helpContextual: {
          description:
            'The date (GMT) at which your dataset should become publicly visible. This can be changed after submission if needed.'
        }
      },
      {
        name: 'Keywords',
        icon: 'fa-address-card',
        description: 'Add keywords<br><a href="/bioimage-archive/help-submission-form/#keywords">Examples</a>',
        display: 'required',
        valueType: {
          name: 'select',
          multiple: true
        },
        helpContextual: {
          description: 'Keywords describing your data that can be used to aid search and classification.',
          examples: []
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
      }
    ],
    tableTypes: [
      {
        name: 'Contact',
        icon: 'fa-address-card',
        description: 'Add the contact details for the authors involved in the submission.',
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
            display: 'required',
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
              name: 'orcid'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Author ORCID ID.'
            }
          }
        ],
        display: 'required',
        helpContextual: {}
      },
      {
        name: 'Funding',
        icon: '',
        description:
          'List of individual grants funding data acquisition.' +
          'For <b>Horizon Europe</b> grants, please ensure the <a href="https://www.ebi.ac.uk/bioimage-archive/help-faq/#how-should-i-acknowledge-my-funder-when-submitting-data" target="_blank">required fields</a> are present.',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Agency',
            icon: '',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'The funding body provididing support.'
            }
          },
          {
            name: 'grant_id',
            icon: '',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'The identifier for the grant.'
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
    ],
    sectionTypes: [
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Annotation',
        fieldTypes: [
          {
            name: 'Annotation Overview',
            valueType: {
              name: 'text'
            },
            description: 'Short descriptive summary indicating the type of annotation and how it was generated',
            display: 'desirable',
            helpContextual: {
              description: '',
              examples: []
            }
          },
          {
            name: 'Annotation Method',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Description of how the annotations where created.',
              examples: [
                'crowdsourced',
                'expertly annotated',
                'produced by software - Which software',
                'when were the annotations created',
                'protocols used for consensus and quality assurance'
              ]
            }
          },
          {
            name: 'Annotation Confidence Level',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Confidence on annotation accuracy',
              examples: [
                'self-reported confidence',
                'variance among several annotators',
                'number of years of experience of the annotator'
              ]
            }
          },
          {
            name: 'Annotation Criteria',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Rules used to generate annotations',
              examples: ['only nuclei in focus were segmented']
            }
          },
          {
            name: 'Annotation Coverage',
            valueType: {
              name: 'text'
            },
            display: 'desirable',
            helpContextual: {
              description:
                'If the dataset is not completely annotated, which images from the dataset were annotated, and what percentage of the data has been annotated from what is available?',
              examples: []
            }
          }
        ],
        tableTypes: [],
        sectionTypes: [],
        display: 'required',
        helpContextual: {}
      }
    ]
  }
};
