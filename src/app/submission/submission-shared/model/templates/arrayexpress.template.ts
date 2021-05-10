export const arrayExpressTemplate = {
  name: 'ArrayExpress',
  title: 'ArrayExpress',
  description: 'ArrayExpress studies',
  display: 'readonly',
  sectionType: {
    name: 'Study',
    displayAnnotations: true,
    fieldTypes: [
      {
        name: 'Title',
        icon: 'fa-heading',
        display: 'readonly',
        valueType: {
          name: 'largetext',
          minlength: 25
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
        name: 'Description',
        icon: 'fa-comment',
        display: 'readonly',
        valueType: {
          name: 'largetext',
          minlength: 50
        }
      },
      {
        name: 'Organism',
        icon: 'fa-tag',
        display: 'readonly',
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
      }
    ],
    tableTypes: [
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
    ]
  }
};
