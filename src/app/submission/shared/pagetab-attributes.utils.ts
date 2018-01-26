/**
 * It shifts attributes from submission section to study section, allowing duplicates if so specified.
 * NOTE: PageTab allows duplicate attributes and some projects such as HECATOS do take advantage of them.
 * @param obj - Response object with the submission data
 * @param {boolean} [isUniqueAttrs = false] - If true, it suffixes duplicate attribute names with a number.
 * @returns {any} Study section object.
 */
export function copyAttributes(obj: any, isUniqueAttrs: boolean = false) {
    if (obj === undefined || obj.attributes === undefined || obj.section === undefined) {
        return obj;
    }

    const newObj = Object.assign({}, obj);
    newObj.section = Object.assign({}, newObj.section);

    const attrMap =
        (newObj.section.attributes || [])
            .concat(obj.attributes)
            .reduce((rv, a) => {
                rv[a.name] = (rv[a.name] || []);
                rv[a.name].push(a.value);
                return rv;
            }, {});

    newObj.section.attributes = Object.keys(attrMap).map(key => {
        let mapFn;

        if (isUniqueAttrs) {
            mapFn = (v, i) => ({
                name: key + (i > 0 ? '' + i : ''),
                value: v
            });
        } else {
            mapFn = (v, i) => ({
                name: key,
                value: v
            });
        }

        return attrMap[key].map(mapFn);

    }).reduce((rv, x) => rv.concat(x, []));

    return newObj;
}
