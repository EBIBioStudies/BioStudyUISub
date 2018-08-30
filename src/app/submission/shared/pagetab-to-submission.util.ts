import {AttributeData, FeatureData, SectionData, Submission, SubmissionData} from './submission.model';
import {PageTab, PtAttribute, PtSection} from './pagetab.model';
import {authors2Contacts} from './pagetab-authors.utils';

export function pageTab2Submission(pageTab: PageTab): SubmissionData {
    return <SubmissionData>{
        accno: pageTab.accno,
        isRevised: pageTab.isRevised,
        tags: pageTab.tags,
        accessTags: pageTab.accessTags,
        section: ptSection2Section(pageTab.section, pageTab.attributes)
    };
}

function ptSection2Section(ptSection: PtSection, parentAttributes: PtAttribute[] = []): SectionData {

    const attributes = (<AttributeData[]>[]).concat(
        ptAttributes2Attributes(ptSection.attributes || []),
        ptAttributes2Attributes(parentAttributes, true));

    const links = flatArray(ptSection.links || []);
    const files = flatArray(ptSection.files || []);
    const allSections = flatArray(ptSection.sections || []);
    const featureSections = authors2Contacts(allSections.filter(section => !hasSubsections(section)));

    const features: FeatureData[] = [];
    if (links.length > 0) {
        features.push(<FeatureData> {
            type: 'Link',
            entries: links.map(lnk => ptAttributes2Attributes(lnk.attributes || []))
        })
    }

    if (files.length > 0) {
        features.push(<FeatureData> {
            type: 'File',
            entries: files.map(file => ptAttributes2Attributes(file.attributes || []))
        })
    }

    if (featureSections.length > 0) {
        const featureTypes = Object.keys(featureSections.map(s => s.type).reduce((rv, t) => {
            rv[t] = t;
            return rv
        }, {}));
        featureTypes.forEach(type => {
            const entries =
                featureSections.filter(section => section.type === type).map(section => ptAttributes2Attributes(section.attributes || []))
            features.push(<FeatureData>{
                type: type,
                entries: entries
            });
        });
    }

    const sections: SectionData[] =
        allSections
            .filter(section => hasSubsections(section))
            .map(section => ptSection2Section(section));

    return <SectionData> {
        type: ptSection.type,
        accno: ptSection.accno,
        attributes: attributes,
        features: features,
        sections: sections
    }
}

function hasSubsections(section: PtSection): boolean {
    return ((section.sections || []).length > 0) ||
        ((section.links || []).length > 0) ||
        ((section.files || []).length > 0);
}

function ptAttributes2Attributes(attrs: PtAttribute[], rootLevel: boolean = false): AttributeData[] {
    return attrs.map(at => <AttributeData>{
        name: at.name,
        value: at.value,
        reference: at.isReference,
        terms: at.valqual,
        rootLevel: rootLevel
    });
}

function flatArray<T>(array: (T | T[])[]): T[] {
    return array.map(t => Array.isArray(t) ? t : [t]).reduce((rv, ar) => {
        rv = rv.concat(ar);
        return rv;
    }, [])
}