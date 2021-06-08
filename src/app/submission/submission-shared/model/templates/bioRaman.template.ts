export const bioRamanTemplate = {
  name: "BioRaman",
  title: "BioRaman",
  description: "High Content Screen Image Study",
  sectionType: {
    display: "required",
    displayAnnotations: false,
    tableGroups: [[]],
    name: "Study",
    fieldTypes: [
      {
        name: "Title",
        icon: "fa-heading",
        valueType: {
          name: "largetext",
          isStudyTitle: true
        },
        display: "required"
      },
      {
        name: "ReleaseDate",
        title: "Release Date",
        icon: "fa-calendar-alt",
        display: "required",
        valueType: {
          name: "date",
          allowPast: false
        }
      },
      {
        name: "Description",
        icon: "fa-comment",
        valueType: { name: "largetext" }
      },
    ],
    tableTypes: [
      {
        name: "Contact",
        icon: "fa-address-card",
        description: "Add the contact details for the authors involved in the study.",
        uniqueCols: true,
        display: "required",
        columnTypes: [
          {
            name: "Name",
            valueType: { name: "text" },
            display: "required",
            required: true
          },
          {
            name: "Organisation",
            valueType: {
              name: "select",
              multiple: true,
              values: [
                "Australia Bioinformatics Resource (EMBL-ABR)",
                "Beijing Genomics Institute (BGI)",
                "Biomedicine Institute of Valencia (IBV)",
                "Broad Institute",
                "Center for Computational Biology and Bioinformatics of Korea (CCBB)",
                "Centre for Biological Research (CIB)",
                "Centre for Molecular Biology Severo Ochoa (CBMSO)",
                "Chinese National Human Genome Center (CHGC)",
                "Cold Spring Harbor Laboratory (CSHL)",
                "Dana-Farber Cancer Institute",
                "ETH Zürich",
                "European Bioinformatics Institute (EMBL-EBI)",
                "European Molecular Biology Laboratory (EMBL)",
                "F. Hoffmann-La Roche Ltd",
                "Francis Crick Institute",
                "Garvan Institute of Medical Research",
                "Genedata AG",
                "Genetic Information Research Institute (GIRI)",
                "Genome Institute of Singapore (GIS)",
                "Georgetown University Medical Center",
                "German Institute of Medical Documentation and Information",
                "Howard Hughes Medical Institute (HHMI)",
                "Icahn Institute for Genomics and Multiscale Biology",
                "Imperial College London",
                "InSphero AG",
                "Institute of Biotechnology and Pharmaceutical Research of Taiwan (IBPR)",
                "Institute of Molecular and Cell Biology of Singapore (IMCB)",
                "Institute of Molecular and Genomic Medicine of Taiwan",
                "Instituto de Investigación Sanitaria La Fe (IIS La Fe)",
                "International Plant Genetic Resources Institute (IPGRI)",
                "Johns Hopkins University",
                "Joint Genome Institute (JGI)",
                "King's College London",
                "Kyoto University Bioinformatics Center",
                "Luxcel Biosciences",
                "MRC Biostatistics Unit (BSU)",
                "MRC Cancer Unit",
                "MRC Centre for Drug Safety Science (CDSS)",
                "MRC Human Genetics Unit",
                "MRC Institute of Genetics and Molecular Medicine (IGMM)",
                "MRC Laboratory for Molecular Cell Biology (LMCB)",
                "MRC Laboratory of Molecular Biology (LMB)",
                "MRC Mammalian Genetics Unit (MGU)",
                "MRC Toxicology Unit",
                "MRC Weatherall Institute of Molecular Medicine (WIMM)",
                "Maastricht University",
                "Mary Lyon Centre (MLC)",
                "Max Planck Institute for Molecular Cell Biology and Genetics",
                "Microdiscovery GMBH",
                "National Center for Biotechnology Information (NCBI)",
                "National Human Genome Research Institute (NHGRI)",
                "National Institute of Cancer Research of Taiwan",
                "National Institute of Genetics of Japan (NIG)",
                "National Institutes of Health (NIH)",
                "Netherlands Bioinformatics Centre (NBIC)",
                "New York Genome Center (NYGC)",
                "New York University School of Medicine",
                "Okinawa Institute of Science and Technology (OIST)",
                "Ontario Institute for Cancer Research (OICR)",
                "Optibrium Ltd",
                "RWTH Aachen University",
                "Royan Institute",
                "Salk Institute for Biological Studies",
                "Science for Life Laboratory (SciLifeLab)",
                "Swiss Institute of Bioinformatics (SIB)",
                "The Centre for Applied Genomics of Toronto (TCAG)",
                "The Institute of Biomedical Research of Barcelona (IIBB)",
                "The Jackson Laboratory Cancer Center (JAXCC)",
                "The Scripps Research Institute (TSRI)",
                "Translational Genomics Research Institute (TGen)",
                "Wellcome Sanger Institute",
                "Wellcome Trust Centre for Human Genetics",
                "Wellcome Trust Sanger Institute",
                "Whitehead Institute for Biomedical Research"
              ]
            },
            display: "required",
            required: true
          },
          {
            name: "E-mail",
            valueType: { name: "text" },
            display: "required",
            required: true
          },
          {
            name: "ORCID",
            valueType: { name: "orcid" },
            display: "desirable"
          },
          {
            name: "Role",
            valueType: {
              name: "select",
              values: [
                "corresponding author",
                "data acquisition",
                "data analyst",
                "experiment performer",
                "first author",
                "investigator",
                "principal investigator",
                "software development",
                "submitter"
              ]
            },
            display: "desirable"
          },
          {
            name: "Address",
            valueType: { name: "text" }
          },
          {
            name: "Department",
            valueType: { name: "text" }
          },
          {
            name: "Funding",
            valueType: { name: "text" }
          }
        ]
      },
      {
        name: "Publication",
        description:
          "Add the bibliography relevant to the study. Autofill is available when searching by " +
          "<a target=\"_blank\" href=\"https://www.ncbi.nlm.nih.gov/pubmed/\">PubMed</a> identifier. For other IDs, you " +
          "may use <a target=\"_blank\" href=\"https://www.ncbi.nlm.nih.gov/pmc/pmctopmid/#converter\">this converter</a>.",
        icon: "fa-book",
        display: "desirable",
        uniqueCols: true,
        columnTypes: [
          {
            name: "PMID",
            valueType: { name: "pubmedid" },
            display: "desirable"
          },
          {
            name: "Authors",
            valueType: { name: "text" },
            display: "required"
          },
          {
            name: "Title",
            valueType: { name: "text" },
            display: "required"
          },
          {
            name: "Year",
            valueType: { name: "text" },
            display: "required"
          },
          {
            name: "Volume",
            valueType: { name: "text" },
            display: "desirable"
          },
          {
            name: "Issue",
            valueType: { name: "text" },
            display: "desirable"
          },
          {
            name: "Type",
            valueType: { name: "text" }
          },
          {
            name: "Issn",
            valueType: { name: "text" }
          },
          {
            name: "DOI",
            valueType: { name: "text" }
          }
        ]
      }
    ],
    sectionTypes: [
      {
        display: "required",
        displayAnnotations: false,
        minRequired: 0,
        name: "Sample",
        sectionExample: "Name",
        fieldTypes: [
          {
            name: "Name of cell or compound",
            icon: "fa-file-invoice",
            valueType: { name: "text" }
          },
          {
            name: "Source",
            icon: "fa-vial",
            valueType: { name: "text" }
          },
          {
            name: "Composition",
            icon: "fa-cogs",
            valueType: { name: "largetext" }
          },
          {
            name: "Sample condition",
            icon: "fa-temperature-low",
            valueType: { name: "largetext" }
          },
          {
            name: "Mounting substrate",
            icon: "fa-layer-group",
            valueType: { name: "text" }
          }
        ],
        tableTypes: [
          {
            name: "Image file",
            display: "desirable",
            description: "Image file if spectra is part of a hyperspectral Raman image. Add coordinate value of spectra and \"Pixel\" size and spacing of spectra.",
            icon: "fa-file-image",
            uniqueCols: true,
            allowImport: true,
            columnTypes: [
              {
                name: "File",
                valueType: { name: "file" },
                display: "required"
              },
              {
                name: "Coordinates",
                valueType: { name: "text" },
                display: "desirable"
              },
              {
                name: "Spot size/spacing",
                valueType: { name: "text" },
                display: "desirable"
              }
            ]
          },
        ]
      },
      {
        display: "required",
        displayAnnotations: false,
        minRequired: 0,
        name: "Setup",
        sectionExample: "Information about setup of the system and lasers.",
        fieldTypes: [
          {
            name: "Raman system used",
            icon: "fa-microscope",
            valueType: { name: "text" }
          },
          {
            name: "Measurement type",
            icon: "fa-ruler-combined",
            valueType: {
              name: "select",
              values: [
                "Spontaneous Raman Scattering",
                "Resonance Raman Scattering (RR)",
                "Coherent Anti-Stokes Raman Scattering (CARS)",
                "Stimulated Raman Scattering (SRS)",
                "Hyper Raman Scattering (HRS)",
                "Surface-enhanced Raman Scattering (SERS)"
              ]
            }
          }

        ],
        tableTypes: [
          {
            name: "Laser",
            display: "desirable",
            description: "Wavelength of laser (nm); Power of excitation laser (mW); Neutral density filter (%).",
            icon: "fa-grip-lines",
            uniqueCols: true,
            allowImport: true,
            columnTypes: [
              {
                name: "Description",
                valueType: { name: "text" },
                display: "desirable"
              },
              {
                name: "Wavelength of laser (nm)",
                valueType: { name: "text" },
                display: "required"
              },
              {
                name: "Power of excitation laser (mW)",
                valueType: { name: "text" },
                display: "required"
              },
              {
                name: "Neutral density filter (%)",
                valueType: { name: "text" },
                display: "desirable"
              },
              {
                name: "Acquisition time (sec)",
                display: "required",
                valueType: { name: "text" }
              },
              {
                name: "Number of acquisitions (for average)",
                display: "required",
                valueType: { name: "text" }
              },
              {
                name: "Measurement window (cm⁻¹)",
                display: "required",
                valueType: { name: "text" }
              },
              {
                name: "Resolution (cm⁻¹)",
                display: "required",
                valueType: { name: "text" }
              }
            ]
          },
        ]
      },
      {
        display: "desirable",
        displayAnnotations: false,
        minRequired: 0,
        name: "Treated spectrum",
        sectionExample: "Final spectrum data (as CSV) with all treatments specified below",
        fieldTypes: [
          {
            name: "File",
            icon: "fa-wave-square",
            valueType: { name: "file" },
            display: "required"
          }
        ],
        tableTypes: [
          {
            name: "Data treatments",
            icon: "fa-address-card",
            description: "Add data treatments, one per line e.g. De-noising applied, Baseline subtraction methods used, Any type of normalization applied to the spectrum",
            display: "desirable",
            columnTypes: [
              {
                name: "Treatment",
                valueType: { name: "text" },
                display: "desirable"
              }
            ]
          }
        ]
      },
      {
        name: "Instrument metadata",
        displayAnnotations: true,
        icon: "fa-file-invoice",
        description: "Magnification and numerical aperture (NA) of an objective, grating, pinhole size, etc.",
        display: "desirable",
        columnTypes: [
          {
            name: "Key",
            valueType: { name: "text" },
            display: "desirable"
          },
          {
            name: "Value",
            valueType: { name: "text" },
            display: "desirable"
          }
        ]
      },
    ]
  }
};
