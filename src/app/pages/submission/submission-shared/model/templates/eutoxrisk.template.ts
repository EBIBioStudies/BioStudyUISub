export const euToxRiskTemplate = {
  name: "EU-ToxRisk",
  description:
    "Integrated European programme for mechanism-based Toxicity testing and Risk assessment",
  sectionType: {
    name: "Study",
    display: "required",
    fieldTypes: [
      {
        name: "Title",
        icon: "fa-title",
        valueType: {
          name: "largetext",
          minlength: 25,
        },
        display: "required",
      },
      {
        name: "Description",
        icon: "fa-comment",
        valueType: { name: "largetext" },
      },
      {
        name: "Project part",
        icon: "fa-comment",
        valueType: { name: "text" },
      },
      {
        name: "Organism",
        icon: "fa-eyedropper",
        valueType: {
          name: "select",
          values: ["Homo sapiens (human)", "Danio rerio (zebrafish)"],
        },
      },
      {
        name: "Organ",
        icon: "fa-eyedropper",
        valueType: {
          name: "select",
          values: [
            "liver",
            "brain",
            "embryo",
            "lung",
            "kidney",
            "whole body",
            "other",
          ],
        },
      },
      {
        name: "Cell type",
        icon: "fa-eyedropper",
        valueType: {
          name: "select",
          values: [
            "cell line",
            "primary cells",
            "stem cells",
            "stem cell derived",
          ],
        },
      },
      {
        name: "Cell name",
        icon: "fa-eyedropper",
        valueType: {
          name: "select",
          values: ["CELLLINE", "HepG2", "HEK", "LUHMES"],
        },
      },
      {
        name: "Exposure time",
        icon: "fa-cogs",
        valueType: {
          name: "select",
          values: ["6h", "12h", "24h"],
        },
      },
      {
        name: "Treatment modality",
        icon: "fa-cogs",
        valueType: {
          name: "text",
          values: ["single dose", "repeated dose", "recovery"],
        },
      },
      {
        name: "Information domain",
        icon: "fa-cogs",
        valueType: {
          name: "select",
          values: [
            "cytotoxicity",
            "cell function",
            "biochemical",
            "reporter",
            "metabolomics",
            "transcriptomics",
            "biokinetics",
            "other",
          ],
        },
      },
      {
        name: "Toxicity domain",
        icon: "fa-cogs",
        valueType: {
          name: "select",
          values: [
            "DART (Dev/Repro)",
            "RDT (= organ toxicity)",
            "BOTH",
            "OTHER",
          ],
        },
      },
    ],
    annotationsType: {
      title: "Describe your study",
      icon: "fa-tag",
      description:
        "Provide any additional details that may help discover or interpret the study.",
      columnTypes: [
        {
          name: "AttachTo",
          valueType: { name: "text" },
          display: "readonly",
        },
        {
          name: "Compound",
          valueType: { name: "text" },
        },
        {
          name: "Endpoint",
          valueType: { name: "text" },
        },
      ],
    },
    featureTypes: [
      {
        name: "Contact",
        title: "Add Contacts",
        icon: "fa-address-card",
        description:
          "Add the contact details for the authors involved in the study.",
        uniqueCols: true,
        display: "required",
        columnTypes: [
          {
            name: "Name",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "E-mail",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Organisation",
            valueType: {
              name: "select",
              multiple: true,
              values: [
                "BASF",
                "BioDetection Systems B.V.",
                "BioTalentum Ltd",
                "Cosmetics Europe",
                "Cyprotex Ltd",
                "European Bioinformatics Institute (EMBL-EBI)",
                "European Molecular Biology Laboratory (EMBL)",
                "F. Hoffmann-La Roche Ltd",
                "Fraunhofer Institute for Toxicology and Experimental Medicine",
                "Heidelberg University",
                "InSphero AG",
                "Ineris",
                "Instituto de Investigación Sanitaria La Fe (IIS La Fe)",
                "Italian National Health Institute (ISS)",
                "Johns Hopkins Bloomberg School of Public Health",
                "KU Leuven",
                "Konstanz University",
                "Leibniz Research Centre for Working Environment and Human Factors (IfADo)",
                "Leiden University Medical Center (LUMC)",
                "L’Oréal",
                "Maastricht University",
                "Mario Negri Institute for Pharmacological Research (IRCCS)",
                "Medical University of Innsbruck",
                "Netherlands Organisation for Applied Scientific Research (TNO)",
                "Novo Nordisk Foundation Center for Protein Research",
                "Pompeu Fabra University",
                "Swetox",
                "The Danish Environmental Protection Agency",
                "The Federal Institute for Occupational Safety and Health (BAuA)",
                "TissUse GmbH",
                "Unilever",
                "University of Vienna",
              ],
            },
            display: "required",
          },
          {
            name: "Role",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "ORCID",
            valueType: { name: "text" },
            display: "desirable",
          },
          {
            name: "Address",
            valueType: { name: "text" },
          },
          {
            name: "Department",
            valueType: { name: "text" },
          },
          {
            name: "Funding",
            valueType: { name: "text" },
          },
        ],
      },
      {
        name: "Endpoint",
        title: "Add endpoints",
        icon: "fa-medkit",
        description:
          "Provide at least the method and analytical measure of the study's endpoints.",
        uniqueCols: true,
        columnTypes: [
          {
            name: "Method",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Analytical measure",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "Type",
            valueType: { name: "text" },
          },
          {
            name: "Readout method",
            valueType: { name: "text" },
          },
        ],
      },
      {
        name: "Compound",
        title: "Add compounds",
        icon: "fa-flask",
        description:
          "List all parent compounds by their most common chemical name. " +
          'For example, "Valproic acid" instead of "Valproate".',
        uniqueCols: true,
        columnTypes: [
          {
            name: "Name",
            valueType: { name: "text" },
            display: "required",
          },
          {
            name: "CAS number",
            valueType: { name: "text" },
          },
          {
            name: "SMILES",
            valueType: { name: "text" },
          },
          {
            name: "Supplier",
            valueType: { name: "text" },
          },
          {
            name: "Order number",
            valueType: { name: "text" },
          },
          {
            name: "Lot number",
            valueType: { name: "text" },
          },
          {
            name: "Compound form",
            valueType: { name: "text" },
          },
          {
            name: "Storage temp",
            valueType: { name: "text" },
          },
          {
            name: "Stock solvent",
            valueType: { name: "text" },
          },
          {
            name: "Stock conc",
            valueType: { name: "text" },
          },
          {
            name: "Stock aliquot storage",
            valueType: { name: "text" },
          },
          {
            name: "Other info",
            valueType: { name: "text" },
          },
        ],
      },
      {
        name: "Link",
        title: "Add Links",
        description:
          "Provide pointers to data held in external databases or to related information on the web. " +
          'Compact URIs from <a target="_blank" href="https://www.ebi.ac.uk/miriam/main/collections">Identifiers.org</a> ' +
          'are supported. URLs must include the scheme, e.g. "http://".',
        icon: "fa-link",
        uniqueCols: true,
        columnTypes: [
          {
            name: "Link",
            valueType: { name: "idlink" },
            display: "required",
          },
          {
            name: "Description",
            valueType: { name: "text" },
            display: "required",
          },
        ],
      },
      {
        name: "File",
        title: "Add Files",
        description:
          "List the data files for the study and describe their respective scopes.",
        icon: "fa-file",
        uniqueCols: true,
        columnTypes: [
          {
            name: "Path",
            valueType: { name: "file" },
            display: "required",
          },
          {
            name: "Description",
            valueType: { name: "text" },
            display: "desirable",
          },
          {
            name: "Type",
            valueType: { name: "text" },
            display: "desirable",
          },
        ],
      },
      {
        name: "Publication",
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
