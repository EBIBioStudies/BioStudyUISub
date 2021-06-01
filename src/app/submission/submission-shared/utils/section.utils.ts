import { compose } from 'app/utils';
import { partition } from 'app/utils/array.utils';
import { isValueEmpty } from 'app/utils/string.utils';
import { SectionNames, AttributeNames } from './../../utils/constants';
import { ExtSectionType } from '../model/ext-submission-types';
import { Table } from '../model/submission/submission.model';
import { Organisations } from '../resources/organisation';
import { Protocols } from '../resources/protocol';
import { tableToSections } from './table.utils';

export function tableSectionsToSections(tables: Table[], isSanitise: boolean, isSubsection: boolean): ExtSectionType[] {
  let tableSections: ExtSectionType[] = [];
  tables.forEach((table) => {
    tableSections = [
      ...tableSections,
      ...tableToSections<ExtSectionType>(
        (attrs, currentTable) => ({
          type: currentTable?.typeName || '',
          attributes: attrs.filter((attr) => !isValueEmpty(attr.value))
        }),
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

function contactsToSection(sections: ExtSectionType[]): ExtSectionType[] {
  const orgs: Organisations = Organisations.getInstance();
  const [contacts, sectionsWithoutContacts] = partition<ExtSectionType>(sections, (section) =>
    [SectionNames.CONTACT.toLowerCase()].includes(section.type.toLowerCase() as SectionNames)
  );
  const authors: ExtSectionType[] = contacts.map((contact) => ({
    type: SectionNames.AUTHOR,
    attributes: orgs.orgToReferences(contact).filter((ref) => !isValueEmpty(ref.value))
  }));
  const affiliations: ExtSectionType[] = orgs.list().map((org) => ({
    type: SectionNames.ORGANISATION,
    accno: org.accno,
    attributes: [{ name: AttributeNames.NAME, value: org.name }]
  }));

  return [...authors, ...affiliations, ...sectionsWithoutContacts];
}

function protocolsToSection(sections: ExtSectionType[]): ExtSectionType[] {
  const protocols: Protocols = Protocols.getInstance();
  const [componentProtocols, sectionsWithoutProtocols] = partition<ExtSectionType>(
    sections,
    (section) => section.type.toLowerCase() === SectionNames.PROTOCOLS.toLowerCase()
  );
  const [studyProtocols, otherSections] = partition<ExtSectionType>(
    sectionsWithoutProtocols,
    (section) => section.type.toLowerCase() === SectionNames.STUDY_PROTOCOLS.toLowerCase()
  );

  const componentProtocolReferences = componentProtocols.map((componentProtocol) => ({
    type: componentProtocol.type,
    attributes: componentProtocol.attributes!.map((attribute) => protocols.toReference({ ...attribute }))
  }));

  const studyProtocolToReference = studyProtocols.map((studyProtocol, index) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === AttributeNames.NAME) || { value: '' };
    const studyProtocolNameValue: string = nameAttribute.value as string;

    return {
      type: studyProtocol.type,
      accno: studyProtocol.accNo ? studyProtocol.accNo : protocols.refFor(studyProtocolNameValue, `p${index}`),
      attributes: studyProtocol.attributes
    };
  });

  return [...componentProtocolReferences, ...studyProtocolToReference, ...otherSections];
}
