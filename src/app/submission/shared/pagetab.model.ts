import {Section, Submission} from './submission.model';
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
        this.type = obj.type || 'Undefined';
        this.tags = (obj.tags || []).map(t => Object.assign({}, t));
        this.accessTags = (obj.accesTags || []).map(t => Object.assign({}, t));
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

class PtFeature {
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

class PtSection extends PtEntry {
    readonly accno: string;
    readonly features: PtFeature[];
    readonly sections: PtSection[];

    constructor(obj: any) {
        super((obj = flattenArrays(obj)));

        const isFeature = (obj: any) => {
            return obj.subsections === undefined &&
                obj.files === undefined &&
                obj.links === undefined;
        };

        this.accno = obj.accno;

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
        let subm = new Submission(type.submType);
        this.copySection(this.section, subm.root);
        // TODO validate according the Type
        return subm;
    }

    fromSubmission(subm: Submission): any {
        //TODO
        return {};
    }


    private copySection(ptsec: PtSection, sec: Section): void {
        //TODO copy tags and accessTags
        sec.accno = ptsec.accno;

        const annotations = ptsec.attributes.reduce((rv, a) => {
            const t = sec.type.getFieldType(a.name);
            const key = (t === undefined) ? 'other' : 'fields';
            rv[key] = rv[key] || [];
            rv[key].push(a);
            return rv;
        }, {});

        sec.annotations.add(annotations['other']);
        (annotations['fields'] || []).forEach(fld => {
            sec.fields.add(fld);
        });

        ptsec.features.forEach(ptf => {
            const type = sec.type.getFeatureType(ptf.type);
            const f = sec.features.add(type);
            ptf.entries.forEach(e => {
                console.log(e.attributes);
                f.add(e.attributes);
            });
        });

        ptsec.sections.forEach(pts => {
            const type = sec.type.getSectionType(pts.type);
            const s = sec.sections.add(type, pts.accno);
            this.copySection(pts, s);
        });
    }
}