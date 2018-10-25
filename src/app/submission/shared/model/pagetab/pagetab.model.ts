import {NameAndValue, Tag} from '../model.common';
import {fromNullable} from 'fp-ts/lib/Option';

export const ATTACH_TO_ATTR = 'AttachTo';
export const RELEASE_DATE_ATTR = 'ReleaseDate';
export const TITLE_ATTR = 'Title';
export const ROOT_PATH_ATTR = 'RootPath';

export type PtSectionItem = PtSection | PtSection[];
export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export interface PtAttribute {
    name?: string;
    value?: string;
    isReference?: boolean;
    valqual?: Partial<NameAndValue>[];
}

export interface PtLink {
    url?: string;
    attributes?: PtAttribute[];
}

export interface PtFile {
    path?: string;
    attributes?: PtAttribute[];
}

export interface PtSection {
    type?: string;
    accno?: string;
    attributes?: PtAttribute[];
    tags?: Partial<Tag>[];
    accessTags?: string[];
    subsections?: PtSectionItem [];
    libraryFile?: string;
    links?: PtLinkItem [];
    files?: PtFileItem [];
}

export interface PageTab {
    type?: string;
    section?: PtSection;
    accno?: string;
    attributes?: PtAttribute[];
    tags?: Partial<Tag>[];
    accessTags?: string[];
}

export function findReleaseDate(pageTab: PageTab): string | undefined {
    return fromNullable((pageTab.attributes || []).find(at => at.name === RELEASE_DATE_ATTR))
        .map(at => at.value).getOrElse(undefined);
}
