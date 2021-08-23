import { titleAttribute, descriptionAttribute, organismAttribute, keywordAttribute } from './attributes';
import { ExtSection } from '../../app/submission/submission-transform/model/ext-submission-types';
import { extFile } from './file';
import { extAuthor } from './author';
import { extOrganisation } from './organisation';
import { extPublication } from './publication';
import { extLink } from './link';
import { extRefProtocol, extRootProtocol } from './protocol';

export const extSubsection: ExtSection = {
  accNo: 'Study Component-1',
  type: 'Study Component',
  fileList: {
    fileName: 'filelist-test',
    filesUrl: ''
  },
  attributes: [descriptionAttribute, titleAttribute, organismAttribute],
  sections: [extRefProtocol, extPublication],
  files: [],
  links: [],
  extType: 'section'
};

export const extRootSection: ExtSection = {
  accNo: '',
  type: 'Study',
  fileList: null,
  attributes: [titleAttribute, descriptionAttribute, organismAttribute, keywordAttribute],
  sections: [extAuthor, extOrganisation, extRootProtocol, extPublication, extSubsection],
  files: [extFile],
  links: [extLink],
  extType: 'section'
};
