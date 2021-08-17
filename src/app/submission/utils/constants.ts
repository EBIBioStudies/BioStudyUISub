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
  SECTION: 'section',
  STUDY: 'Study',
  STUDY_PROTOCOLS: 'study protocols'
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

export const AttributeNames = {
  ATTACH_TO: 'AttachTo',
  RELEASE_DATE: 'ReleaseDate',
  TITLE: 'Title',
  NAME: 'Name',
  PROTOCOL: 'Protocol',
  FILE_LIST: 'FileList'
};
