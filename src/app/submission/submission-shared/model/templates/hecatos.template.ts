export const hecatosTemplate = {
  name: 'HeCaToS',
  title: 'HeCaToS',
  description: 'Hepatic and Cardiac Toxicity Systems modelling',
  sectionType: {
    name: 'Study',
    display: 'required',
    displayAnnotations: true,
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
        name: 'Description',
        icon: 'fa-comment',
        valueType: { name: 'largetext' }
      },
      {
        name: 'Sample Type',
        icon: 'fa-disease',
        valueType: {
          name: 'select',
          values: ['cardiac microtissue', 'heart biopsy', 'liver microtissue', 'liver biopsy', 'serum sample']
        }
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        helpText: 'Add organism',
        helpLink: 'help#new-item-dropdown',
        valueType: {
          name: 'select',
          values: ['Homo sapiens (human)', 'Sus scrofa (pig)']
        }
      },
      {
        name: 'Organ',
        icon: 'fa-lungs',
        valueType: {
          name: 'select',
          values: ['heart', 'liver']
        }
      },
      {
        name: 'Dose',
        icon: 'fa-vial',
        valueType: {
          name: 'select',
          values: ['therapeutic', 'toxic']
        }
      },
      {
        name: 'Raw/Processed',
        icon: 'fa-tag',
        valueType: {
          name: 'select',
          values: ['raw', 'processed']
        }
      },
      {
        name: 'Biological Replicate',
        icon: 'fa-comment',
        valueType: { name: 'text' }
      },
      {
        name: 'CHEMBL ID',
        icon: 'fa-flask',
        valueType: {
          name: 'select',
          values: [
            'CHEMBL112',
            'CHEMBL633',
            'CHEMBL1542',
            'CHEMBL118',
            'CHEMBL160',
            'CHEMBL178',
            'CHEMBL139',
            'CHEMBL92',
            'CHEMBL53463',
            'CHEMBL417',
            'CHEMBL185',
            'CHEMBL1117',
            'CHEMBL64',
            'CHEMBL58',
            'CHEMBL426',
            'CHEMBL16',
            'CHEMBL428647',
            'CHEMBL374478',
            'CHEMBL109'
          ]
        }
      },
      {
        name: 'StdInChIKey',
        icon: 'fa-flask',
        valueType: {
          name: 'select',
          values: [
            'RZVAJINKPMORJF-UHFFFAOYSA-N',
            'IYIKLHRQXLHMJQ-UHFFFAOYSA-N',
            'LMEKQMALGUDUQG-UHFFFAOYSA-N',
            'RZEKVGVHFLEQIL-UHFFFAOYSA-N',
            'STQGQHZAVUOBTE-VGBVRHCVSA-N',
            'DCOPUUMXTXDBNB-UHFFFAOYSA-N',
            'ZDZOTLJHXYCWBA-VCVYQWHSSA-N',
            'AOJJSUZBOXZQNB-TZSSRYMLSA-N',
            'AOJJSUZBOXZQNB-VTZDEGQISA-N',
            'GHASVSINZRGABV-UHFFFAOYSA-N',
            'XDXDZDZNSLXDNA-TZNDIEGXSA-N',
            'QRXWMOHMRWLFEY-UHFFFAOYSA-N',
            'KKZJGLLVHKMTCM-UHFFFAOYSA-N',
            'FBOZXECLQNJBKD-UHFFFAOYSA-N',
            'CXOFVDLJLONNDW-UHFFFAOYSA-N',
            'RCINICONZNJXQF-MZXODVADSA-N',
            'JQXXHWHPUNPDRT-WLSIYKJHSA-N',
            'NIJJYAXOARWZEE-UHFFFAOYSA-N'
          ]
        }
      },
      {
        name: 'Design Type',
        icon: 'fa-cogs',
        valueType: { name: 'text' }
      },
      {
        name: 'Assay Measurement Type',
        icon: 'fa-cogs',
        valueType: { name: 'text' }
      },
      {
        name: 'Assay Technology Type',
        icon: 'fa-cogs',
        valueType: { name: 'text' }
      },
      {
        name: 'Assay Technology Platform',
        icon: 'fa-cogs',
        valueType: { name: 'text' }
      },
      {
        name: 'Protocol Type',
        icon: 'fa-cogs',
        valueType: { name: 'text' }
      },
      {
        name: 'Data Type',
        icon: 'fa-cogs',
        valueType: {
          name: 'select',
          values: ['genomic data', 'proteomics data', 'metabolomic data', 'functional data']
        }
      }
    ],
    annotationsType: {
      icon: 'fa-tag',
      description: 'Provide any additional details that may help discover or interpret the study.',
      columnTypes: [
        {
          name: 'AttachTo',
          valueType: { name: 'text' },
          display: 'readonly'
        },
        {
          name: 'Factor Name',
          valueType: {
            name: 'select',
            values: [
              'Age',
              'Compound',
              'Dose',
              'Dose duration',
              'Dose frequency',
              'Post treatment duration',
              'Sampling time point',
              'Sampling date',
              'Time range',
              'Incubation time with respective conc. [uM]'
            ]
          },
          display: 'desirable'
        },
        {
          name: 'Compound',
          icon: 'fa-flask',
          valueType: {
            name: 'select',
            values: [
              'Acetaminophen',
              'Amiodarone',
              'Azathioprine',
              'Celecoxib',
              'Cyclosporin',
              'Daunorubicin',
              'Diclofenac',
              'Docetaxel',
              'Doxorubicin',
              'Epirubicin',
              'Fluorouracil',
              'Idarubicin',
              'Isoniazid',
              'Mitoxantrone',
              'Methotrexate',
              'Phenytoin',
              'Paclitaxel',
              'Rifampicin',
              'Valproic Acid',
              'DMSO(0.1%)',
              'DMSO(Fluctuating)',
              'None'
            ]
          },
          display: 'desirable'
        }
      ]
    },
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
            display: 'required'
          },
          {
            name: 'E-mail',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Organisation',
            helpText: 'Add org',
            helpLink: 'help#new-item-dropdown',
            valueType: {
              name: 'org',
              multiple: true
            },
            display: 'required'
          },
          {
            name: 'ORCID',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Role',
            valueType: { name: 'text' },
            display: 'optional'
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
        name: 'Link',
        description:
          'Add the bibliography relevant to the study. Autofill is available when searching by ' +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. ' +
          'For other IDs, you may use ' +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">PubMed\'s converter</a>.',
        icon: 'fa-link',
        uniqueCols: true,
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
        name: 'File',
        description: 'List the data files for the study and describe their respective scopes.',
        icon: 'fa-file',
        uniqueCols: true,
        rowAsSection: true,
        columnTypes: [
          {
            name: 'Path',
            valueType: { name: 'file' },
            display: 'required'
          },
          {
            name: 'Roche ID',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Sampling date',
            valueType: { name: 'date' },
            display: 'desirable'
          },
          {
            name: 'Sampling time point',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'Description',
            valueType: { name: 'text' },
            display: 'desirable'
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
        name: 'ProtocolName',
        description: 'List the details of any experimental protocols employed.',
        icon: 'fa-cogs',
        uniqueCols: true,
        columnTypes: [
          {
            name: 'Name',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Type',
            valueType: { name: 'text' },
            display: 'required'
          },
          {
            name: 'Description',
            valueType: { name: 'text' },
            display: 'desirable'
          },
          {
            name: 'URI',
            valueType: { name: 'text' },
            display: 'desirable'
          }
        ]
      }
    ]
  }
};
