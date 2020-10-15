import { PageTab, PtAttribute } from '../model/pagetab';
import { isDefinedAndNotEmpty } from 'app/utils';

export function findAttribute(pageTab: PageTab, attributeName: string): PtAttribute[] {
  const ptAttributes: PtAttribute[] = pageTab.attributes || [];
  const attrMatchingName: PtAttribute[] = ptAttributes.filter((attribute) => attribute.name === attributeName);
  const attrWithValidValue: PtAttribute[] = attrMatchingName.filter((attribute) => isDefinedAndNotEmpty(attribute.value as string));

  return attrWithValidValue;
}
