import { Injectable } from '@angular/core';
import { flatArray } from 'app/utils/array.utils';
import {
  AttrExceptions,
  LinksUtils,
  PageTab,
  PageTabSection,
  PtAttribute,
  authorsToContacts,
  extractKeywordsFromAttributes,
  mergeAttributes,
  pageTabToSubmissionProtocols,
  PtLink,
  PtFile,
} from './model/pagetab';
import { AttributeData, FeatureData, SectionData, Submission, SubmissionData } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, READONLY_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { NameAndValue, PAGE_TAG, Tag } from './model/model.common';
import { findAttribute } from './utils/pagetab.utils';

@Injectable()
export class PageTabToSubmissionService {
  pageTab2Submission(pageTab: PageTab): Submission {
    const submissionTemplateName: string = this.findSubmissionTemplateName(pageTab);
    const type: SubmissionType = SubmissionType.fromTemplate(submissionTemplateName);

    return new Submission(type, this.pageTabToSubmissionData(pageTab));
  }

  pageTabToSubmissionData(pageTab: PageTab): SubmissionData {
    return {
      accno: pageTab.accno,
      tags: (pageTab.tags || []).map(t => new Tag(t.classifier, t.tag)),
      isRevised: !(pageTab.tags || []).isEmpty(),
      accessTags: pageTab.accessTags,
      attributes: this.pageTabAttributesToAttributeData(pageTab.attributes || []),
      section: pageTab.section ? this.pageTabSectionToSectionData(pageTab.section, pageTab.attributes) : undefined
    } as SubmissionData;
  }

  private findSubmissionTemplateName(pageTab: PageTab): string {
    const attachToAttributes: PtAttribute[] = findAttribute(pageTab, AttrExceptions.attachToAttr);
    const attachToValue: string[] = attachToAttributes.map((attribute) => attribute.value || '');

    if (attachToValue.length === 0) {
      return DEFAULT_TEMPLATE_NAME;
    }

    if (attachToValue.length === 1) {
      return attachToValue[0];
    }

    return READONLY_TEMPLATE_NAME;
  }

  private hasSubsections(section: PageTabSection): boolean {
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

  private pageTabAttributesToAttributeData(attrs: PtAttribute[]): AttributeData[] {
    return attrs.map(at => ({
      name: at.name,
      reference: at.reference || at.isReference,
      terms: (at.valqual || []).map(t => new NameAndValue(t.name, t.value)),
      value: at.value
    }) as AttributeData);
  }

  private pageTabSectionToSectionData(ptSection: PageTabSection, parentAttributes: PtAttribute[] = []): SectionData {
    const parentAttributesWithName = parentAttributes.filter((attribute) => String.isDefined(attribute.name));
    const editableParentAttributes = parentAttributesWithName.filter((attribute) => attribute.name && AttrExceptions.editable.includes(attribute.name));
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, ptSection.attributes || []);
    const attributes = this.pageTabAttributesToAttributeData(parentAndChildAttributes);

    const links = flatArray<PtLink>(ptSection.links || []);
    const files = flatArray<PtFile>(ptSection.files || []);
    const subsections = flatArray(ptSection.subsections || []);
    const contacts = authorsToContacts(subsections.filter(section => !this.hasSubsections(section)));
    const featureSections = pageTabToSubmissionProtocols(contacts);
    const keywords = extractKeywordsFromAttributes(ptSection.attributes || []);

    const features: FeatureData[] = [];
    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;
    const hasFeatureSections = featureSections.length > 0;
    const hasLibraryFile = String.isDefinedAndNotEmpty(ptSection.libraryFile);
    const hasKeywords = keywords.length > 0;

    if (hasLinks) {
      features.push({
        type: 'Link',
        entries: links
          .map((link) => LinksUtils.toUntyped(link))
          .map((link) => this.pageTabAttributesToAttributeData(link))
      } as FeatureData);
    }

    if (hasFiles) {
      features.push({
        type: 'File',
        entries: files
          .map((file) => [{ name: 'Path', value: file.path } as PtAttribute].concat(file.attributes || []))
          .map((file) => this.pageTabAttributesToAttributeData(file))
      } as FeatureData);
    }

    if (hasLibraryFile) {
      features.push({
        type: 'LibraryFile',
        entries: [[{ name: 'Path', value: ptSection.libraryFile } as PtAttribute]]
      } as FeatureData);
    }

    if (hasKeywords) {
      features.push({
        type: 'Keywords',
        entries: keywords.map((keyword) => [{ name: 'Keyword', value: keyword.value } as PtAttribute])
      } as FeatureData);
    }

    if (hasFeatureSections) {
      const featureTypes = featureSections
        .filter((featureSection) => String.isDefinedAndNotEmpty(featureSection.type))
        .map((featureSection) => featureSection.type)
        .uniqueValues();

      featureTypes.forEach((featureType) => {
        const entries = featureSections
          .filter((featureSection) => (featureSection.type === featureType))
          .map((featureSection) => this.pageTabAttributesToAttributeData(featureSection.attributes || []));

        features.push({
          type: featureType,
          entries
        } as FeatureData);
      });
    }

    const formattedSections = subsections
      .filter(this.hasSubsections)
      .map((section) => this.pageTabSectionToSectionData(section));

    const formattedSubSections = subsections
      .filter((section) => section.type !== 'Protocol')
      .map((subSection) => this.pageTabSectionToSectionData(subSection));

    return {
      type: ptSection.type,
      accno: ptSection.accno,
      attributes,
      features,
      sections: formattedSections,
      subsections: formattedSubSections
    } as SectionData;
  }
}
