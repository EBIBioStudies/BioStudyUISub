import {Submission} from './submission.model';
import {SubmissionType} from './submission-type.model';
//import * as stu from './submission-type.utils';

const isDoubleArray = (array: any) => {
    if (array === undefined || !(array instanceof Array) || array.length === 0) {
        return false;
    }
    return array[0] instanceof Array;
};

const flattenArrays = (obj: any): any => {
    const newObj = Object.assign({}, obj);
    newObj.subsections = flatten(obj.subsections);
    newObj.files = flatten(obj.files);
    newObj.links = flatten(obj.links);
    return newObj;
};

const flatten = (array: any): any => {
    if (isDoubleArray(array)) {
        return [].concat.apply([], array);
    }
    return array;
};

class PtEntry {
    readonly type: string;
    readonly tags: any[];
    readonly accessTags: any[];
    readonly attributes: any[];

    constructor(obj: any = {}) {
        const resolveRef = (accno: string) => {
            const section = (obj.subsections || []).find(s => s.accno === accno);
            if (section === undefined) {
                console.error(`Can't resolve reference ${accno}`);
            }
            const attributes = ((section || {}).attributes) || [];
            return attributes.length > 0 ? attributes[0].value : accno;
        };
        this.type = obj.type || 'Undefined';
        this.tags = (obj.tags || []).map(t => Object.assign({}, t));
        this.accessTags = (obj.accesTags || []).map(t => Object.assign({}, t));
        this.attributes = (obj.attributes || [])
            .map(a => Object.assign({}, a))
            .map(a => {
                if (a.isReference === true) {
                    return {
                        "name": a.name,
                        "value": resolveRef(a.value)
                    }
                }
                return a;
            });
    }
}

class PtFeature {
    readonly type: string;
    readonly entries: PtEntry[];

    constructor(type: string, entries: any[]) {
        this.type = type || 'Undefined';
        this.entries = (entries || []).map(i => new PtEntry(i));
    }

    static file(entries: any[]): PtFeature {
        return new PtFeature('File',
            entries.map(e => {
                const ee = Object.assign({}, e);
                ee.attributes = (e.attributes || []).slice();
                ee.attributes.push({name: "Path", value: ee.path});
                return ee;
            }));
    }

    static link(entries: any[]): PtFeature {
        return new PtFeature('Link',
            entries.map(e => {
                const ee = Object.assign({}, e);
                ee.attributes = (e.attributes || []).slice();
                ee.attributes.push({name: "URL", value: ee.url});
                return ee;
            }));
    }
}

class PtSection extends PtEntry {
    readonly accno: string;
    readonly features: PtFeature[];
    readonly sections: PtSection[];

    constructor(obj: any) {
        super((obj = flattenArrays(obj)));
        this.accno = obj.accno;

        let subsections = obj.subsections || [];

        let features = subsections
            .filter(s => s.subsections === undefined)
            .reduce((rv, x) => {
                rv[x.type] = (rv[x.type] || []);
                rv[x.type].push(x);
                return rv;
            }, {});

        this.features = Object.keys(features).map(k => new PtFeature(k, features[k]));
        if (obj.files !== undefined) {
            this.features.push(PtFeature.file(obj.files));
        }
        if (obj.links !== undefined) {
            this.features.push(PtFeature.link(obj.links));
        }

        this.sections = subsections
            .filter(s => s.subsections !== undefined)
            .map(s => new PtSection(s));
    }
}

export class PageTab {
    readonly section: PtSection;

    constructor(obj?: any) {
        if (obj !== undefined) {
            const newObj = Object.assign({}, obj);
            newObj.subsections = (obj.subsections || []).slice();
            newObj.subsections = newObj.subsections.concat((obj.section ? [obj.section] : []));
            this.section = new PtSection(newObj);
        }
    }

    toSubmission(type: SubmissionType): Submission {
        /*let subm = new Submission(type);
         this.update(subm);
         return subm;*/
        return undefined;
    }

    fromSubmission(subm: Submission): any {
        //TODO
        return {};
    }

}