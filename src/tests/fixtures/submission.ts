import { ExtSubmission } from './../../app/submission/submission-transform/model/ext-submission-types';
import { extRootSection } from './section';

export const extSubmission: ExtSubmission = {
  accNo: 'S-TEST1',
  owner: 'ndiaz+1@ebi.ac.uk',
  submitter: 'ndiaz+1@ebi.ac.uk',
  title: 'Test Study Title',
  method: 'PAGE_TAB',
  relPath: '',
  rootPath: null,
  released: false,
  secretKey: '',
  status: 'REQUESTED',
  releaseTime: '2021-08-31T00:00:00Z',
  modificationTime: '2021-08-17T14:27:49.234Z',
  creationTime: '2021-08-17T14:27:49.234Z',
  section: extRootSection,
  attributes: [],
  collections: [{ accNo: 'TestTemplate' }]
};
