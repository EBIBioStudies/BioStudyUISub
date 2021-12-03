import { AttributeNames, SectionNames } from './../../utils/constants';

import { Organisations } from '../model/organisations';
import { PageTabSection } from './../model/pagetab/pagetab.model';
import { Protocols } from '../model/protocols';
import { isValueEmpty } from 'app/utils/validation.utils';
import { partition } from 'app/utils/array.utils';

export function contactsToSection(sections: PageTabSection[]): PageTabSection[] {
  const orgs: Organisations = Organisations.getInstance();
  const [contacts, sectionsWithoutContacts] = partition<PageTabSection>(sections, (section) =>
    [SectionNames.CONTACT.toLowerCase()].includes(section!.type!.toLowerCase())
  );
  const authors: PageTabSection[] = contacts.map((contact) => ({
    attributes: orgs.orgToReferences(contact).filter((ref) => !isValueEmpty(ref.value)),
    type: SectionNames.AUTHOR
  }));
  const affiliations: PageTabSection[] = orgs.list().map((org) => ({
    accno: org.accno,
    attributes: [{ name: AttributeNames.NAME, value: org.name }],
    type: SectionNames.ORGANISATION
  }));

  return [...authors, ...affiliations, ...sectionsWithoutContacts];
}

export function protocolsToSection(sections: PageTabSection[]): PageTabSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const [componentProtocols, sectionsWithoutProtocols] = partition<PageTabSection>(
    sections,
    (section) => section!.type!.toLowerCase() === SectionNames.PROTOCOLS.toLowerCase()
  );
  const [studyProtocols, otherSections] = partition<PageTabSection>(
    sectionsWithoutProtocols,
    (section) => section!.type!.toLowerCase() === SectionNames.STUDY_PROTOCOLS.toLowerCase()
  );

  const componentProtocol = componentProtocols.map((componentProtocolItem) => ({
    type: componentProtocolItem.type,
    attributes: componentProtocolItem.attributes!.map((attribute) => protocols.toReference({ ...attribute }))
  }));

  const studyProtocol = studyProtocols.map((studyProtocolItem, index) => {
    const attributes = studyProtocolItem.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === AttributeNames.NAME) || { value: '' };
    const studyProtocolNameValue: string = nameAttribute.value as string;

    return {
      type: studyProtocolItem.type,
      accno: studyProtocolItem.accno ? studyProtocolItem.accno : protocols.refFor(studyProtocolNameValue, `p${index}`),
      attributes: studyProtocolItem.attributes
    };
  });

  return [...componentProtocol, ...studyProtocol, ...otherSections];
}
