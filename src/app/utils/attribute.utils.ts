import { isDefinedAndNotEmpty } from './string.utils';
import { PtAttribute } from './../pages/submission/submission-shared/model/pagetab/pagetab.model';

export function isAttributeEmpty(attribute: PtAttribute): boolean {
  if (Array.isArray(attribute.value)) {
    return attribute.value.length === 0;
  }

  return !isDefinedAndNotEmpty(attribute.value);
}
