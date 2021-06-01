export function pageTabSample1() {
  return {
    'accessTags': [
      'Public'
    ],
    'accno': 'S-EXMP1',
    'attributes': [
      {
        'name': 'RootPath',
        'value': 'IDR'
      },
      {
        'name': 'Title',
        'value': 'A genomic Multiprocess survey of machineries that control and' +
             ' link cell shape, microtubule organization, and cell-cycle progression.'
      },
      {
        'name': 'ReleaseDate',
        'value': '2017-03-03'
      },
      {
        'name': 'AttachTo',
        'value': 'IDR'
      }
    ],
    'section': {
      'subsections': [
        {
          'attributes': [
            {
              'name': 'Name',
              'value': 'Rafael Carazo Salas'
            },
            {
              'name': 'Email',
              'value': 'r.carazo-salas@gen.cam.ac.uk'
            },
            {
              'name': 'Role',
              'value': 'submitter'
            },
            {
              'name': 'affiliation',
              'reference': true,
              'value': 'o1'
            }
          ],
          'type': 'Author'
        },
        {
          'accno': 'o1',
          'attributes': [
            {
              'name': 'Name',
              'value': 'Department of Genetics, University of Cambridge,' +
                  ' Downing Street, Cambridge, Cambs CB2 3EH, United Kingdom'
            }
          ],
          'type': 'Organization'
        },
        {
          'subsections': [
            {
              'accno': 'screenA : growth protocol',
              'attributes': [
                {
                  'name': 'Type',
                  'valqual': [
                    {
                      'name': 'Ontology',
                      'value': 'EFO'
                    },
                    {
                      'name': 'TermId',
                      'value': 'EFO_0003789'
                    }
                  ],
                  'value': 'growth protocol'
                },
                {
                  'name': 'Description',
                  'value': 'KO mutants were grown exponentially for >48 hr and imaged in ' +
                       '96-well micro- plates (lectin-coated glass bottom, 10 mg/well) ' +
                       'containing Cascade Blue Dextran-labeled YES medium (0.1 mg/ml).'
                }
              ],
              'type': 'Protocol'
            },
            {
              'accno': 'screenA : HCS library protocol',
              'attributes': [
                {
                  'name': 'Type',
                  'valqual': [
                    {
                      'name': 'Ontology',
                      'value': 'EFO'
                    },
                    {
                      'name': 'TermId',
                      'value': 'EFO_0007571'
                    }
                  ],
                  'value': 'HCS library protocol'
                },
                {
                  'name': 'Description',
                  'value': 'The Bioneer haploid deletion (knockout, KO) library v.2 ' +
                       '(Bioneer, Korea) was modified to generate a GFP-tubulin ' +
                       'expressing library (Dixon et al., 2008).'
                }
              ],
              'type': 'Protocol'
            },
            {
              'accno': 'screenA : HCS image acquistion and feature extraction protocol',
              'attributes': [
                {
                  'name': 'Type',
                  'valqual': [
                    {
                      'name': 'Ontology',
                      'value': 'EFO'
                    },
                    {
                      'name': 'TermId',
                      'value': 'EFO_0007572'
                    }
                  ],
                  'value': 'HCS image acquistion and feature extraction protocol'
                },
                {
                  'name': 'Description',
                  'value': 'Two-color images were acquired using an automated OperaLX ' +
                       'spinning-disk confocal microscope (Perkin Elmer) with 603 ' +
                       'water-immersion objective (NA 1.2). Six stacks of 16 z planes ' +
                       '0.4 mm separation were collected for each well. The entire ' +
                       'genomic KO library was filmed twice. Customized software was ' +
                       'used for image analysis and feature extraction.'
                }
              ],
              'type': 'Protocol'
            }
          ],
          'accno': 'idr0001-graml-sysgro/screenA',
          'files': [
            {
              'path': 'idr0001-screenA-library.txt',
              'size': 2972377,
              'attributes': [
                {
                  'name': 'Type',
                  'value': 'library file'
                },
                {
                  'name': 'Format',
                  'value': 'tab-delimited text'
                },
                {
                  'name': 'Library type',
                  'value': 'haploid deletion library'
                },
                {
                  'name': 'Manufacturer',
                  'value': 'Bioneer, Korea'
                },
                {
                  'name': 'Version',
                  'value': 'Bioneer haploid deletion library v.2 modified to generate a ' +
                       'GFP-tubulin expressing library (Dixon et al., 2008).' +
                       ' http://eng.bioneer.com/products/YeastGenome/Library-overview.aspx.'
                },
                {
                  'name': 'Experimental conditions',
                  'value': 'none'
                }
              ],
              'type': 'file'
            },
            {
              'path': 'idr0001-screenA-processed.txt',
              'size': 46876,
              'attributes': [
                {
                  'name': 'Type',
                  'value': 'processed data'
                },
                {
                  'name': 'Format',
                  'value': 'tab-delimited text'
                },
                {
                  'name': 'Description',
                  'value': 'This file contains information about the phenotypes observed, ' +
                       'their reproducibility per gene and conservation across species.'
                }
              ],
              'type': 'file'
            }
          ],
          'attributes': [
            {
              'name': 'Description',
              'value': 'Primary screen of fission yeast knock out mutants looking for ' +
                   'genes controlling cell shape, microtubules, and cell-cycle progression. ' +
                   '262 genes controlling specific aspects of those processes are identifed, ' +
                   'validated, and functionally annotated.'
            },
            {
              'name': 'Technology type',
              'value': 'gene deletion screen'
            },
            {
              'name': 'Type',
              'value': 'primary screen'
            },
            {
              'name': 'Screen size',
              'value': 'Plates: 192'
            },
            {
              'name': 'Screen size',
              'value': '5D Images: 109728'
            },
            {
              'name': 'Screen size',
              'value': 'Planes: 3511296'
            },
            {
              'name': 'Screen size',
              'value': 'Average Image Dimension (XYZCT): 1376 x 1040 x 16 x 2 x 1'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'We used two complementary strategies for detecting KO mu- tants with ' +
                       'aberrant cell shape or microtubules (hits; Figures 1B, 1C, and S4). ' +
                       'The first strategy identified mutants with a prominent alteration in a ' +
                       'single feature (p value; Figure 1). The second strat- egy identified ' +
                       'mutants with multiple subtle feature alterations (multiparametric profile scoring, Figure 1)'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000438'
                },
                {
                  'name': 'TermName',
                  'value': 'abnormal microtubule cytoskeleton morphology during mitotic interphase'
                }
              ],
              'value': 'abnormal microtubule cytoskeleton morphology during mitotic interphase'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'We used two complementary strategies for detecting KO mu- tants with ' +
                       'aberrant cell shape or microtubules (hits; Figures 1B, 1C, and S4). ' +
                       'The first strategy identified mutants with a prominent alteration in a ' +
                       'single feature (p value; Figure 1). The second strat- egy identified mutants' +
                       'with multiple subtle feature alterations (multiparametric profile scoring, Figure 1)'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000370'
                },
                {
                  'name': 'TermName',
                  'value': 'elongated cytoplasmic microtubules phenotype'
                }
              ],
              'value': 'long cytoplasmic microtubules'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'We used two complementary strategies for detecting KO mutants with aberrant ' +
                       'cell shape or microtubules (hits; Figures 1B, 1C, and S4). The first strategy' +
                       'identified mutants with a prominent alteration in a single feature (p value; Figure 1). ' +
                       'The second strategy identified mutants with multiple subtle feature alterations ' +
                       '(multiparametric profile scoring, Figure 1)'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000371'
                },
                {
                  'name': 'TermName',
                  'value': 'shortened cytoplasmic microtubules phenotype'
                }
              ],
              'value': 'short cytoplasmic microtubules'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'We used two complementary strategies for detecting KO mu- tants with aberrant cell ' +
                      'shape or microtubules (hits; Figures 1B, 1C, and S4). The first strategy identified ' +
                      'mutants with a prominent alteration in a single feature (p value; Figure 1). ' +
                      'The second strat- egy identified mutants with multiple subtle feature alterations ' +
                      '(multiparametric profile scoring, Figure 1)'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000372'
                },
                {
                  'name': 'TermName',
                  'value': 'increased number of microtubule bundle phenotype'
                }
              ],
              'value': 'microtubule bundles present in greater numbers'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000365'
                },
                {
                  'name': 'TermName',
                  'value': 'curved cell phenotype'
                }
              ],
              'value': 'viable curved vegetative cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000077'
                },
                {
                  'name': 'TermName',
                  'value': 'elongated cell phenotype'
                }
              ],
              'value': 'viable elongated vegetative cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000367'
                },
                {
                  'name': 'TermName',
                  'value': 'stubby cell phenotype'
                }
              ],
              'value': 'viable stubby vegetative cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000116'
                },
                {
                  'name': 'TermName',
                  'value': 'abnormal cell shape phenotype'
                }
              ],
              'value': 'viable vegetative cell with abnormal cell shape'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000364'
                },
                {
                  'name': 'TermName',
                  'value': 'S-shaped cell phenotype'
                }
              ],
              'value': 'S-shaped cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle/pear ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000366'
                },
                {
                  'name': 'TermName',
                  'value': 'pear-shaped cell phenotype'
                }
              ],
              'value': 'viable pear-shaped vegetative cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'Cell shape hit classification was done using eight support vector machine classifiers ' +
                       'trained to recognize eight basic phenotypic classes on an individual cell basis: stubby ' +
                       '(wide), banana (curved), orb (round), kinky (S-shaped), long (elongated), skittle ' +
                       '(with one side wider than the other), and T-shaped (branched).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000118'
                },
                {
                  'name': 'TermName',
                  'value': 'round cell phenotype'
                }
              ],
              'value': 'viable spheroid vegetative cell'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                       'statistics to estimate the typical proportions of wild-type cells in each cell-cycle ' +
                       'stage, scoring as hits KOs where at least two cell-cycle stages were statistically ' +
                       'disproportionate with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000437'
                },
                {
                  'name': 'TermName',
                  'value': 'abnormal mitotic cell cycle phase phenotype'
                }
              ],
              'value': 'abnormal mitotic cell cycle phase'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                       'statistics to estimate the typical proportions of wild-type cells in each cell-cycle ' +
                       'stage, scoring as hits KOs where at least two cell-cycle stages were statistically ' +
                       'disproportionate with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000383'
                },
                {
                  'name': 'TermName',
                  'value': 'more cells with interphase microtubule arrays phenotype'
                }
              ],
              'value': 'IP increased'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                       'statistics to estimate the typical proportions of wild-type cells in each cell-cycle ' +
                       'stage, scoring as hits KOs where at least two cell-cycle stages were statistically ' +
                       'disproportionate with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000388'
                },
                {
                  'name': 'TermName',
                  'value': 'fewer cells with interphase microtubule arrays phenotype'
                }
              ],
              'value': 'IP reduced'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                  'statistics to estimate the typical proportions of wild-type cells in each cell-cycle stage, ' +
                  'scoring as hits KOs where at least two cell-cycle stages were statistically disproportionate ' +
                  'with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000378'
                },
                {
                  'name': 'TermName',
                  'value': 'more cells with metaphase microtubule spindles phenotype'
                }
              ],
              'value': 'SP increased'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                  'statistics to estimate the typical proportions of wild-type cells in each cell-cycle stage, ' +
                  'scoring as hits KOs where at least two cell-cycle stages were statistically disproportionate ' +
                  'with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000387'
                },
                {
                  'name': 'TermName',
                  'value': 'fewer cells with metaphase microtubule spindles phenotype'
                }
              ],
              'value': 'SP reduced'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                  'statistics to estimate the typical proportions of wild-type cells in each cell-cycle stage, ' +
                  'scoring as hits KOs where at least two cell-cycle stages were statistically disproportionate ' +
                  'with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000412'
                },
                {
                  'name': 'TermName',
                  'value': 'more cells with G1 phase microtubule arrays phenotype'
                }
              ],
              'value': 'PAA increased'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                  'statistics to estimate the typical proportions of wild-type cells in each cell-cycle stage, ' +
                  'scoring as hits KOs where at least two cell-cycle stages were statistically disproportionate ' +
                  'with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000410'
                },
                {
                  'name': 'TermName',
                  'value': 'fewer cells with G1 phase microtubule arrays phenotype'
                }
              ],
              'value': 'PAA reduced'
            },
            {
              'name': 'Phenotype',
              'valqual': [
                {
                  'name': 'Description',
                  'value': 'To detect KO mutants (hits) with altered cell-cycle progression, we used bootstrap ' +
                  'statistics to estimate the typical proportions of wild-type cells in each cell-cycle stage, ' +
                  'scoring as hits KOs where at least two cell-cycle stages were statistically disproportionate ' +
                  'with respect to the wild-type (i.e., under- or overrepresented; Figure 1D).'
                },
                {
                  'name': 'Score type',
                  'value': 'automated'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000413'
                },
                {
                  'name': 'TermName',
                  'value': 'more cells with S phase microtubule arrays phenotype'
                },
                {
                  'name': 'Ontology',
                  'value': 'CMPO'
                },
                {
                  'name': 'TermId',
                  'value': 'CMPO_0000412'
                },
                {
                  'name': 'TermName',
                  'value': 'more cells with G1 phase microtubule arrays phenotype'
                }
              ],
              'value': 'IP2 increased'
            }
          ],
          'links': [
            {
              'attributes': [
                {
                  'name': 'Type',
                  'value': 'Raw data'
                },
                {
                  'name': 'Data format',
                  'value': 'Evotec/PerkinElmer Opera Flex'
                },
                {
                  'name': 'Image organization',
                  'value': 'The genome wide screen was repeated twice and then a follow up replicates focussed ' +
                       'on genes which showed possible phentoypes in the first two replicates. 35 x 96 well ' +
                       'plates in the first replicate, 68 in the second and 92 in the third (total 195 plates). ' +
                       'Approximately 6 images taken per well (fields). 3 plates have missing files and could ' +
                       'not be correctly visualized. They have been deleted from the screen in the IDR: ' +
                       'JL_120904_S32B, JL_130305_R1_6 and X_110227_S3) leaving 192 plates.'
                }
              ],
              'url': 'http://idr-demo.openmicroscopy.org/webclient/?show=screen-3'
            }
          ],
          'type': 'Screen'
        }
      ],
      'attributes': [
        {
          'name': 'Title',
          'value': 'A genomic Multiprocess survey of machineries that control and link ' +
               'cell shape, microtubule organization, and cell-cycle progression.'
        },
        {
          'name': 'Description',
          'value': 'Understanding cells as integrated systems requires that we systematically ' +
               'decipher how single genes affect multiple biological processes and how ' +
               'processes are functionally linked. Here, we used multiprocess phenotypic ' +
               'profiling, combining high-resolution 3D confocal microscopy and multiparametric ' +
               'image analysis, to simultaneously survey the fission yeast genome with respect ' +
               'to three key cellular processes: cell shape, microtubule organization, and ' +
               'cell-cycle progression. We identify, validate, and functionally annotate 262 genes ' +
               'controlling specific aspects of those processes. Of these, 62% had not been linked ' +
               'to these processes before and 35% are implicated in multiple processes. ' +
               'Importantly, we identify a conserved role for DNA-damage responses in controlling ' +
               'microtubule stability. In addition, we investigate how the processes are functionally ' +
               'linked. We show unexpectedly that disruption of cell-cycle progression does not ' +
               'necessarily affect cell size control and that distinct aspects of cell shape regulate ' +
               'microtubules and vice versa, identifying important systems-level links across these processes.'
        },
        {
          'name': 'Study type',
          'valqual': [
            {
              'name': 'Ontology',
              'value': 'EFO'
            },
            {
              'name': 'TermId',
              'value': 'EFO_0007550'
            }
          ],
          'value': 'high content screen'
        },
        {
          'name': 'Number of screens',
          'value': '1'
        }
      ],
      'links': [
        {
          'attributes': [
            {
              'name': 'Type',
              'value': 'External link'
            }
          ],
          'url': 'www.sysgro.org'
        }
      ],
      'type': 'Study'
    },
    'type': 'submission'
  };
}
