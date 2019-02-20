import {AttributeData, Feature, Section, Submission} from './submission';
import {
    AttrExceptions,
    contacts2Authors,
    LinksUtils,
    mergeAttributes,
    PageTab,
    PtAttribute,
    PtFile,
    PtFileItem,
    PtLink,
    PtLinkItem,
    PtSection
} from './pagetab';
import {DEFAULT_TEMPLATE_NAME, SubmissionType} from './templates';
import {PAGE_TAG, Tag} from './model.common';

const isFileType = (type: string) => type.isEqualIgnoringCase('file');
const isLinkType = (type: string) => type.isEqualIgnoringCase('link');
const isLibraryFileType = (type: string) => type.isEqualIgnoringCase('libraryfile');

const isEmptyAttr = (attr: PtAttribute) => String.isNotDefinedOrEmpty(attr.value);

export function newPageTab(templateName: string = DEFAULT_TEMPLATE_NAME): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = submission2PageTab(subm);

    //Guarantees that for non-default templates, an AttachTo attribute always exists.
    //NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (templateName && templateName != DEFAULT_TEMPLATE_NAME) {
        pageTab.attributes = mergeAttributes((pageTab.attributes || []), [{
            name: AttrExceptions.attachToAttr,
            value: templateName
        }]);
    }
    return pageTab;
}

export function submission2PageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    return <PageTab>{
        type: 'Submission',
        accno: subm.accno,
        section: section2PtSection(subm.section, isSanitise),
        tags: subm.tags.tags,
        accessTags: subm.tags.accessTags,
        attributes: mergeAttributes(
            subm.attributes.map(at => attributeData2PtAttribute(at)),
            extractSectionAttributes(subm.section, isSanitise)
                .filter(at => AttrExceptions.editable.includes(at.name!)))
    };
}

function section2PtSection(section: Section, isSanitise: boolean = false): PtSection {
    return <PtSection>{
        type: section.typeName,
        tags: withPageTag(section.tags.tags),
        accessTags: section.tags.accessTags,
        accno: section.accno,
        attributes: extractSectionAttributes(section, isSanitise)
            .filter(at => !AttrExceptions.editableAndRootOnly.includes(at.name!)),
        links: extractSectionLinks(section, isSanitise),
        files: extractSectionFiles(section, isSanitise),
        libraryFile: extractSectionLibraryFile(section, isSanitise),
        subsections: extractSectionSubsections(section, isSanitise)
    };
}

function withPageTag(tags: Tag[]): Tag[] {
    if (tags.find(t => t.value == PAGE_TAG.value) !== undefined) {
        return tags;
    }
    return [...tags, ...[PAGE_TAG]];
}

function extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    return ([] as Array<PtAttribute>).concat(
        fieldsAsAttributes(section, isSanitise),
        (extractFeatureAttributes(section.annotations, isSanitise).pop() || []));
}

function extractSectionSubsections(section: Section, isSanitize: boolean): PtSection[] {
    const featureSections = contacts2Authors(
        section.features.list().filter(f => !isFileType(f.typeName) && !isLinkType(f.typeName) && !isLibraryFileType(f.typeName))
            .map(f => extractFeatureAttributes(f, isSanitize)
                .map(attrs => <PtSection>{type: f.typeName, attributes: attrs})
            ).reduce((rv, el) => rv.concat(el), [])
    );

    return featureSections.concat(section.sections.list().map(s => section2PtSection(s, isSanitize)));
}

function extractSectionLibraryFile(section: Section, isSanitise: boolean): string | undefined {
    const feature = section.features.list().find(f => isLibraryFileType(f.typeName));
    if (feature !== undefined && !feature.isEmpty) {
        return feature.rows[0].values()[0].value;
    }
    return undefined;
}

function extractSectionLinks(section: Section, isSanitise: boolean): PtLinkItem[] {
    const feature = section.features.list().find(f => isLinkType(f.typeName));
    if (feature !== undefined) {
        return extractFeatureAttributes(feature, isSanitise).map(attrs => attributesAsLink(attrs));
    }
    return [];
}

function extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const feature = section.features.list().find(f => isFileType(f.typeName));
    if (feature !== undefined) {
        return extractFeatureAttributes(feature, isSanitise).map(attrs => attributesAsFile(attrs));
    }
    return [];
}

function fieldsAsAttributes(section: Section, isSanitise: boolean) {
    return section.fields.list().map((field) => <PtAttribute>{name: field.name, value: field.value})
        .filter(attr => (isSanitise && !isEmptyAttr(attr)) || !isSanitise);
}

function extractFeatureAttributes(feature: Feature, isSanitise: boolean): PtAttribute[][] {
    return feature.rows.map(row =>
        feature.columns.map(c => <PtAttribute>{name: c.name, value: row.valueFor(c.id)!.value})
            .filter(attr => (isSanitise && !isEmptyAttr(attr)) || !isSanitise));
}

function attributesAsLink(attributes: PtAttribute[]): PtLink {
    return LinksUtils.toTyped(attributes);
}

function attributesAsFile(attributes: PtAttribute[]): PtFile {
    const isPathAttr = (at: PtAttribute) => String.isDefined(at.name) && at.name!.isEqualIgnoringCase('path');
    const attr = attributes.find(at => isPathAttr(at));
    const attrs = attributes.filter(at => !isPathAttr(at));
    return <PtFile>{path: attr!.value, attributes: attrs};
}

function attributeData2PtAttribute(attr: AttributeData): PtAttribute {
    const ptAttr = <PtAttribute>{
        name: attr.name,
        value: attr.value,
        isReference: attr.reference
    };
    if (!(attr.terms || []).isEmpty()) {
        ptAttr.valqual = attr.terms!.slice();
    }
    return ptAttr;
}