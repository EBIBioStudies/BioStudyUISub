import {AttributeData, FeatureData, SectionData, Submission, SubmissionData} from './submission.model';
import {PageTab, PtAttribute, PtSection} from './pagetab.model';
import {authors2Contacts} from './pagetab-authors.utils';
import {SubmissionType} from './submission-type.model';
import {LinksUtils} from './pagetab-links.utils';
import {mergeAttributes, SHARED_ATTRIBUTES} from './pagetab-attributes.utils';
import {findSubmissionTemplateName} from './templates/submission.templates';

export function pageTab2Submission(pageTab: PageTab) {
    const type = SubmissionType.fromTemplate(findSubmissionTemplateName(pageTab));
    return new Submission(type, pageTab2SubmissionData(pageTab));
}

export function pageTab2SubmissionData(pageTab: PageTab): SubmissionData {
    return <SubmissionData>{
        accno: pageTab.accno,
        tags: pageTab.tags,
        isRevised: !(pageTab.tags || []).isEmpty(),
        accessTags: pageTab.accessTags,
        attributes: ptAttributes2AttributeData(pageTab.attributes || []),
        section: pageTab.section ? ptSection2SectionData(pageTab.section, pageTab.attributes) : undefined
    };
}

function ptSection2SectionData(ptSection: PtSection, parentAttributes: PtAttribute[] = []): SectionData {
    const attributes = ptAttributes2AttributeData(
        mergeAttributes(parentAttributes
                .filter(at => String.isDefined(at.name))
                .filter(at => SHARED_ATTRIBUTES.includes(at.name!)),
            ptSection.attributes || []));

    const links = flatArray(ptSection.links || []);
    const files = flatArray(ptSection.files || []);
    const allSections = flatArray(ptSection.subsections || []);
    const featureSections = authors2Contacts(allSections.filter(section => !hasSubsections(section)));

    const features: FeatureData[] = [];
    if (!links.isEmpty()) {
        features.push(<FeatureData> {
            type: 'Link',
            entries: links.map(lnk => LinksUtils.toUntyped(lnk))
                .map(attrs => ptAttributes2AttributeData(attrs))
        });
    }

    if (!files.isEmpty()) {
        features.push(<FeatureData> {
            type: 'File',
            entries: files.map(file =>
                [<PtAttribute>{name: 'Path', value: file.path}].concat(file.attributes || []))
                .map(attrs => ptAttributes2AttributeData(attrs))
        });
    }

    if (!featureSections.isEmpty()) {
        const featureTypes = featureSections
            .filter(s => String.isDefinedAndNotEmpty(s.type))
            .map(s => s.type).uniqueValues();

        featureTypes.forEach(type => {
            const entries =
                featureSections.filter(section => section.type === type)
                    .map(section => ptAttributes2AttributeData(section.attributes || []));
            features.push(<FeatureData>{
                type: type,
                entries: entries
            });
        });
    }

    const sections: SectionData[] =
        allSections
            .filter(section => hasSubsections(section))
            .map(section => ptSection2SectionData(section));

    return <SectionData> {
        type: ptSection.type,
        accno: ptSection.accno,
        attributes: attributes,
        features: features,
        sections: sections
    }
}

function hasSubsections(section: PtSection): boolean {
    return (!(section.subsections || []).isEmpty()) ||
        (!(section.links || []).isEmpty()) ||
        (!(section.files || []).isEmpty());
}

function ptAttributes2AttributeData(attrs: PtAttribute[]): AttributeData[] {
    return attrs.map(at => <AttributeData>{
        name: at.name,
        value: at.value,
        reference: at.isReference,
        terms: at.valqual
    });
}

function flatArray<T>(array: (T | T[])[]): T[] {
    return array
        .map(el => Array.isArray(el) ? el : [el])
        .reduce((rv, ar) => [...ar, ...rv], <T[]>[]);
}