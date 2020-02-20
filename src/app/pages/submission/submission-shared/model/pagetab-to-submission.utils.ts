import {
  AttrExceptions,
  LinksUtils,
  PageTab,
  PageTabSection,
  PtAttribute,
  authors2Contacts,
  extractKeywordsFromAttributes,
  mergeAttributes,
  pageTabToSubmissionProtocols,
} from './pagetab';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './templates';
import { AttributeData, FeatureData, SectionData, Submission, SubmissionData } from './submission';
import { NameAndValue, PAGE_TAG, Tag } from './model.common';
import { findAttribute } from '../utils/pagetab.utils';

function findSubmissionTemplateName(pageTab: PageTab): string {
  const attachToAttributes: PtAttribute[] = findAttribute(pageTab, AttrExceptions.attachToAttr);
  const attachToValue: string[] = attachToAttributes.map((attribute) => attribute.value!);

  return attachToValue.length === 1 ? attachToValue[0] : DEFAULT_TEMPLATE_NAME;
}

export function pageTab2Submission(pageTab: PageTab): Submission {
  const submissionTemplateName: string = findSubmissionTemplateName(pageTab);
  const type: SubmissionType = SubmissionType.fromTemplate(submissionTemplateName);

  return new Submission(type, pageTab2SubmissionData(pageTab));
}

export function pageTab2SubmissionData(pageTab: PageTab): SubmissionData {
  return <SubmissionData>{
    accno: pageTab.accno,
    tags: (pageTab.tags || []).map(t => new Tag(t.classifier, t.tag)),
    isRevised: !(pageTab.tags || []).isEmpty(),
    accessTags: pageTab.accessTags,
    attributes: pageTabAttributesToAttributeData(pageTab.attributes || []),
    section: pageTab.section ? pageTabSectionToSectionData(pageTab.section, pageTab.attributes) : undefined
  };
}

function pageTabSectionToSectionData(ptSection: PageTabSection, parentAttributes: PtAttribute[] = []): SectionData {
  const parentAttributesWithName = parentAttributes.filter((attribute) => String.isDefined(attribute.name));
  const editableParentAttributes = parentAttributesWithName.filter((attribute) => AttrExceptions.editable.includes(attribute.name!));
  const parentAndChildAttributes = mergeAttributes(editableParentAttributes, ptSection.attributes || []);
  const attributes = pageTabAttributesToAttributeData(parentAndChildAttributes);

  const links = flatArray(ptSection.links || []);
  const files = flatArray(ptSection.files || []);
  const subsections = flatArray(ptSection.subsections || []);
  const contacts = authors2Contacts(subsections.filter(section => !hasSubsections(section)));
  const featureSections = pageTabToSubmissionProtocols(contacts);
  const keywords = extractKeywordsFromAttributes(ptSection.attributes || []);

  const features: FeatureData[] = [];
  const hasLinks = links.length > 0;
  const hasFiles = files.length > 0;
  const hasFeatureSections = featureSections.length > 0;
  const hasLibraryFile = String.isDefinedAndNotEmpty(ptSection.libraryFile);
  const hasKeywords = keywords.length > 0;

  if (hasLinks) {
    features.push(<FeatureData> {
      type: 'Link',
      entries: links
        .map((link) => LinksUtils.toUntyped(link))
        .map((link) => pageTabAttributesToAttributeData(link))
    });
  }

  if (hasFiles) {
    features.push(<FeatureData> {
      type: 'File',
      entries: files
        .map((file) => [<PtAttribute>{ name: 'Path', value: file.path }].concat(file.attributes || []))
        .map((file) => pageTabAttributesToAttributeData(file))
    });
  }

  if (hasLibraryFile) {
    features.push(<FeatureData> {
      type: 'LibraryFile',
      entries: [[<PtAttribute>{ name: 'Path', value: ptSection.libraryFile }]]
    });
  }

  if (hasKeywords) {
    features.push(<FeatureData> {
      type: 'Keywords',
      entries: keywords.map((keyword) => [<PtAttribute>{ name: 'Keyword', value: keyword.value }])
    });
  }

  if (hasFeatureSections) {
    const featureTypes = featureSections
      .filter((featureSection) => String.isDefinedAndNotEmpty(featureSection.type))
      .map((featureSection) => featureSection.type)
      .uniqueValues();

    featureTypes.forEach((featureType) => {
      const entries = featureSections
        .filter((featureSection) => (featureSection.type === featureType))
        .map((featureSection) => pageTabAttributesToAttributeData(featureSection.attributes || []));

      features.push(<FeatureData>{
        type: featureType,
        entries: entries
      });
    });
  }

  const formattedSections = subsections
    .filter(hasSubsections)
    .map((section) => pageTabSectionToSectionData(section));

  const formattedSubSections = subsections
    .filter((section) => section.type !== 'Protocol')
    .map((subSection) => pageTabSectionToSectionData(subSection));

  return <SectionData> {
    type: ptSection.type,
    accno: ptSection.accno,
    attributes: attributes,
    features: features,
    sections: formattedSections,
    subsections: formattedSubSections
  };
}

function hasSubsections(section: PageTabSection): boolean {
  const hasSubsection = typeof section.subsections !== 'undefined' && section.subsections.length > 0;
  const hasLinks = typeof section.links !== 'undefined' && section.links.length > 0;
  const hasFiles = typeof section.files !== 'undefined' && section.files.length > 0;
  const hasLibraryFile = typeof section.libraryFile !== 'undefined' && section.libraryFile.length > 0;
  const sectionTags = section.tags === undefined ? [] : Array.from(section.tags);
  const hasPageTag = sectionTags
    .map((tagItem) => new Tag(tagItem.classifier, tagItem.tag))
    .some((tagInstance) => tagInstance.equals(PAGE_TAG));

  return hasSubsection || hasLinks || hasFiles || hasLibraryFile || hasPageTag;
}

function pageTabAttributesToAttributeData(attrs: PtAttribute[]): AttributeData[] {
  return attrs.map(at => <AttributeData>{
    name: at.name,
    reference: at.reference || at.isReference,
    terms: (at.valqual || []).map(t => new NameAndValue(t.name, t.value)),
    value: at.value
  });
}

function flatArray<T>(array: (T | T[])[]): T[] {
  const elements = Array.isArray(array) ? array : new Array(array);

  return elements
    .map((element) => Array.isArray(element) ? element : [element])
    .reduce((previousElement, currentElement) => [...currentElement, ...previousElement], <T[]>[])
    .reverse();
}
