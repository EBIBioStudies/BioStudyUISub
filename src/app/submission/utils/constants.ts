export const SectionNames = {
  AFFILIATION: 'affiliation',
  ANNOTATION: 'Annotation',
  AUTHOR: 'author',
  CONTACT: 'Contact',
  FILE: 'file',
  KEYWORDS: 'Keywords',
  LINK: 'link',
  ORGANISATION: 'organisation',
  ORGANIZATION: 'organization',
  PROTOCOLS: 'protocols',
  PUBLICATION: 'Publication',
  SECTION: 'section',
  STUDY: 'Study',
  STUDY_PROTOCOLS: 'study protocols'
};

export const AttributeNames = {
  ATTACH_TO: 'AttachTo',
  DESCRIPTION: 'Description',
  EMAIL: 'E-mail',
  FILE_LIST: 'FileList',
  KEYWORD: 'Keyword',
  NAME: 'Name',
  ORGANISATION: 'Organisation',
  PROTOCOL: 'Protocol',
  RELEASE_DATE: 'ReleaseDate',
  TITLE: 'Title'
};

export const SectionTypes = {
  SECTION: 'section',
  STUDY: 'study',
  LINK: 'link',
  FILE: 'file'
};

export const LowerCaseSectionNames = Object.keys(SectionNames).reduce(
  (result, sectionNameKey) => ({
    [sectionNameKey]: SectionNames[sectionNameKey].toLowerCase(),
    ...result
  }),
  {} as typeof SectionNames
);
