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
import * as _ from 'lodash';
import {formatDate} from "../../submission-shared/date.utils";

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

        const isFeature = (s: any) => {
            return s.subsections === undefined &&
                s.files === undefined &&
                s.links === undefined;
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
    static externalAttrs: string[] = ['Title', 'ReleaseDate'];
    readonly accno: string;
    readonly isRevised: boolean;
    readonly section: PtSection;
    readonly tags: any[];
    readonly accessTags: string[];

    static fromSubmission(subm: Submission): any {

        //Properties outside the "section" property
        const pt: any = {
            type: subm.type.name,
            accno: subm.accno,
            tags: subm.tags.tags,
            accessTags: subm.tags.accessTags
        };

        //Properties under the "section" property
        pt.section = PageTab.fromSection(subm.root);

        //As per requirements of pagetab's current implementation, some attributes must not be within the section.
        pt['attributes'] = [];
        pt.section.attributes = _.filter(pt.section.attributes, (attribute) => {

            //While at it, sets the release date to today by default
            if (attribute.name === 'ReleaseDate' && !attribute.value) {
                attribute.value = formatDate(new Date(Date.now()));
            }

            //Moves attributes labelled as "external" outside the section
            if (_.includes(this.externalAttrs, attribute.name)) {
                pt.attributes.push(attribute);
                return false;

            //For the rest, leave them inside.
            } else {
                return true;
            }
        });

        return convertContactsToAuthors(pt);
    }

    static createNew(): any {
        const pt = new PageTab({});
        return PageTab.fromSubmission(pt.toSubmission(SubmissionType.createDefault()));
    }

    private static fromSection(sec: Section): any {
        const pts: any = {
            type: sec.type.name,
            tags: sec.tags.tags,
            accessTags: sec.tags.accessTags
        };

        if (sec.accno) {
            pts.accno = sec.accno;
        }

        let attributes = [];
        if (sec.fields.length > 0) {
            attributes = attributes.concat(sec.fields.list().map(fld => ({
                name: fld.name.split(' ').join(''),     //PageTab's property names are whitespace-free
                value: fld.value
            })));
        }

        if (sec.annotations.size() > 0) {
            attributes = attributes.concat(PageTab.fromAnnotations(sec.annotations));
        }

        if (attributes.length > 0) {
            pts.attributes = attributes;
        }

        let subsections = [];

        sec.features.list().filter(f => f.size() > 0).forEach(f => {
            const locType = f.type.name.toLowerCase();

            if (locType === 'file' || locType === 'link') {
                pts[`${locType}s`] = PageTab.fromLocationFeature(f);
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
                attributes: f.columns.map(c => ({
                    name: c.name,
                    value: row.valueFor(c.id).value
                }))
            })
        );
    }

    /**
     * Converts features of file or link type into the corresponding PageTab's section sets.
     * @param {Feature} feature - Feature to be converted
     * @param {string} [locRegex = /^(path|url)$/] - Regular expresion used to extract the location attribute.
     * @returns {any[]} Array of converted features
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    private static fromLocationFeature(feature: Feature, locRegex: RegExp = /^(path|url)$/): any[] {

        //Flattens each of the feature's row objects, adding other properties if necessary.
        return PageTab.fromFeature(feature).map(pagedRow => {
            const pagedLoc: any = {};
            const attrs: any = pagedRow.attributes.slice(0);
            const locationAttr: any = attrs.find((attr) => attr.name.toLowerCase().match(locRegex));

            //Extracts the location as a root-level property
            //NOTE: the proxy appears to consider the path as a non-attribute.
            if (locationAttr) {
                pagedLoc[locationAttr.name.toLowerCase()] = locationAttr.value;
                attrs.splice(attrs.indexOf(locationAttr), 1);
            }

            //If there are attributes, nests them inside the resulting object.
            if (attrs.length > 0) {
                pagedLoc.attributes = attrs;
            }

            //Only adds the type attribute if it's a file feature. Otherwise, submissions with links fail.
            if (pagedRow.type == 'File') {
                pagedLoc.type = pagedRow.type;
            }

            return pagedLoc;
        });
    }

    constructor(obj?: any | {}) {
        let newObj = flattenDoubleArrays(copyAttributes(obj));
        newObj = convertAuthorsToContacts(newObj);

        this.accno = newObj.accno;

        //Submission data with a "tags" property at the root level implies that the submission has been revised
        //NOTE: the API does not mark revised submissions in any way at the point of list retrieval. Hence why that
        //state is determined here.
        this.isRevised = newObj.hasOwnProperty('tags');

        this.tags = (newObj.tags || []);
        this.accessTags = (newObj.accessTags || []);

        if (newObj.section !== undefined) {
            this.section = new PtSection(newObj.section);
        }
    }

    /**
     * Converts from PageTab format into the app's internal data format for submissions.
     * @param {SubmissionType} type - Type definitions object.
     * @returns {Submission} Object representing the submission.
     */
    toSubmission(type: SubmissionType): Submission {
        return new Submission(type, this);
    }
}
