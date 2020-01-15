import { PageTabSection, PtAttribute } from './pagetab.model';

const isEqualTo = (value: string) => (s: Nullable<string>) => (String.isDefined(s) && s!.toLowerCase() === value);
const isComponentProtocol = isEqualTo('protocols');
const isStudyProtocol = isEqualTo('study protocols');

class Protocols {
  private static instance: Protocols;
  private refs: Dictionary<string> = {};

  private constructor() { }

  static getInstance() {
    if (!Protocols.instance) {
      Protocols.instance = new Protocols();
    }

    return Protocols.instance;
  }

  getRefKeyByValue(value?: string): string {
    return Object.keys(this.refs).find((key) => this.refs[key] === value) || '';
  }

  getRefValueByKey(accno?: string): string {
    if (!accno) {
      return '';
    }

    return this.refs[accno] || '';
  }

  refFor(value: string, accno: string): string {
    this.refs[accno] = value;

    return accno;
  }

  toReference(attr: PtAttribute): PtAttribute {
    if (String.isNotDefinedOrEmpty(attr.value) || attr.name !== 'Protocol') {
      return <PtAttribute>{ name: attr.name, value: attr.value };
    }

    const refKeyForValue = this.getRefKeyByValue(attr.value);
    return <PtAttribute>{
      name: 'Protocol',
      value: refKeyForValue,
      isReference: true
    };
  }
}

export function submissionToPageTabProtocols(pageTabSections: PageTabSection[]): PageTabSection[] {
  const protocols: Protocols = Protocols.getInstance();
  const componentProtocols: PageTabSection[] = pageTabSections.filter((section) => isComponentProtocol(section.type));
  const studyProtocols: PageTabSection[] = pageTabSections.filter((section) => isStudyProtocol(section.type));

  const componentProtocolWithReference = componentProtocols.map((componentProtocol) => (
    <PageTabSection>{
      type: componentProtocol.type,
      attributes: componentProtocol.attributes!.map((attribute) => {
        return protocols.toReference({ ...attribute });
      })
    }
  ));

  const studyProtocolToReference = studyProtocols.map((studyProtocol, index) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === 'Name') || {};
    const studyProtocolNameValue: string = nameAttribute.value || '';

    return (
      <PageTabSection>{
        type: studyProtocol.type,
        accno: studyProtocol.accno ? studyProtocol.accno : protocols.refFor(studyProtocolNameValue, `p${index}`),
        attributes: studyProtocol.attributes
      }
    );
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
    const studyProtocolNameValue: string = nameAttribute.value || '';
    const studyProtocolAccno: string = studyProtocol.accno || '';

    protocols.refFor(studyProtocolNameValue, studyProtocolAccno);
  });

  const componentProtocolsWithReferenceValue = componentProtocols.map((componentProtocol) => {
    const attributes = componentProtocol.attributes || [];
    const protocolAttribute = attributes!.find((attribute) => attribute.name === 'Protocol') || {};
    const finalAttributes = attributes!.filter((attribute) => attribute.name !== 'Protocol') || [];

    if (protocolAttribute) {
      finalAttributes.push(<PtAttribute>{
        name: 'Protocol',
        value: protocols.getRefValueByKey(protocolAttribute.value)
      });
    }

    return (
      <PageTabSection>{
        ...componentProtocol,
        attributes: finalAttributes
      }
    );
  });

  return pageTabSections
    .filter((section) => !isComponentProtocol(section.type))
    .concat(componentProtocolsWithReferenceValue);
}
