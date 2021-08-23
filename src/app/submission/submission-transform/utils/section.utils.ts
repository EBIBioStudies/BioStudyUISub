import { compose } from 'app/utils';
import { partition } from 'app/utils/array.utils';
import { isValueEmpty } from 'app/utils/string.utils';
import { SectionNames, AttributeNames, SectionTypes } from './../../utils/constants';
import { Organisations } from '../shared/organisation';
import { Protocols } from '../shared/protocol';
import { tableToSections } from './table.utils';
import { Table } from 'app/submission/submission-shared/model';
import { ExtSection } from '../model/ext-submission-types';

export function tableSectionsToSections(tables: Table[], isSanitise: boolean, isSubsection: boolean): ExtSection[] {
  let tableSections: ExtSection[] = [];
  tables.forEach((table) => {
    tableSections = [
      ...tableSections,
      ...tableToSections<ExtSection>(
        (attrs, currentTable) => [
          {
            accNo: null,
            type: currentTable?.typeName || '',
            attributes: attrs.filter((attr) => !isValueEmpty(attr.value)),
            extType: SectionTypes.SECTION,
            fileList: null,
            files: [],
            links: [],
            sections: []
          }
        ],
        (currentSection) => currentSection.attributes.length > 0,
        isSanitise,
        table
      )
    ];
  });

  if (isSubsection) {
    return protocolsToSection(tableSections);
  }

  return compose(contactsToSection, protocolsToSection)(tableSections);
}

function contactsToSection(sections: ExtSection[]): ExtSection[] {
  const orgs: Organisations = Organisations.getInstance();
  const [contacts, sectionsWithoutContacts] = partition<ExtSection>(sections, (section) =>
    [SectionNames.CONTACT.toLowerCase()].includes(section.type.toLowerCase())
  );
  const authors: ExtSection[] = contacts.map((contact) => ({
    attributes: orgs.orgToReferences(contact).filter((ref) => !isValueEmpty(ref.value)),
    extType: SectionTypes.SECTION,
    fileList: null,
    files: [],
    links: [],
    sections: [],
    type: SectionNames.AUTHOR
  }));
  const affiliations: ExtSection[] = orgs.list().map((org) => ({
    accNo: org.accno,
    attributes: [{ name: AttributeNames.NAME, value: org.name }],
    extType: SectionTypes.SECTION,
    fileList: null,
    files: [],
    links: [],
    sections: [],
    type: SectionNames.ORGANISATION
  }));

  return [...authors, ...affiliations, ...sectionsWithoutContacts];
}

function protocolsToSection(sections: ExtSection[]): ExtSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const [componentProtocols, sectionsWithoutProtocols] = partition<ExtSection>(
    sections,
    (section) => section.type.toLowerCase() === SectionNames.PROTOCOLS.toLowerCase()
  );
  const [studyProtocols, otherSections] = partition<ExtSection>(
    sectionsWithoutProtocols,
    (section) => section.type.toLowerCase() === SectionNames.STUDY_PROTOCOLS.toLowerCase()
  );

  const componentProtocolReferences = componentProtocols.map((componentProtocol) => ({
    type: componentProtocol.type,
    attributes: componentProtocol.attributes!.map((attribute) => protocols.toReference({ ...attribute })),
    extType: SectionTypes.SECTION,
    fileList: null,
    files: [],
    links: [],
    sections: []
  }));

  const studyProtocolToReference = studyProtocols.map((studyProtocol, index) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === AttributeNames.NAME) || { value: '' };
    const studyProtocolNameValue: string = nameAttribute.value as string;

    return {
      type: studyProtocol.type,
      accNo: studyProtocol.accNo ? studyProtocol.accNo : protocols.refFor(studyProtocolNameValue, `p${index}`),
      attributes: studyProtocol.attributes,
      extType: SectionTypes.SECTION,
      fileList: null,
      files: [],
      links: [],
      sections: []
    };
  });

  return [...componentProtocolReferences, ...studyProtocolToReference, ...otherSections];
}
