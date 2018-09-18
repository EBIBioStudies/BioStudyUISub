import {AttributeData, FeatureData, SectionData, Submission, SubmissionData} from './submission.model';
import {PageTab, PtAttribute, PtSection} from './pagetab.model';
import {authors2Contacts} from './pagetab-authors.utils';
import {SubmissionType} from './submission-type.model';
import {LinksUtils} from './pagetab-links.utils';
import {mergeAttributes, SHARED_ATTRIBUTES_CONTAIN} from './pagetab.utils';

export function pageTab2Submission(type: SubmissionType, pageTab: PageTab) {
    return new Submission(type, pageTab2SubmissionData(pageTab));
}

export function pageTab2SubmissionData(pageTab: PageTab): SubmissionData {
    return <SubmissionData>{
        accno: pageTab.accno,
        tags: pageTab.tags,
        isRevised: (pageTab.tags || []).length > 0,
        accessTags: pageTab.accessTags,
        attributes: ptAttributes2AttributeData(pageTab.attributes || []),
        section: ptSection2SectionData(pageTab.section, pageTab.attributes)
    };
}

function ptSection2SectionData(ptSection: PtSection, parentAttributes: PtAttribute[] = []): SectionData {

    const attributes = ptAttributes2AttributeData(
        mergeAttributes(parentAttributes.filter(at => SHARED_ATTRIBUTES_CONTAIN(at.name)),
            ptSection.attributes || []));

    const links = flatArray(ptSection.links || []);
    const files = flatArray(ptSection.files || []);
    const allSections = flatArray(ptSection.subsections || []);
    const featureSections = authors2Contacts(allSections.filter(section => !hasSubsections(section)));

    const features: FeatureData[] = [];
    if (links.length > 0) {
        features.push(<FeatureData> {
            type: 'Link',
            entries: links.map(lnk => LinksUtils.toUntyped(lnk))
                .map(attrs => ptAttributes2AttributeData(attrs))
        });
    }

    if (files.length > 0) {
        features.push(<FeatureData> {
            type: 'File',
            entries: files.map(file =>
                [<PtAttribute>{name: 'Path', value: file.path}].concat(file.attributes || []))
                .map(attrs => ptAttributes2AttributeData(attrs))
        });
    }

    if (featureSections.length > 0) {
        const featureTypes = Object.keys(featureSections.map(s => s.type).reduce((rv, t) => {
            rv[t] = t;
            return rv
        }, {}));
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
    return ((section.subsections || []).length > 0) ||
        ((section.links || []).length > 0) ||
        ((section.files || []).length > 0);
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
    return array.map(t => Array.isArray(t) ? t : [t]).reduce((rv, ar) => {
        rv = rv.concat(ar);
        return rv;
    }, [])
}