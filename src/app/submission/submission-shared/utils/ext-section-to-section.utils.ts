import { TableData } from './../model/submission/submission.model';
import { TableType } from './../model/templates/submission-type.model';
import { Protocols } from './../resources/protocol';
import { compose, isStringDefined, partition } from '../../../utils';
import { Dictionary } from './../model/pagetab/pagetab-authors.utils';
import { Organisations } from './../resources/organisation';
import { ExtSectionType } from '../../../submission/submission-shared/model/ext-submission-types';
import { AttributeNames, SectionNames } from './../../utils/constants';
import { findAttributeByName } from './attribute.utils';
import { extAttrToAttrData } from './ext-attribute-to-attribute.utils';

export function extSectionsToTables(
  sections: ExtSectionType[],
  tableTypes: TableType[],
  isSubsection: boolean
): TableData[] {
  const sectionsWithAttributes = sections.filter((section) => section.attributes.length > 0);
  let tableSections: ExtSectionType[] = [];
  if (isSubsection) {
    tableSections = extSectionsToProtocols(sectionsWithAttributes);
  } else {
    tableSections = compose(extSectionsToContacts, extSectionsToProtocols)(sectionsWithAttributes);
  }

  return tableSections.map((tableSection) => {
    const tableType = tableTypes.find((tType) => tType.name === tableSection.type);
    const tableFieldTypes = tableType ? tableType.columnValueTypes : [];

    return {
      type: tableSection.type,
      entries: [extAttrToAttrData(tableSection.attributes || [], tableFieldTypes)]
    };
  });
}

export function extSectionsToContacts(sections: ExtSectionType[] = []): ExtSectionType[] {
  const orgs: Organisations = Organisations.getInstance();
  const [rawAffiliations, sectionsWithoutAffiliation] = partition<ExtSectionType>(sections, (section) =>
    [SectionNames.ORGANIZATION, SectionNames.ORGANISATION, SectionNames.AFFILIATION].includes(
      section.type.toLowerCase()
    )
  );
  const [authors, otherSections] = partition<ExtSectionType>(
    sectionsWithoutAffiliation,
    (section) => SectionNames.AUTHOR === section.type.toLowerCase()
  );
  const affiliations: Dictionary<string> = rawAffiliations
    .filter((s) => isStringDefined(s.accNo))
    .reduce((result, { attributes, accNo }) => {
      if (attributes) {
        const nameAttribute = findAttributeByName(AttributeNames.NAME, attributes) || { value: null };

        result[accNo!] = nameAttribute.value as string;
      }

      return result;
    }, {} as Dictionary<string>);

  const contacts = authors.map((author) => ({
    type: SectionNames.CONTACT,
    attributes: orgs.referencesToOrg(author, affiliations)
  }));

  return [...contacts, ...otherSections];
}

export function extSectionsToProtocols(sections: ExtSectionType[] = []): ExtSectionType[] {
  const protocols: Protocols = Protocols.getInstance();
  const [studyProtocols, sectionsWithoutProtocols] = partition<ExtSectionType>(
    sections,
    (section) => SectionNames.STUDY_PROTOCOLS === section.type.toLowerCase()
  );
  const [componentProtocols, sectionsWithoutCompProtocols] = partition<ExtSectionType>(
    sectionsWithoutProtocols,
    (section) => SectionNames.PROTOCOLS === section.type.toLowerCase()
  );

  // Creates the reference for each study protocol on first load.
  studyProtocols.forEach((studyProtocol) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = findAttributeByName(AttributeNames.NAME, attributes) || { value: '' };
    const studyProtocolNameValue: string = nameAttribute.value as string;
    const studyProtocolAccno: string = studyProtocol.accNo || '';

    protocols.refFor(studyProtocolNameValue, studyProtocolAccno);
  });

  const componentProtocolsWithReferenceValue = componentProtocols.map((componentProtocol) => {
    const attributes = componentProtocol.attributes || [];
    const protocolAttribute = attributes!.find((attribute) => attribute.name === AttributeNames.PROTOCOL) || {
      value: ''
    };
    const finalAttributes = attributes!.filter((attribute) => attribute.name !== AttributeNames.PROTOCOL) || [];
    const protocolAttributeValue = protocolAttribute.value as string;

    if (protocolAttribute) {
      finalAttributes.push({
        name: AttributeNames.PROTOCOL,
        value: protocols.getRefValueByKey(protocolAttributeValue)
      });
    }

    return {
      ...componentProtocol,
      attributes: finalAttributes
    } as ExtSectionType;
  });

  return [...componentProtocolsWithReferenceValue, ...studyProtocols, ...sectionsWithoutCompProtocols];
}
