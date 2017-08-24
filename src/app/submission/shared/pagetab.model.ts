import {
    AttributesData,
    FeatureData,
    SectionData,
    Submission,
    SubmissionData
} from './submission.model';
import {SubmissionType} from './submission-type.model';
import {convertAuthorsToContacts, convertContactsToAuthors} from './pagetab-authors.utils';
import {flattenDoubleArrays} from './pagetab-doublearrays.utils';
import {copyAttributes} from './pagetab-attributes.utils';

const HiddenFeature = {
    type: '__HIDDEN__',
    entries: [{
        attributes: [{
            name: '__NAME__',
            value: '__VALUE__'
        }]
    }]
} as FeatureData;

const isEmptyArray = function (v) {
    return v === undefined || v.length === 0
};

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

    static file(entries: any[]): PtFeature {
        return new PtFeature('File',
            entries.map(e => {
                const ee = Object.assign({}, e);
                ee.attributes = (e.attributes || []).slice();
                ee.attributes.push({name: 'Path', value: ee.path});
                return ee;
            }));
    }

    static link(entries: any[]): PtFeature {
        return new PtFeature('Link',
            entries.map(e => {
                const ee = Object.assign({}, e);
                ee.attributes = (e.attributes || []).slice();
                ee.attributes.push({name: 'URL', value: ee.url});
                return ee;
            }));
    }

    constructor(type: string, entries: any[]) {
        this.type = type || 'Undefined';
        this.entries = (entries || []).map(e => new PtEntry(e));
    }
}

class PtSection extends PtEntry implements SectionData {
    readonly type: string;
    readonly accno: string;
    readonly tags: any[];
    readonly accessTags: string[];
    readonly features: PtFeature[];
    readonly sections: PtSection[];

    constructor(obj: any) {
        super(obj);

        const isFeature = function (s: any) {
            return isEmptyArray(s.subsections) &&
                isEmptyArray(s.files) &&
                isEmptyArray(s.links);
        };

        this.type = obj.type;
        this.accno = obj.accno;
        this.tags = (obj.tags || []);
        this.accessTags = (obj.accessTags || []);

        const subsections = (obj.subsections || []).slice();

        const featureMap = subsections
            .filter(s => isFeature(s))
            .reduce((rv, x) => {
                rv[x.type] = (rv[x.type] || []);
                rv[x.type].push(x);
                return rv;
            }, {});

        const features = Object
            .keys(featureMap)
            .filter(k => k !== HiddenFeature.type)
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
    readonly tags: any[];
    readonly accessTags: string[];

    // ignoreEmptySections means that empty sections (and features) will not be included into PageTab
    static fromSubmission(subm: Submission, ignoreEmptySections = false): any {
        const pt: any = {
            type: subm.type.name,
            accno: subm.accno,
            tags: subm.tags.tags,
            accessTags: subm.tags.accessTags
        };
        pt.section = PageTab.fromSection(subm.root.data, ignoreEmptySections);
        return convertContactsToAuthors(pt);
    }

    static createNew(): any {
        const pt = new PageTab();
        return PageTab.fromSubmission(pt.toSubmission(SubmissionType.createDefault()));
    }

    private static fromSection(sd: SectionData, ignoreEmptySections: boolean): any {
        let subsections = [];
        let files = [];
        let links = [];

        sd.features
            .forEach(fd => {
                if (fd.type === 'File') {
                    files = PageTab.fromFileOrLinkFeature(fd, 'file');
                } else if (fd.type === 'Link') {
                    links = PageTab.fromFileOrLinkFeature(fd, 'url');
                } else {
                    subsections = subsections.concat(PageTab.fromFeature(fd));
                }
            });

        subsections = subsections.concat(
            sd.sections
                .map(s => PageTab.fromSection(s, ignoreEmptySections))
                .filter(s => s !== undefined));

        if (ignoreEmptySections) {
            subsections = subsections.filter(sub =>
                !isEmptyArray(sub.attributes)
                || !isEmptyArray(sub.files)
                || !isEmptyArray(sub.links)
                || !isEmptyArray(sub.subsections)
            );
            if (subsections.length === 0) {
                return;
            }
        }

        if (links.length === 0 && files.length === 0 && subsections.length === 0) {
            subsections = subsections.concat(PageTab.fromFeature(HiddenFeature));
        }

        const pts: any = {
            type: sd.type,
            accno: sd.accno,
            tags: sd.tags,
            accessTags: sd.accessTags
        };

        if (!isEmptyArray(sd.attributes)) {
            pts.attributes = sd.attributes;
        }

        if (files.length > 0) {
            pts.files = files;
        }

        if (links.length > 0) {
            pts.links = links;
        }

        if (subsections.length > 0) {
            pts.subsections = subsections;
        }

        return pts;
    }

    private static fromFeature(fd: FeatureData): any[] {
        return fd.entries.map(entry => (
            {
                type: fd.type,
                attributes: entry.attributes
            }));
    }

    private static fromFileOrLinkFeature(fd: FeatureData, name: string): any[] {
        const isNamedAttr = (a) => (a.name.toLowerCase() === name);

        return PageTab.fromFeature(fd).map(f => {
            const other = f.attributes.filter((a) => !isNamedAttr(a));
            const ff: any = {type: f.type};
            ff[name] = (f.attributes.find(isNamedAttr) || {value: ''}).value || '';
            if (other.length > 0) {
                ff.attributes = other;
            }
            return ff;
        });
    }

    constructor(obj: any = {}) {
        const newObj = convertAuthorsToContacts(
            flattenDoubleArrays(
                copyAttributes(obj)));

        this.accno = newObj.accno;
        this.tags = (newObj.tags || []);
        this.accessTags = (newObj.accessTags || []);

        if (newObj.section !== undefined) {
            this.section = new PtSection(newObj.section);
        }
    }

    toSubmission(type: SubmissionType): Submission {
        return new Submission(type, this);
    }
}
