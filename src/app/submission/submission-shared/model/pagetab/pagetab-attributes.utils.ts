import { AttrExceptions, PtAttribute } from './pagetab.model';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { isAttributeEmpty } from '../../utils/attribute.utils';

/* merges to attribute lists by overriding only single value attributes*/
export function mergeAttributes(attrs1: PtAttribute[], attrs2: PtAttribute[]): PtAttribute[] {
  const merged: PtAttribute[] = [];
  const visited: { [key: string]: number } = {};

  attrs1.concat(attrs2).forEach((at) => {
    if (isDefinedAndNotEmpty(at.name) && AttrExceptions.unique.includes(at.name!)) {
      if (visited[at.name!] === undefined) {
        visited[at.name!] = merged.length;
        merged.push(at);
      } else {
        merged[visited[at.name!]] = at;
      }
    } else {
      merged.push(at);
    }
  });

  return merged.filter((attr) => !isAttributeEmpty(attr));
}

export function findAttributesByName(name: string, attributes: PtAttribute[]): PtAttribute[] {
  return attributes.filter((attribute) => attribute.name === name);
}

export function extractKeywordsFromAttributes(attributes: PtAttribute[]): PtAttribute[] {
  return attributes.filter((attribute) => attribute.name === 'Keyword');
}
