import { Section, Feature, Features } from '../submission';
import { flatFeatures } from 'app/submission/utils';
import { PageTabSection, PtAttribute } from './pagetab.model';

const isEqualTo = (value: string) => {
  return (s: Nullable<string>) => (String.isDefined(s) && s!.toLowerCase() === value);
};

class Protocols {
  private refs: Dictionary<string> = {};
  private names: Dictionary<string> = {};

  private refFor(value: string): string {
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
  const isProtocol = isEqualTo('protocols');
  const protocolSections: PageTabSection[] = pageTabSections.filter((section) => isProtocol(section.type));

  const protocolReferences = protocolSections.map((protocolSection) => (
    <PageTabSection>{
      type: protocolSection.type,
      attributes: protocolSection.attributes!.map((attribute) => {
        return protocols.toReference({ ...attribute });
      })
    }
  ));

  return pageTabSections
    .filter((section) => !isProtocol(section.type))
    .concat(protocolReferences);
}
