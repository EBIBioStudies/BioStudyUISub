function isDoubleArray(array: any): boolean {
    if (array === undefined || !(array instanceof Array) || array.length === 0) {
        return false;
    }
    return array[0] instanceof Array;
}

function flatten(array: any): any {
    if (isDoubleArray(array)) {
        return [].concat.apply([], array);
    }
    return array;
}

export function flattenDoubleArrays(obj: any): any {
    const newObj = Object.assign({}, obj);

    if (obj.hasOwnProperty('files')) {
        newObj.files = flatten(obj.files);
    }

    if (obj.hasOwnProperty('links')) {
        newObj.links = flatten(obj.links);
    }

    if (obj.hasOwnProperty('subsections')) {
        newObj.subsections = flatten(obj.subsections)
            .map(s => flattenDoubleArrays(s));
    }

    if (obj.hasOwnProperty('section')) {
        newObj.section = flatten(obj.section);
        newObj.section = flattenDoubleArrays(obj.section);
    }
    return newObj;
}
