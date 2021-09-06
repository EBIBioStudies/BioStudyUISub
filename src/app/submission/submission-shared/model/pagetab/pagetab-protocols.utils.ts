import { PageTabSection, PtAttribute } from './pagetab.model';
import { isStringDefined } from 'app/utils/validation.utils';
import { Nullable } from '../submission-common-types';
import { Protocols } from '../protocols';

const isEqualTo = (value: string) => (s: Nullable<string>) => isStringDefined(s) && s!.toLowerCase() === value;
const isComponentProtocol = isEqualTo('protocols');
const isStudyProtocol = isEqualTo('study protocols');

export function submissionToPageTabProtocols(pageTabSections: PageTabSection[]): PageTabSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const componentProtocols: PageTabSection[] = pageTabSections.filter((section) => isComponentProtocol(section.type));
  const studyProtocols: PageTabSection[] = pageTabSections.filter((section) => isStudyProtocol(section.type));

  const componentProtocolWithReference = componentProtocols.map(
    (componentProtocol) =>
      ({
        type: componentProtocol.type,
        attributes: componentProtocol.attributes!.map((attribute) => {
          return protocols.toReference({ ...attribute });
        })
      } as PageTabSection)
  );

  const studyProtocolToReference = studyProtocols.map((studyProtocol, index) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === 'Name') || {};
    const studyProtocolNameValue: string = (nameAttribute.value as string) || '';

    return {
      type: studyProtocol.type,
      accno: studyProtocol.accno ? studyProtocol.accno : protocols.refFor(studyProtocolNameValue, `p${index}`),
      attributes: studyProtocol.attributes
    } as PageTabSection;
  });

  return pageTabSections
    .filter((section) => !isComponentProtocol(section.type))
    .filter((section) => !isStudyProtocol(section.type))
    .concat(studyProtocolToReference)
    .concat(componentProtocolWithReference);
}

export function pageTabToSubmissionProtocols(pageTabSections: PageTabSection[]): PageTabSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const studyProtocols: PageTabSection[] = pageTabSections.filter((section) => isStudyProtocol(section.type));
  const componentProtocols: PageTabSection[] = pageTabSections.filter((section) => isComponentProtocol(section.type));

  // Creates the reference for each study protocol on first load.
  studyProtocols.forEach((studyProtocol) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === 'Name') || {};
    const studyProtocolNameValue: string = (nameAttribute.value as string) || '';
    const studyProtocolAccno: string = studyProtocol.accno || '';

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
        value: protocols.getRefValueByKey(protocolAttributeValue)
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
