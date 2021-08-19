import { TableData, TableType } from 'app/submission/submission-shared/model';
import { Dictionary } from 'app/submission/submission-shared/model/submission-common-types';
import { compose, isStringDefined, partition } from '../../../utils';
import { AttributeNames, SectionNames } from './../../utils/constants';
import { extAttrToAttrData } from './ext-attribute-to-attribute.utils';
import { findAttributeByName } from '../utils/attribute.utils';
import { ExtSection } from '../model/ext-submission-types';
import { Organisations } from '../shared/organisation';
import { Protocols } from '../shared/protocol';

export function extSectionsToTables(
  sections: ExtSection[],
  tableTypes: TableType[],
  isSubsection: boolean
): TableData[] {
  const sectionsWithAttributes = sections.filter((section) => section.attributes.length > 0);
  let tableSections: ExtSection[] = [];
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

export function extSectionsToContacts(sections: ExtSection[] = []): ExtSection[] {
  const orgs: Organisations = Organisations.getInstance();
  const [rawAffiliations, sectionsWithoutAffiliation] = partition<ExtSection>(sections, (section) =>
    [SectionNames.ORGANIZATION, SectionNames.ORGANISATION, SectionNames.AFFILIATION].includes(
      section.type.toLowerCase()
    )
  );
  const [authors, otherSections] = partition<ExtSection>(
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

export function extSectionsToProtocols(sections: ExtSection[] = []): ExtSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const [studyProtocols, sectionsWithoutProtocols] = partition<ExtSection>(
    sections,
    (section) => SectionNames.STUDY_PROTOCOLS === section.type.toLowerCase()
  );
  const [componentProtocols, sectionsWithoutCompProtocols] = partition<ExtSection>(
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
    } as ExtSection;
  });

  return [...componentProtocolsWithReferenceValue, ...studyProtocols, ...sectionsWithoutCompProtocols];
}
