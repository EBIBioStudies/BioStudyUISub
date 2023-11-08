export const defaultTemplate = {
  name: 'Default',
  title: 'Default',
  description: 'General submission',
  sectionType: {
    name: 'Study',
    tableGroups: [['Link', 'File']],
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
        name: 'Description',
        icon: 'fa-comment',
        display: 'required',
        valueType: {
          name: 'largetext',
          minlength: 50
        }
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        display: 'required',
        helpText: 'Add organism',
        helpLink: 'help#new-item-dropdown',
        valueType: {
          name: 'select',
          multiple: true,
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
        display: 'readonly',
        name: 'License',
        uniqueValues: false,
        helpLink: 'help#license',
        valueType: {
          name: 'selectvalquals',
          defaultValue: 'CC0',
          values: [
            {
              value: 'CC0',
              valqual: [{ name: 'URL', value: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode' }]
            },
            {
              value: 'CC BY 4.0',
              valqual: [{ name: 'URL', value: 'https://creativecommons.org/licenses/by/4.0/legalcode' }]
            }
          ],
          enableValueAdd: false
        }
      }
    ],
    annotationsType: {
      title: 'Annotation',
      description: 'Provide any additional details that may help discover or interpret the study.',
      icon: 'fa-tag',
      display: 'desirable',
      singleRow: true,
      allowImport: false,
      columnTypes: [
        {
          name: 'AttachTo',
          valueType: { name: 'text' },
          display: 'readonly'
        },
        {
          name: 'Experimental design',
          valueType: { name: 'text' },
          display: 'optional'
        },
        {
          name: 'Experimental factor',
          valueType: { name: 'text' },
          display: 'optional'
        },
        {
          name: 'Organ',
          valueType: { name: 'text' },
          display: 'optional'
        },
        {
          name: 'Cell type',
          valueType: { name: 'text' },
          display: 'optional'
        }
      ]
    },
    tableTypes: [
      {
        name: 'Contact',
        description: 'Add the contact details for the authors involved in the study.',
        icon: 'fa-address-card',
        display: 'required',
        uniqueCols: true,
        allowImport: true,
        rowAsSection: true,
        columnTypes: [
          {
            autosuggest: false,
            display: 'required',
            name: 'Name',
            valueType: { name: 'text' }
          },
          {
            autosuggest: false,
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
          'Provide pointers to data held in external databases or to related information on the web. ' +
          'Compact URIs from <a target="_blank" href="https://www.ebi.ac.uk/miriam/main/collections">Identifiers.org</a> ' +
          'are supported. </br>URLs must include the scheme, e.g. "http://".',
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
        description:
          'List and describe the data files associated with your study. It is possible to link entire directories, but note that for data consumers these will be served as zip files.',
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
        name: 'Publication',
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
    ]
  }
};
