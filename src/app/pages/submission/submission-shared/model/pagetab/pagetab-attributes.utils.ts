import { AttrExceptions, PageTab, PtAttribute } from './pagetab.model';

/* merges to attribute lists by overriding only single value attributes*/
export function mergeAttributes(attrs1: PtAttribute[], attrs2: PtAttribute[]): PtAttribute[] {
  const merged: PtAttribute[] = [];
  const visited: { [key: string]: number } = {};

  attrs1.concat(attrs2)
    .forEach(at => {
      if (String.isDefinedAndNotEmpty(at.name) && AttrExceptions.unique.includes(at.name!)) {
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
  return merged;
}

export function extractKeywordsFromAttributes(attributes: PtAttribute[]) {
  return attributes.filter((attribute) => attribute.name === 'Keyword');
}

/* Adds 'AttachTo' attributes to a given submission's root level, leaving other existing attributes intact.*/
export function updateAttachToAttribute(obj: PageTab, projectIds: string[]): PageTab {
  const objCopy = Object.assign({}, obj);
  const attachAttrs = projectIds.map(pid => ({name: AttrExceptions.attachToAttr, value: pid}));

  const otherAttrs = (objCopy.attributes || [])
    .filter(at => !String.isDefined(at.name) || !at.name!.isEqualIgnoringCase(AttrExceptions.attachToAttr));
  objCopy.attributes = [...otherAttrs, ...attachAttrs];
  return objCopy;
}
