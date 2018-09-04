/**
 * Adds 'AttachTo' attributes to a given submission's root level, leaving other existing attributes intact.
 * @param obj - A submission obj to set the attributes to.
 * @param {string[]} projectIds - An array of project identifiers to get attribute values from.
 * @returns {any} Cloned submission object with the attributes.
 */
export function attachTo(obj: any, projectIds: string[]): any {
    if (obj === undefined) {
        return obj;
    }
    const newObj = Object.assign({}, obj);
    const attachAttrs = projectIds.map(pid => {
        return {name: 'AttachTo', value: pid}
    });
    const otherAttrs = (newObj.attributes || []).filter(a => a.name.toLowerCase() !== 'attachto');
    newObj.attributes = [...otherAttrs, ...attachAttrs];
    return newObj;
}
