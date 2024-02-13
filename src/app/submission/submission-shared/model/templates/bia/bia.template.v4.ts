export const biaTemplateV4 = {
  name: 'BioImages.v4',
  title: 'BioImages',
  description: 'BioImage Archive Study',
  sectionType: {
    display: 'required',
    displayAnnotations: false,
    tableGroups: [],
    name: 'Study',
    banner: {
      src: 'images/logo_bia.svg',
      alt: 'BioImage Archive logo',
      backgroundColor: '#038392',
      contactUs: {
        text:
          'If your submission contains complex REMBI section associations that do not fit this form, please send us an email at ',
        email: 'bioimage-archive@ebi.ac.uk'
      }
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
        display: 'required',
        name: 'License',
        uniqueValues: false,
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
        },
        helpContextual: {
          description: 'The license under which the data are available.',
          examplesHtml: [
            '<a href="https://creativecommons.org/publicdomain/zero/1.0/legalcode" target="_blank" >CC0</a>',
            '<a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank">CC BY 4.0</a>'
          ]
        }
      },
      {
        name: 'Funding statement',
        icon: '',
        valueType: {
          name: 'largetext',
          placeholder: 'Grant identifiers can be added in the "Fundings" section below'
        },
        display: 'desirable',
        helpContextual: {
          descriptionHtml:
            'A description of how the data generation was funded.' +
            '<p> For <b>Horizon Europe</b> grants, please ensure the <a href="https://www.ebi.ac.uk/bioimage-archive/help-faq/#how-should-i-acknowledge-my-funder-when-submitting-data" target="_blank">required fields</a> are present. </p>'
        }
      },
      {
        display: 'readonly',
        name: 'DOI',
        icon: 'fa-fingerprint',
        valueType: {
          name: 'doi',
          defaultValue: 'true'
        },
        description: 'A Crossref DOI will be assigned after submission automatically.'
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
              description: 'The funding body providing support.'
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
      }
    ],
    sectionTypes: [
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Biosample',
        fieldTypes: [
          {
            name: 'Title',
            display: 'required',
            valueType: {
              name: 'text'
            },
            helpContextual: {
              description:
                'A short, representative name for this Biosample section. You will use it in the Associations table of the Study Components REMBI section.',
              examples: ['Biosample 1', 'Biosample 2']
            }
          },
          {
            name: 'Organism',
            icon: 'fa-tag',
            display: 'required',
            valueType: {
              name: 'select',
              multiple: false,
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
            },
            helpContextual: {
              description: 'Species.'
            }
          },
          {
            name: 'Description',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'High level description of sample.',
              examples: ['Bronchial epithelial cell culture']
            }
          },
          {
            name: 'Biological entity',
            valueType: {
              name: 'largetext'
            },
            display: 'required',
            helpContextual: {
              description: 'What is being imaged.',
              examples: ['Adult mouse corpus callosum', 'Drosophila endoderm', 'AC16s human cardiomyoctye cells']
            }
          },
          {
            name: 'Experimental variable',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'What is intentionally varied between multiple images.',
              examples: ['Time', 'Genotype', 'Light exposure']
            }
          },
          {
            name: 'Extrinsic variable',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'External treatment (e.g. reagent).',
              examples: ['Plate-bound anti-CD3 activation', '2-(9-oxoacridin-10-yl)acetic acid', 'cridanimod']
            }
          },
          {
            name: 'Intrinsic variable',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Intrinsic (e.g. genetic) alteration.',
              examples: [
                'stable overexpression of HIST1H2BJ-mCherry and LMNA',
                'Jurkat E6.1 transfected with emerald-VAMP7',
                'Homozygous GFP integration into mitotic genes'
              ]
            }
          }
        ],
        tableTypes: [],
        sectionTypes: [],
        display: 'required',
        helpContextual: {}
      },
      {
        name: 'Specimen',
        displayAnnotations: false,
        fieldTypes: [
          {
            name: 'Title',
            display: 'required',
            valueType: {
              name: 'text'
            },
            helpContextual: {
              description:
                'A short, representative name for this Specimen section. You will use it in the Associations table of the Study Components REMBI section.',
              examples: ['Specimen 1', 'Specimen 2']
            }
          },
          {
            name: 'Sample preparation protocol',
            valueType: {
              name: 'largetext'
            },
            display: 'required',
            helpContextual: {
              description: 'How the sample was prepared for imaging.',
              examples: [
                'Cells were cultured on poly-L-lysine treated coverslips. Culture media was aspirated, and coverslips were washed once with PBS. Cells were fixed by incubating for 10 min with 4 % formaldehyde/PBS, washed twice with PBS, and permeabilized by incubating (>3 h, -20\u00b0C) in 70 % ethanol. Cells were rehydrated by incubating (5 min, RT) with FISH wash buffer (10 % formamide, 2x SSC). For hybridization, coverslips were placed cell-coated side down on a 48\u03bcl drop containing 100 nM Quasar570-labelled probes complementary to one of REV-ERB\u03b1, CRY2, or TP53 transcripts (Biosearch Technologies) (see Table S6 for probe sequences), 0.1 g/ml dextran sulfate, 1 mg/ml E. coli tRNA, 2 mM VRC, 20 \u03bcg/ml BSA, 2x SSC, 10 % formamide and incubated (37\u00b0C, 20 h) in a sealed parafilm chamber. Coverslips were twice incubated (37\u00b0C, 30 min) in pre-warmed FISH wash buffer, then in PBS containing 0.5 \u03bcg/ml 4\u2019,6-diamidino-2-phenylindole (DAPI) (5 min, RT), washed twice with PBS, dipped in water, air-dried, placed cell-coated side down on a drop of ProLong Diamond Antifade Mountant (Life Technologies), allowed to polymerize for 24 h in the dark and then sealed with nail varnish.',
                'Immunostained spreads of Arabidopsis pachytene cells were prepared for 3D-SIM imaging as follows. To roughly stage the meiocytes, a single anther from a floral bud was removed and squashed in a drop of water on a clean slide under a coverslip and inspected using brightfield microscopy. Early- and mid-pachytene meiocytes were still stuck together within a meiocyte column, whilst late-pachytene meiocytes had begun to break apart from one-another. More precise staging of early and late pachytene meiocytes was also based on previously defined HEI10 behaviour, with mid pachytene meiocytes exhibiting an intermediate phenotype. The remaining 5 anthers containing meiocytes of the desired stage were dissected from the staged buds. They were then macerated using a brass rod on a No. 1.5H coverslip (Marienfeld) in 10 \u00b5l digestion medium (0.4% cytohelicase, 1.5% sucrose, 1% polyvinylpyrolidone in sterile water) for 1 min. Coverslips were then incubated in a moist chamber at 37 \u00b0C for 4 min before adding 10 \u00b5l of 2% lipsol solution followed by 20 \u00b5l 4% paraformaldehyde (pH 8). Coverslips were dried in the fume hood for 3 h, blocked in 0.3% bovine serum albumin in 1x phosphate-buffered saline (PBS) solution and then incubated with primary antibody at 4 \u00b0C overnight and secondary antibody at 37 \u00b0C for 2 h. In between antibody incubations, coverslips were washed 3 times for 5 min in 1x PBS plus 0.1% Triton X-100. Coverslips were then incubated in 10 \u00b5l DAPI (10 \u00b5g/ml) for 5 min, washed and mounted on a slide in 7 \u00b5l Vectashield.',
                'Cells grown on coverslips were fixed in ice-cold methanol at _20 _ C for 10 min. After blocking in 0.2% gelatine from cold-water fish (Sigma) in PBS (PBS/FSG) for 15 min, coverslips were incubated with primary antibodies in blocking solution for 1h. Following washes with 0.2% PBS/FSG, the cells were incubated with a 1:500 dilution of secondary antibodies for 1 h (donkey anti- mouse/rabbit/goat/sheep conjugated to Alexa 488 or Alexa 594; Molecular Probes  or donkey anti-mouse conjugated to DyLight 405, Jackson ImmunoResearch). The cells were counterstained with 1 _g ml_1 Hoechst 33342 (Sigma) to visualize chromatin. After washing with 0.2% PBS/FSG, the coverslips were mounted on glass slides by inverting them into mounting solution (ProLong Gold antifade, Molecular Probes). The samples were allowed to cure for 24-48 h.'
              ]
            }
          },
          {
            name: 'Growth protocol',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'How the specimen was grown, e.g. cell line cultures, crosses or plant growth.',
              examples: [
                'Cells were cultured on poly-L-lysine treated coverslips. Culture media was aspirated, and coverslips were washed once with PBS. Cells were fixed by incubating for 10 min with 4 % formaldehyde/PBS, washed twice with PBS, and permeabilized by incubating (>3 h, -20\u00b0C) in 70 % ethanol. Cells were rehydrated by incubating (5 min, RT) with FISH wash buffer (10 % formamide, 2x SSC). For hybridization, coverslips were placed cell-coated side down on a 48\u03bcl drop containing 100 nM Quasar570-labelled probes complementary to one of REV-ERB\u03b1, CRY2, or TP53 transcripts (Biosearch Technologies) (see Table S6 for probe sequences), 0.1 g/ml dextran sulfate, 1 mg/ml E. coli tRNA, 2 mM VRC, 20 \u03bcg/ml BSA, 2x SSC, 10 % formamide and incubated (37\u00b0C, 20 h) in a sealed parafilm chamber. Coverslips were twice incubated (37\u00b0C, 30 min) in pre-warmed FISH wash buffer, then in PBS containing 0.5 \u03bcg/ml 4\u2019,6-diamidino-2-phenylindole (DAPI) (5 min, RT), washed twice with PBS, dipped in water, air-dried, placed cell-coated side down on a drop of ProLong Diamond Antifade Mountant (Life Technologies), allowed to polymerize for 24 h in the dark and then sealed with nail varnish.',
                'Immunostained spreads of Arabidopsis pachytene cells were prepared for 3D-SIM imaging as follows. To roughly stage the meiocytes, a single anther from a floral bud was removed and squashed in a drop of water on a clean slide under a coverslip and inspected using brightfield microscopy. Early- and mid-pachytene meiocytes were still stuck together within a meiocyte column, whilst late-pachytene meiocytes had begun to break apart from one-another. More precise staging of early and late pachytene meiocytes was also based on previously defined HEI10 behaviour, with mid pachytene meiocytes exhibiting an intermediate phenotype. The remaining 5 anthers containing meiocytes of the desired stage were dissected from the staged buds. They were then macerated using a brass rod on a No. 1.5H coverslip (Marienfeld) in 10 \u00b5l digestion medium (0.4% cytohelicase, 1.5% sucrose, 1% polyvinylpyrolidone in sterile water) for 1 min. Coverslips were then incubated in a moist chamber at 37 \u00b0C for 4 min before adding 10 \u00b5l of 2% lipsol solution followed by 20 \u00b5l 4% paraformaldehyde (pH 8). Coverslips were dried in the fume hood for 3 h, blocked in 0.3% bovine serum albumin in 1x phosphate-buffered saline (PBS) solution and then incubated with primary antibody at 4 \u00b0C overnight and secondary antibody at 37 \u00b0C for 2 h. In between antibody incubations, coverslips were washed 3 times for 5 min in 1x PBS plus 0.1% Triton X-100. Coverslips were then incubated in 10 \u00b5l DAPI (10 \u00b5g/ml) for 5 min, washed and mounted on a slide in 7 \u00b5l Vectashield.',
                'Cells grown on coverslips were fixed in ice-cold methanol at _20 _ C for 10 min. After blocking in 0.2% gelatine from cold-water fish (Sigma) in PBS (PBS/FSG) for 15 min, coverslips were incubated with primary antibodies in blocking solution for 1h. Following washes with 0.2% PBS/FSG, the cells were incubated with a 1:500 dilution of secondary antibodies for 1 h (donkey anti- mouse/rabbit/goat/sheep conjugated to Alexa 488 or Alexa 594; Molecular Probes  or donkey anti-mouse conjugated to DyLight 405, Jackson ImmunoResearch). The cells were counterstained with 1 _g ml_1 Hoechst 33342 (Sigma) to visualize chromatin. After washing with 0.2% PBS/FSG, the coverslips were mounted on glass slides by inverting them into mounting solution (ProLong Gold antifade, Molecular Probes). The samples were allowed to cure for 24-48 h.'
              ]
            }
          }
        ],
        display: 'required',
        helpContextual: {
          description: 'How the sample was grown or cultured and prepared for imaging.'
        }
      },
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Image acquisition',
        fieldTypes: [
          {
            name: 'Title',
            display: 'required',
            valueType: {
              name: 'text'
            },
            helpContextual: {
              description:
                'A short, representative name for this Image acquisition section. You will use it in the Associations table of the Study Components REMBI section.',
              examples: ['Image acquisition 1', 'Image acquisition 2']
            }
          },
          {
            name: 'Imaging instrument',
            valueType: {
              name: 'largetext'
            },
            display: 'required',
            helpContextual: {
              description: 'Description of the instrument used to capture the images.',
              examples: [
                'Zeiss Elyra PS1',
                'Luxendo MuVi SPIM light-sheet microscope',
                'DeltaVision OMX V3 Blaze system (GE Healthcare) equipped with a 60x/1.42 NA PlanApo oil immersion objective (Olympus), pco.edge 5.5 sCMOS cameras (PCO) and 405, 488, 593 and 640 nm lasers'
              ]
            }
          },
          {
            name: 'Image acquisition parameters',
            valueType: {
              name: 'largetext'
            },
            display: 'required',
            helpContextual: {
              description: 'How the images were acquired, including instrument settings/parameters.',
              examples: [
                'Two and three days after surgery, sparse labeling of OPCs was achieved by i.p. injection of Tamoxifen (Tam; 180mg/kg bodyweight). Imaging fields of view containing identified OPCs were selected to obtain 10-20 SPOTs per mouse. Chronic 2-photon imaging was performed starting 3 days after surgery. All SPOTs were checked on a daily basis and no z-stack was acquired if no changes occurred. The imaging was performed on custom-built 2-photon microscope (Sutter Instrument Movable Objective Microscope type) using a long-working distance objective (water immersion, 16x magnification, 0.8NA, Nikon) and equipped with a ytterbium-doped laser system at 1045nm and 200fs (Femtotrain, High-Q lasers) or a fiber oscillator 45 laser at 1070nm (Fidelity-2, Coherent) to excite tdTomato labeled cells in the CC. Emission light was detected using a photomultiplier tube (Hamamatsu) after passing a red emission filter (610/75 nm; AHF).',
                'Embryos were imaged on a Luxendo MuVi SPIM light-sheet microscope, using 30x magnification setting on the Nikon 10x/0.3 water objective. The 488 nm laser was used to image nuclei (His-GFP), and the 561 nm laser was used to image transcriptional dots (MCP-mCherry), both at 5% laser power. Exposure time for the green channel was 55 ms and exposure for the red channel was 70 ms. The line illumination tool was used to improve background levels and was set to 40 pixels.',
                'Spherical aberration was minimized using immersion oil with refractive index (RI) 1.514. 3D image stacks were acquired over the whole nuclear volume in z and with 15 raw images per plane (five phases, three angles). The raw data were computationally reconstructed with SoftWoRx 6.5.2 (GE Healthcare) using channel-specific OTFs recorded using immersion oil with RI 1.512, and Wiener filter settings between 0.002-0.006 to generate 3D stacks of 115 nm (488 nm) or 130 nm (593 nm) lateral and approximately 350 nm axial resolution. Multi-channel acquisitions were aligned in 3D using Chromagnon software (Matsuda et al, 2018) based on 3D-SIM acquisitions of multi-colour EdU-labelled C127 cells(Kraus et al, 2017).'
              ]
            }
          },
          {
            name: 'Imaging method',
            icon: 'fa-tag',
            display: 'required',
            valueType: {
              name: 'select',
              multiple: true,
              values: [
                'ANSOM',
                'CARS',
                'EDAX imaging',
                'EELS imaging',
                'FLIM',
                'FLIP',
                'FRAP',
                'FRET',
                'OCT',
                'SPIM',
                'X-ray computed tomography',
                'X-ray microscopy',
                'X-ray radiography',
                'X-ray tomography',
                'acrylic painted graphic',
                'animation',
                'array-scan confocal microscopy',
                'atomic force microscopy',
                'back-scattered_electron imaging',
                'black and white graphic',
                'bright-field microscopy',
                'camera lucida assisted graphic',
                'charcoal pencil graphic',
                'color graphic',
                'colored pencil graphic',
                'computed tomography',
                'computer graphic',
                'confocal microscopy',
                'dark-field microscopy',
                'diagram',
                'differential interference contrast microscopy',
                'electron microscopy',
                'evanescent wave microscopy',
                'evanescent wave scattering',
                'fluorescence microscopy',
                'fluorescence polarization microscopy',
                'focussed ion beam scanning electron microscopy (FIB-SEM)',
                'free hand graphic',
                'graphic illustration',
                'graphite pencil graphic',
                'grey scale graphic',
                'high-voltage electron microscopy (HVEM)',
                'imaging method',
                'intermediate voltage electron microacopy (IVEM)',
                'light microscopy',
                'line art graphic',
                'macroscopy',
                'microscopy',
                'microscopy with lenses',
                'montage',
                'multi-photon microscopy',
                'nearfield scanning optical microscopy (ANSOM)',
                'oil painted graphic',
                'orientation-independent polarization microscopy',
                'painted graphic',
                'pastel painted graphic',
                'pen and ink graphic',
                'phase contrast microscopy',
                'polarization microscopy',
                'portrayed image',
                'radiography',
                'recorded image',
                'scanning electron microscopy (SEM)',
                'scanning probe microscopy',
                'scanning tunneling microscopy',
                'scanning-transmission electron microscopy',
                'secondary_electron imaging',
                'serial block face SEM (SBFSEM)',
                'single-spot confocal microscopy',
                'slit-scan confocal microscopy',
                'spinning disk confocal microscopy',
                'time lapse microscopy',
                'tomography',
                'transmission electron microscopy (TEM)',
                'two-photon laser scanning microscopy',
                'watercolor painted graphic'
              ]
            },
            helpContextual: {
              description: 'What method was used to capture images.'
            }
          }
        ],
        tableTypes: [],
        display: 'required',
        helpContextual: {}
      },
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Image correlation',
        minRequired: 0,
        display: 'desirable',
        fieldTypes: [
          {
            name: 'Title',
            display: 'required',
            valueType: {
              name: 'text'
            },
            helpContextual: {
              description:
                'A short, representative name for this Image correlation section. You will use it in the Associations table of the Study Components REMBI section.',
              examples: ['Image correlation 1', 'Image correlation 2']
            }
          },
          {
            name: 'Fiducials used',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Features from correlated datasets used for colocalisation'
            }
          },
          {
            name: 'Spatial and temporal alignment',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Method used to correlate images from different modalities',
              examples: ['Manual overlay', 'Alignment algorithm']
            }
          },
          {
            name: 'Transformation matrix',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'Correlation transforms'
            }
          }
        ],
        helpContextual: {
          description: 'How images from the same correlative study are linked'
        }
      },
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Image analysis',
        minRequired: 0,
        display: 'desirable',
        fieldTypes: [
          {
            name: 'Title',
            display: 'required',
            valueType: {
              name: 'text'
            },
            helpContextual: {
              description:
                'A short, representative name for this Image analysis section. You will use it in the Associations table of the Study Components REMBI section.',
              examples: ['Image analysis 1', 'Image analysis 2']
            }
          },
          {
            name: 'Image analysis overview',
            valueType: {
              name: 'largetext'
            },
            display: 'desirable',
            helpContextual: {
              description: 'How image analysis was carried out.',
              examples: [
                'Image segmentation was performed for each 2D slice using a program called ilastik, which utilizes semantic segmentation. 3D object creation from 2D binary images and feature extraction was performed in a program called Arivis.',
                'Each 3D-SIM image contained one nucleus (in a small number of cases multiple nuclei were present, which did not affect the analysis). The image analysis pipeline contained six main steps: bivalent skeleton tracing, trace fluorescence intensity quantification, HEI10 peak detection, HEI10 foci identification, HEI10 foci intensity quantification, and total bivalent intensity quantification. Note that the normalization steps used for foci identification differ from those used for foci intensity quantification; the former was intended to robustly identify foci from noisy traces, whilst the latter was used to carefully quantify foci HEI10 levels.',
                'Images were deconvolved using the default conservative deconvolution method using DeltaVision Softworx software. Image quantification was carried out using Fiji (Schindelin et al, 2012). Deconvolved images were compressed to 2D images displaying the maximum intensity projection for each pixel across z-stacks listed in Table S7 (column \u201cProjected\u201d). Cell and nuclear areas were outlined using thresholding functions on the background TRITC signal and DAPI signal, respectively. Dots corresponding to transcripts were then counted for both nuclear and cytoplasmic areas for each image by applying the \u201cFind Maxima\u201d command with a noise tolerance specified in Table S7 (column \u201cMaxima\u201d). Bar charts show the mean number of dots per nuclear area and cytoplasmic area across all images for all combined replicates.'
              ]
            }
          }
        ],
        helpContextual: {}
      },
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Annotations',
        fieldTypes: [
          {
            name: 'Title',
            valueType: {
              name: 'text'
            },
            display: 'required',
            helpContextual: {
              description: 'A concise label for the metadata in this section.',
              examples: ['Segmentation masks']
            }
          },
          {
            name: 'Annotation Overview',
            valueType: {
              name: 'text'
            },
            display: 'required',
            helpContextual: {
              description: 'Short descriptive summary indicating the type of annotation and how it was generated'
            }
          },
          {
            name: 'Annotation Type',
            display: 'required',
            valueType: {
              name: 'select',
              multiple: true,
              values: [
                'class_labels',
                'bounding_boxes',
                'counts',
                'derived_annotations',
                'geometrical_annotations',
                'graphs',
                'point_annotations',
                'segmentation_mask',
                'tracks',
                'weak_annotations',
                'other'
              ]
            },
            helpContextual: {
              descriptionHtml:
                'With values defined as follows: <br>' +
                '<table border=1 frame="void" rules="columns" cellpadding="5">' +
                '<tr><td>class_labels</td> <td>tags that identify specific features, patterns or classes in images </td></tr>' +
                '<tr><td>bounding_boxes</td> <td>rectangles completely enclosing a structure of interest within an image </td></tr>' +
                '<tr><td>counts</td> <td>number of objects, such as cells, found in an image <br>' +
                '<tr><td>derived_annotations</td> <td>additional analytical data extracted from the images. For example, the image point spread function,the signal to noise ratio, focus information... <br>' +
                '<tr><td>geometrical_annotations</td> <td>polygons and shapes that outline a region of interest in the image. These can be geometrical primitives, 2D polygons, 3D meshes <br>' +
                '<tr><td>graphs</td> <td>graphical representations of the morphology, connectivity, or spatial arrangement of biological structures in an image. Graphs, such as skeletons or connectivity diagrams, typically consist of nodes and edges, where nodes represent individual elements or regions and edges represent the connections or interactions between them <br>' +
                "<tr><td>point_annotations</td> <td>X, Y, and Z coordinates of a point of interest in an image (for example an object's centroid  or landmarks) <br>" +
                '<tr><td>segmentation_mask</td> <td>an image, the same size as the source image, with the value of each pixel representing some biological identity or background region <br>' +
                '<tr><td>tracks</td> <td>annotations marking the movement or trajectory of objects within a sequence of bioimages <br>' +
                '<tr><td>weak_annotations</td> <td>rough imprecise annotations that are fast to generate. These annotations are used, for example,  to detect an object without providing accurate boundaries <br>' +
                '<tr><td>other</td> <td>other types of annotations, please specify in the annotation overview section <br>' +
                '</table>'
            }
          },
          {
            name: 'Annotation Method',
            valueType: {
              name: 'text'
            },
            display: 'required',
            helpContextual: {
              description:
                'Description of how the annotations where created. Including protocols used for consensus and quality assurance, if applicable.',
              examples: [
                'crowdsourced',
                'expertly annotated',
                'produced by CellPose, revision 4f0c43e, with all default parameters'
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
                'more than 95% pixel consensus where multiple annotators independently segmented the same object',
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
              description: 'The proportion of images from the dataset that were annotated.',
              examples: ['All data that satisfied the Annotation Criteria were annotated.']
            }
          },
          {
            name: 'File List',
            icon: 'fa-file',
            valueType: {
              name: 'file',
              allowFolders: false
            },
            display: 'required',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-file-list/',
            asyncValueValidatorName: 'forFileList'
          }
        ],
        tableTypes: [],
        sectionTypes: [],
        display: 'desirable',
        minRequired: 0,
        helpContextual: {}
      },
      {
        displayAnnotations: false,
        tableGroups: [],
        name: 'Study Component',
        fieldTypes: [
          {
            name: 'Name',
            valueType: {
              name: 'text'
            },
            display: 'required',
            helpContextual: {
              description: 'The name of your study component.',
              examples: ['Experiment A', 'Screen B', 'Stitched max-projected fluorescent confocal images']
            }
          },
          {
            name: 'Description',
            valueType: {
              name: 'text'
            },
            display: 'required',
            helpContextual: {
              description: 'An explanation of your study component.'
            }
          },
          {
            name: 'File List',
            icon: 'fa-file',
            valueType: {
              name: 'file',
              allowFolders: false
            },
            display: 'required',
            helpText: 'Examples',
            helpLink: '/bioimage-archive/help-file-list/',
            asyncValueValidatorName: 'forFileList'
          }
        ],
        tableTypes: [
          {
            name: 'Associations',
            icon: 'fa-address-card',
            description: 'Associate parts of the study into a Study Component.',
            uniqueCols: true,
            rowAsSection: true,
            display: 'required',
            columnTypes: [
              {
                dependency: {
                  field_name: 'Title',
                  section_type: 'Biosample',
                  type: 'section'
                },
                display: 'required',
                name: 'Biosample',
                uniqueValues: false,
                valueType: {
                  name: 'select',
                  values: [],
                  enableValueAdd: false
                }
              },
              {
                dependency: {
                  field_name: 'Title',
                  section_type: 'Specimen',
                  type: 'section'
                },
                display: 'required',
                name: 'Specimen',
                uniqueValues: false,
                valueType: {
                  name: 'select',
                  values: [],
                  enableValueAdd: false
                }
              },
              {
                dependency: {
                  field_name: 'Title',
                  section_type: 'Image acquisition',
                  type: 'section'
                },
                display: 'required',
                name: 'Image acquisition',
                uniqueValues: false,
                valueType: {
                  name: 'select',
                  values: [],
                  enableValueAdd: false
                }
              },
              {
                dependency: {
                  field_name: 'Title',
                  section_type: 'Image correlation',
                  type: 'section'
                },
                display: 'desirable',
                name: 'Image correlation',
                uniqueValues: false,
                valueType: {
                  name: 'select',
                  values: [],
                  enableValueAdd: false
                }
              },
              {
                dependency: {
                  field_name: 'Title',
                  section_type: 'Image analysis',
                  type: 'section'
                },
                display: 'desirable',
                name: 'Image analysis',
                uniqueValues: false,
                valueType: {
                  name: 'select',
                  values: [],
                  enableValueAdd: false
                }
              }
            ]
          }
        ],
        display: 'required',
        helpContextual: {}
      }
    ]
  }
};
