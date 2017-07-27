import {AttributesData, FeatureData, Section, SectionData, Submission, SubmissionData} from './submission.model';
import {SubmissionType} from './submission-type.model';
import {convertAuthorsToContacts} from './authors-affiliations.helper';
import {flattenDoubleArrays} from './pagetab-doublearrays.helper';

class PtEntry implements AttributesData {
    readonly attributes: { name: string, value: string }[];

    constructor(obj: any = {}) {
        this.attributes = (obj.attributes || [])
            .map(a => {
                return a.isReference ?
                    {
                        name: a.name,
                        value: a.value,
                        isRef: a.isReference === true
                    } : a;
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
        super(obj);

        const isFeature = (obj: any) => {
            return obj.subsections === undefined &&
                obj.files === undefined &&
                obj.links === undefined;
        };

        this.type = obj.type;
        this.accno = obj.accno;
        this.tags = (obj.tags || []).map(t => Object.assign({}, t));
        this.accessTags = (obj.accessTags || []).map(t => Object.assign({}, t));

        const subsections = (obj.subsections || []).slice();

        let featureMap = subsections
            .filter(s => isFeature(s))
            .reduce((rv, x) => {
                rv[x.type] = (rv[x.type] || []);
                rv[x.type].push(x);
                return rv;
            }, {});

        let features = Object
            .keys(featureMap)
            .map(k => new PtFeature(k, featureMap[k]));
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

export class PageTab implements SubmissionData {
    readonly accno: string;
    readonly section: PtSection;

    constructor(obj: any = {}) {
        //todo: move all attributes (if any) to a child section
        let newObj = convertAuthorsToContacts(flattenDoubleArrays(obj));

        this.accno = newObj.accno;

        if (newObj.section !== undefined) {
            this.section = new PtSection(newObj.section);
        }
    }

    toSubmission(type: SubmissionType): Submission {
        return new Submission(type, this);
    }

    static fromSubmission(subm: Submission): any {
        const root = subm.root;
        const pt: any = {
            type: root.typeName,
            accno: root.accno
        };
        if (root.sections.length > 0) {
            pt.section = PageTab.fromSection(root.sections.list()[0]);
        }
        return pt;
    }

    private static fromSection(sec: Section): any {
        return {};
    }
}