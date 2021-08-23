import { ExtSection } from './../../app/submission/submission-transform/model/ext-submission-types';
import { extOrganisation } from './organisation';

export const extAuthor: ExtSection = {
  type: 'author',
  fileList: null,
  attributes: [
    {
      name: 'Name',
      value: 'Nestor',
      reference: false
    },
    {
      name: 'E-mail',
      value: 'ndiaz+1@ebi.ac.uk',
      reference: false
    },
    {
      name: 'affiliation',
      value: extOrganisation.accNo as string,
      reference: true
    }
  ],
  sections: [],
  files: [],
  links: [],
  extType: 'section'
};
