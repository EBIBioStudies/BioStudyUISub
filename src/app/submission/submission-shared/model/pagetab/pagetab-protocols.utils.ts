import { PageTabSection, PtAttribute } from './pagetab.model';
import { Feature } from '../submission';

const isEqualTo = (value: string) => {
  return (s: Nullable<string>) => (String.isDefined(s) && s!.toLowerCase() === value);
};

class Protocols {
  private refs: Dictionary<string> = {};
  private names: Dictionary<string> = {};

  refFor(value: string): string {
    const key = value.trim().toLowerCase();
    this.refs[key] = `p${Object.keys(this.refs).length + 1}`;
    this.names[key] = this.names[key] || value;

    return this.refs[key]!;
  }

  toReference(attr: PtAttribute): PtAttribute {
    if (String.isNotDefinedOrEmpty(attr.value)) {
        return <PtAttribute>{ name: 'protocol', value: attr.value };
    }

    const protocolReference = this.refFor(attr.value!);
    return <PtAttribute>{ name: 'protocol', value: protocolReference, isReference: true };
  }

  list(): { accno: string, name: string }[] {
      return Object.keys(this.refs).map(key => ({
        accno: this.refs[key]!,
        name: this.names[key]!
      }));
  }
}

export function buildProtocolReferences(pageTabSections: PageTabSection[]) {
  const protocols: Protocols = new Protocols();
  const isComponentProtocol = isEqualTo('protocols');
  const isStudyProtocol = isEqualTo('study protocols');
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

  const studyProtocolToReference = studyProtocols.map((studyProtocol) => {
    const attributes = studyProtocol.attributes;
    const nameAttribute = attributes!.find((attribute) => attribute.name === 'Name') || {};
    const studyProtocolName: string = nameAttribute.value || '';

    return (
      <PageTabSection>{
        type: studyProtocol.type,
        accno: protocols.refFor(studyProtocolName),
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
