import {Submission} from './submission.model';
import {SubmissionType} from './submission-type.model';
//import * as stu from './submission-type.utils';

class PtEntry {
    readonly type: string;
    readonly tags: any[];
    readonly accessTags: any[];
    readonly attributes: any[];

    constructor(obj:any) {
        let resolveRef = (accno: string) => {
            //TODO
        };
        this.type = obj.type;
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
        this.type = type;
        this.entries = (entries || []).map(i => new PtEntry(i));
    }
}

class PtSection extends PtEntry {
    readonly accno: string;
    readonly features: PtFeature[];
    readonly sections: PtSection[];

    constructor(obj: any) {
        super(obj);
        this.accno = obj.accno;

        let subsections = obj.subsections || [];
        if (isDoubleArray(subsections)) {
            subsections = [].concat.apply([], subsections);
        }
        let features = subsections
            .filter(s => s.subsections === undefined)
            .reduce((rv, x) => {
                (rv[x.type] = rv[x.type] || []).push(x);
                return rv;
            }, {});

        this.features = Object.keys(features).map(k => new PtFeature(k, features[k]));
        this.sections = subsections
            .filter(s => s.subsections !== undefined)
            .map(s => new PtSection(s));
    }
}

export class PageTab {
    private obj: PtSection;

    constructor(obj: any = {}) {
        obj.subsections = obj.section ? [obj.section] : [];
        this.obj = new PtSection(obj)
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

    private update(subm: Submission): void {
        subm.root.addTags(this.obj.tags);
        subm.root.addAccessTags(this.obj.accessTags);
        subm.root.accno = this.obj.accno;

    }
}