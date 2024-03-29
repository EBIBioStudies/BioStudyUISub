export const proteinDesignsTemplate = {
  name: 'ProteinDesigns',
  title: 'Protein Designs',
  description: 'Protein Engineering and Design project',
  sectionType: {
    name: 'Study',
    displayAnnotations: true,
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        display: 'required',
        valueType: {
          name: 'largetext',
          minlength: 25
        },
        asyncValueValidatorName: 'forStudyTitle'
      },
      {
        name: 'Description of design',
        icon: 'fa-comment',
        display: 'required',
        valueType: {
          name: 'largetext',
          minlength: 50
        }
      },
      {
        name: 'Introduction',
        icon: 'fa-comment',
        display: 'required',
        valueType: {
          name: 'largetext',
          minlength: 50
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
        name: '3D model of design (Format supported by PDB)',
        icon: 'fa-file',
        display: 'desirable',
        valueType: {
          name: 'file'
        }
      },
      {
        name: 'DNA sequence of the plasmid you are using for expression, including DNA sequence of your protein',
        icon: 'fa-dna',
        display: 'desirable',
        valueType: {
          name: 'dna'
        }
      },
      {
        name: 'Amino acid sequence of the protein',
        icon: 'fa-vial',
        display: 'desirable',
        valueType: {
          name: 'protein'
        }
      },
      {
        name: 'How are proteins produced?',
        helpText:
          'For example "expressed in E. coli", "synthesized chemically", "expressed using yeast surface display"',
        icon: 'fa-comment',
        display: 'required',
        valueType: {
          name: 'largetext',
          minlength: 25
        }
      },
      {
        name: 'Name of expression vector used',
        icon: 'fa-tag'
      },
      {
        name: 'Driver of expression',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['T7', 'T5']
        }
      },
      {
        name: 'Origin of replication',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['ColE1', 'pMB1', 'pSC101', 'R6K', 'p15A', 'pBR322', 'pUC']
        }
      },
      {
        name: 'Antibiotic resistance gene',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['ampicillin', 'chloramphenicol', 'kanamycin']
        }
      },
      {
        name: 'Tag',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['His6', 'GST (glutathione s-transferase)', 'MBL (maltose binding protein)', 'Strep-tag®']
        }
      },
      {
        name: 'Tag attachment site',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['N-terminus', 'C-terminus']
        }
      },
      {
        name: 'Cleavage site for tag',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['TEV', 'Thrombin']
        }
      },
      {
        name: 'Cell strain used to express the protein',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: [
            'E. coli BL21(DE3)',
            'E. coli BL21(DE3)pLysS',
            'E. coli BL21(DE3)Star',
            'E. coli Lemo21(DE3)',
            'E. coli Rosetta-gamiB(DE3)'
          ]
        }
      },
      {
        name: 'Method of induction',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['IPTG', 'autoinduction']
        }
      },
      {
        name: 'Induction temperature (in degrees celcius)',
        icon: 'fa-tag'
      },
      {
        name: 'Assessment of solubility',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['insoluble', 'partially soluble', 'soluble']
        }
      },
      {
        name: 'Is the protein expressed?',
        helpText:
          'Based on whatever test you use to assess the amount of protein produced (e.g. band on a gel, ' +
          'fluorescence signal) would you rank this particular protein as high, medium or low expression ' +
          '(choice from a menu) you can also write in "none"',
        icon: 'fa-tag',
        display: 'required',
        valueType: {
          name: 'select',
          values: ['High', 'Medium', 'Low']
        }
      },
      {
        name: 'Solubility',
        helpText:
          'Especially relevant for proteins expressed in cells. When you lyse the cell, is the majority of the protein ' +
          'of interest in the supernatant or the pelet after the first spin? Please upload data from whatever ' +
          'test you use, e.g. an image of a protein gel.',
        icon: 'fa-file',
        display: 'desirable',
        valueType: {
          name: 'file'
        }
      },
      {
        name: 'Solution characterization',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['Monodisperse', 'Aggregated']
        },
        display: 'desirable'
      },
      {
        name: 'Protein stability assessment (temperature/denaturant vs MRE)',
        icon: 'fa-file',
        display: 'desirable',
        valueType: {
          name: 'file'
        }
      }
    ],
    tableTypes: [
      {
        name: 'Thermal denaturation',
        icon: 'fa-file',
        display: 'required',
        uniqueCols: true,
        allowCustomCols: false,
        columnTypes: [
          {
            name: 'Is thermal denaturation reversible?',
            valueType: { name: 'select', values: ['Yes', 'No'] },
            display: 'desirable'
          },
          {
            name: 'Comments',
            display: 'desirable',
            valueType: {
              name: 'largetext'
            }
          }
        ]
      },
      {
        name: 'Protein Expression and Solubility',
        description:
          'Please upload data from whatever test you use. e.g. an image of a protein gel, data from a FACS experient.',
        icon: 'fa-file',
        display: 'desirable',
        uniqueCols: true,
        columnTypes: [
          {
            name: 'Protein expression evidence',
            valueType: { name: 'file' },
            display: 'required'
          },
          {
            name: 'Protein identity verification by mass spectrometry',
            icon: 'fa-tag',
            display: 'desirable',
            valueType: {
              name: 'select',
              values: ['Yes', 'No']
            }
          }
        ]
      },
      {
        name: 'Association state',
        icon: 'fa-file',
        display: 'desirable',
        uniqueCols: true,
        columnTypes: [
          {
            name: 'Association state',
            valueType: { name: 'select', values: ['Monomer', 'Dimer', 'Trimer', 'Aggregated'] },
            display: 'desirable'
          },
          {
            name: 'Association state evidence',
            valueType: {
              name: 'select',
              values: [
                'Analytical ultracentrifugation (AUC)',
                'Size exclusion chromatography (SEC)',
                'SEC/Multiangle light scattering (MALS) (SEC/MALS)',
                'Small angle x-ray scattering (SAXS)'
              ]
            },
            display: 'desirable'
          },
          {
            name: 'File',
            valueType: { name: 'file' },
            display: 'desirable'
          },
          {
            name: 'Conditions',
            display: 'desirable'
          }
        ]
      },
      {
        name: 'SolutionCharacterization',
        description: 'Solution characterization (structure) / Circular Dichroism (CD)',
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        allowCustomCols: false,
        columnTypes: [
          {
            name: 'File',
            valueType: { name: 'file' },
            display: 'required'
          },
          {
            name: 'Conditions',
            display: 'required'
          },
          {
            name: 'Temperature (°C)',
            display: 'desirable'
          },
          {
            name: 'pH',
            display: 'desirable'
          },
          {
            name: 'Concentration of protein (g/L)',
            display: 'desirable'
          },
          {
            name: 'Path length of cell (cm)',
            display: 'desirable'
          },
          {
            name: 'Buffer',
            display: 'desirable'
          },
          {
            name: 'Other agents present',
            valueType: { name: 'largetext' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'SolutionCharacterizationFluorescence',
        description: 'Solution characterisation (structure) / fluorescence',
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        allowCustomCols: false,
        columnTypes: [
          {
            name: 'Intensity',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Wavelength',
            valueType: { name: 'text' },
            display: 'required'
          }
        ]
      },
      {
        name: 'NMR data - 1D spectra',
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        allowCustomCols: false,
        columnTypes: [
          {
            name: '1D spectra',
            valueType: {
              name: 'select',
              values: ['Good peak dispersion', 'Intermediate quality spectrum', 'Unfolded']
            },
            display: 'desirable'
          },
          {
            name: 'Associated file',
            valueType: { name: 'file' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'NMR data - 2D HSQC spectra',
        icon: 'fa-book',
        display: 'desirable',
        uniqueCols: true,
        allowCustomCols: false,
        columnTypes: [
          {
            name: '2D HSQC spectra',
            valueType: {
              name: 'select',
              values: ['Good peak dispersion', 'Intermediate quality spectrum', 'Poor quality spectrum', 'Unfolded']
            },
            display: 'desirable'
          },
          {
            name: 'Associated file',
            valueType: { name: 'file' },
            display: 'desirable'
          }
        ]
      },
      {
        name: 'File',
        description: '3D structural confirmation of the design (Format supported by PDB)',
        icon: 'fa-file',
        display: 'desirable',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'File',
            valueType: { name: 'file' },
            display: 'required'
          },
          {
            name: 'Link',
            valueType: { name: 'idlink' },
            display: 'required'
          }
        ]
      },
      {
        name: 'Contact',
        description: 'Add the contact details for the authors involved in the study.',
        icon: 'fa-address-card',
        display: 'required',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            autosuggest: false,
            display: 'required',
            name: 'Name of depositor',
            valueType: { name: 'text' }
          },
          {
            autosuggest: false,
            name: 'E-mail',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            autosuggest: false,
            name: 'Group',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Organisation / University',
            helpText: 'Add org',
            helpLink: 'help#new-item-dropdown',
            valueType: {
              name: 'org',
              multiple: true
            },
            display: 'required'
          },
          {
            autosuggest: false,
            name: 'Funding Body',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Role',
            valueType: { name: 'text' },
            display: 'optional'
          },
          {
            name: 'ORCID',
            valueType: { name: 'orcid' },
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
          }
        ]
      }
    ]
  }
};
