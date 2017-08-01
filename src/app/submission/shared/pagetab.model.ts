import {
    AttributesData,
    Feature,
    FeatureData,
    Section,
    SectionData,
    Submission,
    SubmissionData
} from './submission.model';
import {SubmissionType} from './submission-type.model';
import {convertAuthorsToContacts, convertContactsToAuthors} from './pagetab-authors.utils';
import {flattenDoubleArrays} from './pagetab-doublearrays.utils';
import {copyAttributes} from './pagetab-attributes.utils';

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
        let newObj = convertAuthorsToContacts(
            flattenDoubleArrays(
                copyAttributes(obj)));

        this.accno = newObj.accno;

        if (newObj.section !== undefined) {
            this.section = new PtSection(newObj.section);
        }
    }

    toSubmission(type: SubmissionType): Submission {
        return new Submission(type, this);
    }

    static fromSubmission(subm: Submission): any {
        const pt: any = {
            type: subm.type.name,
            accno: subm.accno
        };
        pt.section = PageTab.fromSection(subm.root);
        return convertContactsToAuthors(pt);
    }

    private static fromSection(sec: Section): any {
        const pts: any = {
            type: sec.type.name
        };

        if (sec.accno) {
            pts.accno = sec.accno;
        }

        let attributes = [];
        if (sec.fields.length > 0) {
            attributes = attributes.concat(sec.fields.list().map(fld => ({
                name: fld.name,
                value: fld.value
            })));
        }

        if (sec.annotations.size() > 0) {
            attributes.concat(PageTab.fromAnnotations(sec.annotations));
        }

        if (attributes.length > 0) {
            pts.attributes = attributes;
        }

        let subsections = [];

        sec.features.list().filter(f => f.size() > 0).forEach(f => {
            if (f.type.name === 'File') {
                pts.files = PageTab.fromFileOrLinkFeature(f, 'file');
            } else if (f.type.name === 'Link') {
                pts.links = PageTab.fromFileOrLinkFeature(f, 'url');
            } else {
                subsections = subsections.concat(PageTab.fromFeature(f));
            }
        });

        subsections = subsections.concat(
            sec.sections.list().map(s => PageTab.fromSection(s))
        );

        if (subsections.length > 0) {
            pts.subsections = subsections;
        }
        return pts;
    }

    private static fromAnnotations(f: Feature): any[] {
        return PageTab.fromFeature(f)[0].attributes;
    }

    private static fromFeature(f: Feature): any[] {
        return f.rows.map(row => (
            {
                type: f.type.name,
                attributes: row.keys().map(k => ({
                    name: k,
                    value: row.valueFor(k).value
                }))
            }));
    }

    private static fromFileOrLinkFeature(f: Feature, name: string): any[] {
        const isNamedAttr = (a) => (a.name.toLowerCase() === name);

        return PageTab.fromFeature(f).map(f => {
            const other = f.attributes.filter(!isNamedAttr);
            const ff: any = {type: f.type};
            ff[name] = (f.attributes.find(isNamedAttr) || {value: ''}).value || '';
            if (other.length > 0) {
                ff.attributes = other;
            }
            return ff;
        });
    }

}