import {NameAndValue, Tag} from './model.common';

export const ATTACH_TO_ATTR = 'AttachTo';
export const RELEASE_DATE_ATTR = 'ReleaseDate';
export const TITLE_ATTR = 'Title';

/* attributes which are duplicated in submission and its root section (workaround for PageTab bad design) */
export const ATTRIBUTE_DUPLICATES = [TITLE_ATTR, RELEASE_DATE_ATTR];
export const ATTRIBUTE_DUPLICATES_CONTAINS = (s: string) => ATTRIBUTE_DUPLICATES.indexOf(s) >= 0;

export type PtSectionItem = PtSection | PtSection[];
export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export interface PtAttribute {
    name: string;
    value: string;
    isReference?: boolean;
    valqual?: NameAndValue[];
}

export interface PtLink {
    url: string;
    attributes?: PtAttribute[];
}

export interface PtFile {
    path: string;
    attributes?: PtAttribute[];
}

export interface PtSection {
    type: string;
    accno?: string;
    attributes?: PtAttribute[];
    tags?: Tag[];
    accessTags?: string[];
    subsections?: PtSectionItem [];
    links?: PtLinkItem [];
    files?: PtFileItem [];
}

export interface PageTab {
    type: string;
    accno: string;
    section: PtSection;
    attributes?: PtAttribute[];
    tags?: any[];
    accessTags?: string[];
}

export class PageTabUtils {
    pageTab: PageTab;

    constructor(pageTab: PageTab) {
        this.pageTab = pageTab;
    }

    addAttributes(attrs: PtAttribute[]): PageTabUtils {
        this.pageTab.attributes = this.mergeAttributes(this.pageTab.attributes || [], attrs);
        return this;
    }

    private mergeAttributes(current: PtAttribute[], toAdd: PtAttribute[]): PtAttribute[] {
        const merged: PtAttribute[] = [];
        const visited: { [key: string]: number } = {};

        current.concat(toAdd).forEach(at => {
            if (visited[at.name]) {
                merged[visited[at.name]] = at;
            } else {
                visited[at.name] = merged.length;
                merged.push(at);
            }
        });
        return merged;
    }
}

/* todo: why we have it here? */
/**
 * Retrieves the first ocurrence of the "AttachTo" attribute at the root level. This is a convenience method
 * to allow the storage of the selected template (determined in turn by the project in question).
 * NOTE: Submissions created through the direct upload flow may be attached to multiple projects.
 * @returns {string} An empty string if no such attribute found.
 */
export function firstAttachTo(pageTab: PageTab): string {
    const attrs = filterAttributesByName(pageTab, ATTACH_TO_ATTR);
    return attrs.length === 0 ? '' : attrs[0].value;
}

function filterAttributesByName(pageTab: PageTab, name: string): PtAttribute[] {
    return (pageTab.section.attributes || []).filter(attr => attr.name === name);
}