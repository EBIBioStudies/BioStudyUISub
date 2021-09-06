import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { isValueEmpty } from 'app/utils/validation.utils';
import { PtAttribute, PtLink } from '../model';

/**
 * Utility class bridging the differences between PageTab's specs for links and the app's internal submission model.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */

const POINTER_ATTR = 'Link';
const TYPE_ATTR = 'Type';
const URL_REGEXP = /^(http|https|ftp):\/\/.+$/;

/**
 * Converts a submission link to a PageTab one, typically used when saving a study. It uses the format of the
 * link's pointer to determine if a 'Type' attribute is required. It also renames the root-level 'pointer'
 * property to PageTab's expected 'url'.
 * NOTE: In the case of prefix:ID links, the 'Type' attribute must be set to the pre
 * @param linkObj - PageTab's data object for the link.
 * @returns PageTab-ready link object.
 */
export function toTyped(attributes: PtAttribute[]): PtLink {
  const pointer: string = ((attributes.find((at) => at.name === POINTER_ATTR) || { value: '' }).value as string) || '';
  const typeAttr = { name: TYPE_ATTR, value: '', reference: false };
  const isUrl = URL_REGEXP.test(pointer);

  const linkObj = {
    url: '',
    attributes: attributes.filter((at) => ![TYPE_ATTR, POINTER_ATTR].includes(at.name!) && !isValueEmpty(at.value))
  } as PtLink;

  if (pointer) {
    if (isUrl) {
      linkObj.url = pointer;
    } else {
      const linkParts = pointer.split(':');

      // It must be a prefix:ID link
      if (linkParts.length > 1) {
        typeAttr.value = linkParts[0];
        linkObj.url = linkParts[1];
      } else {
        linkObj.url = linkParts[0];
      }
    }
  }

  if (!isValueEmpty(typeAttr.value)) {
    linkObj.attributes!.push(typeAttr);
  }

  return linkObj;
}

/**
 * Converts a PageTab link to a submission one, typically used when loading a study. It adds a 'Link' attribute
 * whose value is equal to the root 'url' property. It also prefixes the pointer with the 'Type' attribute's value
 * if not empty (it's the prefix of a prefix:ID link).
 * NOTE: In the case of prefix:ID links, PageTab's 'url' root property is set to the ID.
 * @param linkObj - Submission model's object for the link.
 * @returns Submission-ready link object.
 */
export function toUntyped(linkObj: PtLink): PtAttribute[] {
  const attrs = linkObj.attributes || [];
  const pointerAttr = { name: POINTER_ATTR, value: linkObj.url, reference: false };
  const typeAttr = attrs.find((at) => at.name === TYPE_ATTR);

  if (typeAttr !== undefined && isDefinedAndNotEmpty(typeAttr.value as string)) {
    pointerAttr.value = typeAttr.value + ':' + linkObj.url;
  }

  return [pointerAttr, ...attrs.filter((at) => ![TYPE_ATTR, POINTER_ATTR].includes(at.name!))];
}
