export const arrayExpressTemplate = {
  name: "ArrayExpress",
  description: "ArrayExpress studies",
  display: "readonly",
  sectionType: {
    name: "Study",
    fieldTypes: [
      {
        name: "ReleaseDate",
        icon: "fa-calendar-alt",
        display: "required",
        valueType: {
          name: "date",
          allowPast: false,
        },
      },
    ],
    featureTypes: [
      {
        name: "Publication",
        display: "optional",
        title: "Add Publications",
        description:
          "Add the bibliography relevant to the study. Autofill is available when searching by " +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a> identifier. ' +
          "For other IDs, you may use " +
          '<a target="_blank" href="https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter">PubMed\'s converter</a>.',
        icon: "fa-book",
        uniqueCols: true,
        columnTypes: [
          {
            name: "PMID",
            valueType: { name: "pubmedid" },
            display: "desirable",
          },
          {
            name: "Authors",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Title",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Year",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Volume",
            valueType: { name: "text" },
            display: "desirable",
          },
          {
            name: "Issue",
            valueType: { name: "text" },
            display: "desirable",
          },
          {
            name: "Type",
            valueType: { name: "text" },
          },
          {
            name: "Issn",
            valueType: { name: "text" },
          },
          {
            name: "DOI",
            valueType: { name: "text" },
          },
        ],
      },
    ],
  },
};
