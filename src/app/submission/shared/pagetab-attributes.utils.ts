/* it shifts attributes from submission section to study section */
export function copyAttributes(obj: any) {
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

    newObj.section.attributes = Object.keys(attrMap)
        .map(key => {
                return attrMap[key].map((v, i) => ({
                    name: key + (i > 0 ? '' + i : ''),
                    value: v
                }));
            }
        )
        .reduce((rv, x) => rv.concat(x, []));
    return newObj;
}
