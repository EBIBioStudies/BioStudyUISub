import { PageTab, PtAttribute } from '../model/pagetab';

export function findAttribute(pageTab: PageTab, attributeName: string): PtAttribute[] {
  const ptAttributes: PtAttribute[] = pageTab.attributes || [];
  const attrMatchingName: PtAttribute[] = ptAttributes.filter((attribute) => attribute.name === attributeName);
  const attrWithValidValue: PtAttribute[] = attrMatchingName.filter((attribute) => String.isDefinedAndNotEmpty(attribute.value));

  return attrWithValidValue;
}
