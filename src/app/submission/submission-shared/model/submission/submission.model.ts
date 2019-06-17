import { SubmissionType, } from '../templates';
import SubmissionSection from './model/submission-section.model';
import Tags from './model/submission-tags.model';
import { AttributeData, SubmissionData } from './model/submission';

export class Submission {
    accno: string;
    isRevised: boolean; // true if submission has been sent and is marked as revised by PageTab class.
    readonly section: SubmissionSection;
    readonly type;

    readonly tags: Tags;
    readonly attributes: AttributeData[];

    /**
     * Creates a new submission from PageTab-formatted data and pre-defined type definitions.
     * @see {@link PageTab}
     * @param {SubmissionType} type Type definitions object
     * @param {SubmissionData} data Submission data in PageTab format.
     */
    constructor(type: SubmissionType, data: SubmissionData = <SubmissionData>{}) {
        this.tags = Tags.create(data);
        this.type = type;
        this.accno = data.accno || '';
        this.attributes = data.attributes || [];
        this.isRevised = !this.isTemp && data.isRevised === true;
        this.section = new SubmissionSection(type.sectionType, data.section);
    }

    /**
     * Determines if the current submission is a temporary one by probing its accession number's format
     * @returns {boolean} True if the submission is temporary.
     */
    get isTemp(): boolean {
        return this.accno.length === 0 || this.accno.indexOf('TMP') === 0;
    }

    sectionPath(id: string): SubmissionSection[] {
        return this.section.sectionPath(id);
    }
}
