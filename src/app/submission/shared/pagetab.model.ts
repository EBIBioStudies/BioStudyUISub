import {Submission} from './submission.model';
import {SubmissionType} from './submission-type.model';
import {NameAndValue, Tag} from './model.common';
import {submission2PageTab} from './submission-to-pagetab.util';
import {pageTab2Submission} from './pagetab-to-submission.util';

export type PtSectionItem = PtSection | PtSection[];
export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export class PtAttribute {
    name: string;
    value: string;
    isReference?: boolean = false;
    valqual?: NameAndValue[];

    constructor(name: string, value: string, isReference: boolean = false) {
        this.name = name;
        this.value = value;
        this.isReference = isReference;
    }

    isEmpty(): boolean {
        return this.value.trim().length > 0;
    }
}

export class PtLink {
    url: string;
    attributes?: PtAttribute[];

    constructor(url: string, attributes?: PtAttribute[]) {
        this.url = url;
        this.attributes = attributes;
    }
}

export class PtFile {
    path: string;
    attributes?: PtAttribute[];

    constructor(path: string, attributes?: PtAttribute[]) {
        this.path = path;
        this.attributes = attributes;
    }
}

export class PtSection {
    type: string;
    accno?: string;
    attributes?: PtAttribute[];
    tags?: Tag[];
    accessTags?: string[];
    sections?: PtSectionItem [];
    links?: PtLinkItem [];
    files?: PtFileItem [];

    constructor(type: string) {
        this.type = type;
    }
}

export class PageTab {
    type: string;
    accno: string;
    section: PtSection;
    attributes?: PtAttribute[];
    tags?: any[] = [];
    accessTags?: string[] = [];

    constructor(accno: string, section: PtSection) {
        this.type = 'Submission';
        this.accno = accno;
        this.section = section;
    }

    // TODO: why it is here???
    //Submission data with a "tags" property at the root level implies that the submission has been revised
    //NOTE: the API does not mark revised submissions in any way at the point of list retrieval. Hence why that
    //state is determined here.
    get isRevised(): boolean {
        return (this.tags || []).length > 0;
    }

    /*todo check if such attribute exists*/
    addAttributes(attrs: PtAttribute[]) {
        const current: PtAttribute[] = this.attributes || [];
        this.attributes = current.concat(attrs);
    }

    static createNew(templateName: string = 'Default'): PageTab {
        const subm = new Submission(SubmissionType.fromTemplate(templateName));
        const pageTab = submission2PageTab(subm);

        //Guarantees that for non-default templates, an AttachTo attribute always exists.
        //NOTE: The PageTab constructor does not bother with attributes if the section is empty.
        if (templateName && templateName != 'Default') {
            pageTab.addAttributes([new PtAttribute('AttachTo', templateName)]);
        }
        return pageTab;
    }

    /**
     * Retrieves the first ocurrence of the "AttachTo" attribute at the root level. This is a convenience method
     * to allow the storage of the selected template (determined in turn by the project in question).
     * NOTE: Submissions created through the direct upload flow may be attached to multiple projects.
     * @returns {string} An empty string if no such attribute found.
     */
    get firstAttachTo(): string {
        const attrs = this.filterAttributesByName('AttachTo');
        return attrs.length === 0 ? '' : attrs[0].value;
    }

    filterAttributesByName(name: string): PtAttribute[] {
        return (this.section.attributes || []).filter(attr => attr.name === name);
    }

    toSubmission(type: SubmissionType): Submission {
        return new Submission(type, pageTab2Submission(this));
    }
}