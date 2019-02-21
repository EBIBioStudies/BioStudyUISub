import {Tag} from '../model.common';

interface AttrException {
    name: string,
    rootLevel: boolean,
    studyLevel: boolean,
    systemOnly: boolean,
    unique:boolean
}

/* Here are the attributes which we have to deal with exceptionally (unfortunately):
 * AttachTo:     It's updated/created when submission attached to a project; it can have multiple values (multiple projects).
 *               It's not visible to the user and could be changed only by the system. Always stays at the root level.
 * ReleaseDate:  It's moved to the Study section attributes (of the model) to be visible/editable by the user and then
 *               moved back to the submission level attributes when submit. The attribute name is unique.
 * Title:        Can be the submission level or on study level attribute. It's copied to the submission level when study is
 *               submitted.
 */
export class AttrExceptions {

    private static all: Array<AttrException> = [
        {name: 'AttachTo', rootLevel: true, studyLevel: false, systemOnly: true, unique: false},
        {name: 'ReleaseDate', rootLevel: true, studyLevel: false, systemOnly: false, unique: true},
        {name: 'Title', rootLevel: true, studyLevel: true, systemOnly: false, unique: true}
    ];

    private static _editable: Array<string> = AttrExceptions.all
        .filter(at => (at.rootLevel || at.studyLevel) && !at.systemOnly).map(at => at.name);

    private static _editableAndRootOnly: Array<string> = AttrExceptions.all
        .filter(at => at.rootLevel && !at.studyLevel && !at.systemOnly).map(at => at.name);

    private static _unique: Array<string> = AttrExceptions.all
        .filter(at => at.unique).map(at => at.name);

    public static get editable() {
        return this._editable;
    }

    public static get editableAndRootOnly() {
        return this._editableAndRootOnly;
    }

    public static get unique() {
        return this._unique;
    }

    public static get attachToAttr(): string {
        return 'AttachTo';
    }
}

export type PtSectionItem = PtSection | PtSection[];
export type PtLinkItem = PtLink | PtLink[];
export type PtFileItem = PtFile | PtFile[];

export interface PtTag {
    classifier?: string;
    tag?: string
}

export interface PtNameAndValue {
    name?: string;
    value?: string;
}

export interface PtAttribute {
    name?: string;
    value?: string;
    isReference?: boolean;
    valqual?: PtNameAndValue[];
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
    tags?: PtTag[];
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
    tags?: Tag[];
    accessTags?: string[];
}
