import {ATTACH_TO_ATTR, PageTab, PtAttribute, RELEASE_DATE_ATTR, ROOT_PATH_ATTR, TITLE_ATTR} from './pagetab.model';


const SINGLE_VALUE_ATTRIBUTES = [TITLE_ATTR, RELEASE_DATE_ATTR, ROOT_PATH_ATTR];

/* attributes which are shared/duplicated in submission and its root section (workaround for PageTab bad design) */
export const SHARED_ATTRIBUTES = [TITLE_ATTR, RELEASE_DATE_ATTR];
export const SHARED_ATTRIBUTES_CONTAIN = (s: string) => SHARED_ATTRIBUTES.indexOf(s) >= 0;

/* merges to attribute lists by overriding only single value attributes*/
export function mergeAttributes(attrs1: PtAttribute[], attrs2: PtAttribute[]): PtAttribute[] {
    const merged: PtAttribute[] = [];
    const visited: { [key: string]: number } = {};

    attrs1.concat(attrs2)
        .forEach(at => {
            if (SINGLE_VALUE_ATTRIBUTES.indexOf(at.name) >= 0) {
                if (visited[at.name] === undefined) {
                    visited[at.name] = merged.length;
                    merged.push(at);
                } else {
                    merged[visited[at.name]] = at;
                }
            } else {
                merged.push(at);
            }
        });
    return merged;
}

export function filterAttributesByName(pageTab: PageTab, name: string): PtAttribute[] {
    return (pageTab.section.attributes || []).filter(attr => attr.name === name);
}

/**
 * Adds 'AttachTo' attributes to a given submission's root level, leaving other existing attributes intact.
 * @param obj - A submission obj to set the attributes to.
 * @param {string[]} projectIds - An array of project identifiers to get attribute values from.
 * @returns {any} Cloned submission object with the attributes.
 */
export function updateAttachToAttribute(obj: PageTab, projectIds: string[]): PageTab {
    const objCopy = Object.assign({}, obj);
    const attachAttrs = projectIds.map(pid => ({name: ATTACH_TO_ATTR, value: pid}));

    const otherAttrs = (objCopy.attributes || []).filter(a => a.name.toLowerCase() !== ATTACH_TO_ATTR);
    objCopy.attributes = [...otherAttrs, ...attachAttrs];
    return objCopy;
}
