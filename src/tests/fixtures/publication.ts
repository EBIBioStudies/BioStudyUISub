import { ExtSection } from '../../app/submission/submission-transform/model/ext-submission-types';

export const extPublication: ExtSection = {
  accNo: null,
  type: 'Publication',
  fileList: null,
  attributes: [
    {
      name: 'PMID',
      value: '1',
      reference: false
    },
    {
      name: 'Authors',
      value: 'Makar AB, McMartin KE, Palese M, Tephly TR.',
      reference: false
    },
    {
      name: 'Title',
      value: 'Formate assay in body fluids: application in methanol poisoning.',
      reference: false
    },
    {
      name: 'Year',
      value: '1975',
      reference: false
    },
    {
      name: 'Volume',
      value: '13',
      reference: false
    },
    {
      name: 'Issue',
      value: '2',
      reference: false
    }
  ],
  sections: [],
  files: [],
  links: [],
  extType: 'section'
};
