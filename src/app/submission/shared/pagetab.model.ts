import {AttributesData, FeatureData, Section, SectionData, Submission} from './submission.model';
import {SubmissionType} from './submission-type.model';

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

class PtEntry implements AttributesData {
    readonly attributes: { name: string, value: string }[];

    constructor(obj: any = {}) {
        const resolveRef = (accno: string) => {
            const section = (obj.subsections || []).find(s => s.accno === accno);
            if (section === undefined) {
                console.error(`Can't resolve reference ${accno}`);
            }
            const attributes = ((section || {}).attributes) || [];
            return attributes.length > 0 ? attributes[0].value : accno;
        };
        this.attributes = (obj.attributes || [])
            .map(a => Object.assign({}, a))
            .map(a => {
                if (a.isReference === true) {
                    return {
                        name: a.name,
                        value: resolveRef(a.value)
                    }
                }
                return a;
            });
    }
}

class PtFeature implements FeatureData {
    readonly type: string;
    readonly entries: PtEntry[];

    constructor(type: string, entries: any[]) {
        this.type = type || 'Undefined';
        this.entries = (entries || []).map(e => new PtEntry(e));
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

class PtSection extends PtEntry implements SectionData {
    readonly type: string;
    readonly accno: string;
    readonly tags: any[];
    readonly accessTags: any[];
    readonly features: PtFeature[];
    readonly sections: PtSection[];

    constructor(obj: any) {
        super((obj = flattenArrays(obj)));

        const isFeature = (obj: any) => {
            return obj.subsections === undefined &&
                obj.files === undefined &&
                obj.links === undefined;
        };

        this.type = obj.type;
        this.accno = obj.accno;
        this.tags = (obj.tags || []).map(t => Object.assign({}, t));
        this.accessTags = (obj.accessTags || []).map(t => Object.assign({}, t));

        let subsections = obj.subsections || [];

        let featureMap = subsections
            .filter(s => isFeature(s))
            .reduce((rv, x) => {
                rv[x.type] = (rv[x.type] || []);
                rv[x.type].push(x);
                return rv;
            }, {});

        let features = Object.keys(featureMap).map(k => new PtFeature(k, featureMap[k]));
        if (obj.files !== undefined) {
            features.push(PtFeature.file(obj.files));
        }
        if (obj.links !== undefined) {
            features.push(PtFeature.link(obj.links));
        }

        this.features = features;
        this.sections = subsections
            .filter(s => !isFeature(s))
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
        return new Submission(type.submType, this.section);
    }

    fromSubmission(subm: Submission): any {
        //TODO
        return {};
    }
}