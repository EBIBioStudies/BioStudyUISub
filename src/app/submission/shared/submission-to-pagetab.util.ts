import {AttributeData, Feature, Section, Submission} from './submission.model';
import {
    ATTACH_TO_ATTR,
    ATTRIBUTE_DUPLICATES_CONTAINS,
    PageTab, PageTabUtils,
    PtAttribute,
    PtFile,
    PtFileItem,
    PtLink,
    PtLinkItem,
    PtSection
} from './pagetab.model';
import {contacts2Authors} from './pagetab-authors.utils';
import {SubmissionType} from './submission-type.model';
import {LinksUtils} from './pagetab-links.utils';

export function newPageTab(templateName: string = 'Default'): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = submission2PageTab(subm);

    //Guarantees that for non-default templates, an AttachTo attribute always exists.
    //NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (templateName && templateName != 'Default') {
        new PageTabUtils(pageTab).addAttributes([{name: ATTACH_TO_ATTR, value: templateName}]);
    }
    return pageTab;
}

export function submission2PageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    let ptSection = section2PtSection(subm.section, isSanitise);
    return new PageTabUtils(<PageTab>{
        accno: subm.accno,
        section: ptSection,
        tags: subm.tags.tags,
        accessTags: subm.tags.accessTags,
        attributes: subm.attributes.map(at => attributeData2PtAttribute(at))
    }).addAttributes((ptSection.attributes || []).filter(at => ATTRIBUTE_DUPLICATES_CONTAINS(at.name)))
        .pageTab;
}

function section2PtSection(section: Section, isSanitise: boolean = false): PtSection {
    return <PtSection>{
        type: section.typeName,
        tags: section.tags.tags,
        accessTags: section.tags.accessTags,
        accno: section.accno,
        attributes: extractSectionAttributes(section, isSanitise),
        links: extractSectionLinks(section, isSanitise),
        files: extractSectionFiles(section, isSanitise),
        subsections: contacts2Authors(extractSectionSubsections(section, isSanitise))
    };
}

function extractSectionSubsections(section: Section, isSanitize): PtSection[] {
    return section.sections.list().map(s => section2PtSection(s, isSanitize));
}

function extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    return ([] as PtAttribute[]).concat(
        fieldsAsAttributes(section, isSanitise),
        (extractFeatureAttributes(section.annotations, isSanitise).pop() || []));
}

function extractSectionLinks(section: Section, isSanitise: boolean): PtLinkItem[] {
    const feature = section.features.list().find(f => f.typeName.toLowerCase() === 'link');
    if (feature !== undefined) {
        return extractFeatureAttributes(feature, isSanitise).map(attrs => attributesAsLink(attrs));
    }
    return [];
}

function extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const feature = section.features.list().find(f => f.typeName.toLowerCase() === 'file');
    console.log('fileFeature', feature);
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
    /*const attr = attributes.find(at => at.name.toLowerCase() === 'url');
    const attrs = attributes.filter(at => at !== attr);
    return <PtLink>{url: attr!.value, attributes: attrs};*/
}

function attributesAsFile(attributes: PtAttribute[]): PtFile {
    const attr = attributes.find(at => at.name.toLowerCase() === 'path');
    const attrs = attributes.filter(at => at.name.toLowerCase() !== 'path');
    return <PtFile>{path: attr!.value, attributes: attrs};
}

function attributeData2PtAttribute(attr: AttributeData): PtAttribute {
    const ptAttr = <PtAttribute>{
        name: attr.name,
        value: attr.value,
        isReference: attr.reference
    };
    if ((attr.terms || []).length > 0) {
        ptAttr.valqual = attr.terms.slice();
    }
    return ptAttr;
}

function isEmptyAttr(attr: PtAttribute): boolean {
    return attr.value == undefined || attr.value.trim().length === 0;
}