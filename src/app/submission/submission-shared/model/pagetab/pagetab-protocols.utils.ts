import { PageTabSection, PtAttribute } from './pagetab.model';

import { Nullable } from '../submission-common-types';
import { Protocols } from '../protocols';
import { isStringDefined } from 'app/utils/validation.utils';

const isEqualTo = (value: string) => (s: Nullable<string>) => isStringDefined(s) && s!.toLowerCase() === value;
const isComponentProtocol = isEqualTo('protocols');
const isStudyProtocol = isEqualTo('study protocols');

export function pageTabToSubmissionProtocols(pageTabSections: PageTabSection[]): PageTabSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const studyProtocols: PageTabSection[] = pageTabSections.filter((section) => isStudyProtocol(section.type));
  const componentProtocols: PageTabSection[] = pageTabSections.filter((section) => isComponentProtocol(section.type));

  // Creates the reference for each study protocol on first load.
  studyProtocols.forEach((studyProtocol) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === 'Name') || {};
    const studyProtocolNameValue: string = (nameAttribute.value as string) || '';
    const studyProtocolAccno: string = studyProtocol.accno || studyProtocolNameValue;

    protocols.refFor(studyProtocolNameValue, studyProtocolAccno);
  });

  const componentProtocolsWithReferenceValue = componentProtocols.map((componentProtocol) => {
    const attributes = componentProtocol.attributes || [];
    const protocolAttribute = attributes!.find((attribute) => attribute.name === 'Protocol') || {};
    const finalAttributes = attributes!.filter((attribute) => attribute.name !== 'Protocol') || [];
    const protocolAttributeValue = protocolAttribute.value as string;

    if (protocolAttribute) {
      finalAttributes.push({
        name: 'Protocol',
        value: protocols.getRefValueByKey(protocolAttributeValue),
        reference: true
      } as PtAttribute);
    }

    return {
      ...componentProtocol,
      attributes: finalAttributes
    } as PageTabSection;
  });

  return pageTabSections
    .filter((section) => !isComponentProtocol(section.type))
    .concat(componentProtocolsWithReferenceValue);
}
