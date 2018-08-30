import {Feature, Section, Submission} from './submission.model';
import {PageTab, PtAttribute, PtFile, PtFileItem, PtLink, PtLinkItem, PtSection} from './pagetab.model';
import {contacts2Authors} from './pagetab-authors.utils';

export function submission2PageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    let ptSection = section2PtSection(subm.section, isSanitise);
    let pageTab = new PageTab(subm.accno, ptSection);
    pageTab.tags = subm.tags.tags;
    pageTab.accessTags = subm.tags.accessTags;
    pageTab.addAttributes(extractSectionAttributes(subm.section, isSanitise).filter(/* todo: root attributes*/));
    return pageTab;
}

function section2PtSection(section: Section, isSanitise: boolean = false): PtSection {
    let ptSection = new PtSection(section.typeName);
    ptSection.tags = section.tags.tags;
    ptSection.accessTags = section.tags.accessTags;
    ptSection.accno = section.accno;
    ptSection.attributes = extractSectionAttributes(section, isSanitise);
    ptSection.links = extractSectionLinks(section, isSanitise);
    ptSection.files = extractSectionFiles(section, isSanitise);
    ptSection.sections = contacts2Authors(extractSectionSubsections(section, isSanitise));
    return ptSection;
}

function extractSectionSubsections(section: Section, isSanitize): PtSection[] {
    return section.sections.list().map(s => section2PtSection(s, isSanitize));
}

function extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    return ([] as PtAttribute[]).concat(
        fieldsAsAttributes(section, isSanitise),
        (extractFeatureAttributes(section.annotations, isSanitise).pop() ||[]));
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
    if (feature !== undefined) {
        return extractFeatureAttributes(feature, isSanitise).map(attrs => attributesAsFile(attrs));
    }
    return [];
}

function fieldsAsAttributes(section: Section, isSanitise: boolean) {
    return section.fields.list().map((field) => new PtAttribute(field.name, field.value))
        .filter(attr => (isSanitise && !attr.isEmpty()) || !isSanitise);
}

function extractFeatureAttributes(feature: Feature, isSanitise: boolean): PtAttribute[][] {
    return feature.rows.map(row =>
        feature.columns.map(c => new PtAttribute(c.name, row.valueFor(c.id).value))
            .filter(attr => (isSanitise && !attr.isEmpty()) || !isSanitise));
}

function attributesAsLink(attributes: PtAttribute[]): PtLink {
    const attr = attributes.find(at => at.value.toLowerCase() === 'url');
    const attrs = attributes.filter(at => at !== attr);
    return new PtLink(attr!.value, attrs);
}

function attributesAsFile(attributes: PtAttribute[]): PtFile {
    const attr = attributes.find(at => at.value.toLowerCase() === 'path');
    const attrs = attributes.filter(at => at !== attr);
    return new PtFile(attr!.value, attrs);
}