import { ExtSection } from '../../app/submission/submission-transform/model/ext-submission-types';

export const extRootProtocol: ExtSection = {
  accNo: 'p0',
  type: 'Study Protocols',
  fileList: null,
  attributes: [
    {
      name: 'Name',
      value: 'P1',
      reference: false
    },
    {
      name: 'Type',
      value: 'data Analysis Protocol',
      reference: false
    }
  ],
  sections: [],
  files: [],
  links: [],
  extType: 'section'
};

export const extRefProtocol: ExtSection = {
  type: 'Protocols',
  fileList: null,
  attributes: [
    {
      name: 'Protocol',
      value: extRootProtocol.accNo as string,
      reference: true
    }
  ],
  sections: [],
  files: [],
  links: [],
  extType: 'section'
};
