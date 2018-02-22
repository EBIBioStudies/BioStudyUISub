/**
 * It shifts attributes from submission section to study section, allowing duplicates if so specified.
 * NOTE: PageTab allows duplicate attributes and some projects such as HECATOS do take advantage of them.
 * @param obj - Data object to be compliant with the PageTab format.
 * @param {boolean} [isUniqueAttrs = false] - If true, it suffixes duplicate attribute names with a number.
 * @returns {any} Study section object.
 */
import * as _ from 'lodash';

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

/**
 * Recursively traverses only the owned attribute arrays of the pagetab object in search of blank values:
 * an empty string or anything that can be regarded as such (eg: null). Those attributes that do have a blank
 * are removed. If all attributes are blank, the whole object property containing the attributes is removed if all
 * other properties are blank too.
 * NOTE: the app keeps the a temporary submission form's state in the server by sending even blank fields if necessary.
 * By default, the data from submissions about to be sent undergoes the same process. This method helps avoid cluttering
 * the server with blank values.
 * @param obj - Data object to be compliant with the PageTab format or an object within.
 */
export function removeBlankAttrs(obj: any) {
    let property;

    //Are there any attributes with empty values?
    for (property in obj) {
        if (obj.hasOwnProperty(property) && property == 'attributes') {
            obj[property] = obj[property].filter(attr => !_.isEmpty(attr.value));

            //Subsections have a type property that remains non-empty.
            if (obj.type && !obj[property].length) {
                obj.type = '';
            }

        } else if (typeof obj[property] == "object") {
            removeBlankAttrs(obj[property]);

            //Was "attributes" the only property that was empty within the object just traversed?
            //NOTE: If the property is an array, deletion will not remove the entry but null it.
            if (_.every(obj[property], _.isEmpty)) {
                delete obj[property];
            } else if (_.isArray(obj[property])) {
                obj[property] = obj[property].filter(item => !_.isEmpty(item));

            }
        }
    }
}

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
