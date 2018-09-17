import {NameAndValue, Tag} from './model.common';

export const ATTACH_TO_ATTR = 'AttachTo';
export const RELEASE_DATE_ATTR = 'ReleaseDate';
export const TITLE_ATTR = 'Title';
export const ROOT_PATH_ATTR = 'RootPath';

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
    section: PtSection;
    accno?: string;
    attributes?: PtAttribute[];
    tags?: any[];
    accessTags?: string[];
}

export function emptyPageTab(): PageTab {
    return asPageTab({});
}

export function asPageTab(obj: any): PageTab {
    obj.type = obj.type || 'Submission';
    obj.section = obj.section || asPtSection({}, 'Study');
    obj.attributes = mapIfExists<PtAttribute>(obj.attributes, at => asPtAttribute(at));
    obj.tags = mapIfExists<Tag>(obj.tags, t => asTag(t));
    return obj;
}

function asPtSection(obj: any, type: string): PtSection {
    obj.type = obj.type || type;
    obj.attributes = mapIfExists<PtAttribute>(obj.attributes, at => asPtAttribute(at));
    obj.tags = mapIfExists<Tag>(obj.tags, t => asTag(t));
    obj.links = mapIfExists<PtLink>(obj.links, lnk => asPtLink(lnk));
    obj.files = mapIfExists<PtFile>(obj.files, fl => asPtFile(fl));
    obj.subsections = mapIfExists<PtSection>(obj.subsections, s => asPtSection(s, 'UnknownSectionType'));
    return obj;
}

function asPtAttribute(obj: any): PtAttribute {
    obj.name = obj.name || '';
    obj.value = obj.value || '';
    return obj;
}

function asPtLink(obj: any): PtLink {
    obj.url = obj.url || '';
    obj.attributes = mapIfExists<PtAttribute>(obj.attributes, at => asPtAttribute(at));
    return obj;
}

function asPtFile(obj: any): PtFile {
    obj.path = obj.path || '';
    obj.attributes = mapIfExists<PtAttribute>(obj.attributes, at => asPtAttribute(at));
    return obj;
}

function asTag(obj: any): Tag {
    obj.classifier = obj.classifier || '';
    obj.tag = obj.tag || '';
    return obj;
}

function mapIfExists<T>(arr: any[] | undefined, func: (any) => T): T[] | undefined {
    if (arr === undefined) {
        return arr;
    }
    return arr.map(el => func(el));
}