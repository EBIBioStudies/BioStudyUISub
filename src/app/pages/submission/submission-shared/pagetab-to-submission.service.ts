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
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
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
    return <SubmissionData>{
      accno: pageTab.accno,
      tags: (pageTab.tags || []).map(t => new Tag(t.classifier, t.tag)),
      isRevised: !(pageTab.tags || []).isEmpty(),
      accessTags: pageTab.accessTags,
      attributes: this.pageTabAttributesToAttributeData(pageTab.attributes || []),
      section: pageTab.section ? this.pageTabSectionToSectionData(pageTab.section, pageTab.attributes) : undefined
    };
  }

  private findSubmissionTemplateName(pageTab: PageTab): string {
    const attachToAttributes: PtAttribute[] = findAttribute(pageTab, AttrExceptions.attachToAttr);
    const attachToValue: string[] = attachToAttributes.map((attribute) => attribute.value!);

    return attachToValue.length === 1 ? attachToValue[0] : DEFAULT_TEMPLATE_NAME;
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
    return attrs.map(at => <AttributeData>{
      name: at.name,
      reference: at.reference || at.isReference,
      terms: (at.valqual || []).map(t => new NameAndValue(t.name, t.value)),
      value: at.value
    });
  }

  private pageTabSectionToSectionData(ptSection: PageTabSection, parentAttributes: PtAttribute[] = []): SectionData {
    const parentAttributesWithName = parentAttributes.filter((attribute) => String.isDefined(attribute.name));
    const editableParentAttributes = parentAttributesWithName.filter((attribute) => AttrExceptions.editable.includes(attribute.name!));
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
      features.push(<FeatureData>{
        type: 'Link',
        entries: links
          .map((link) => LinksUtils.toUntyped(link))
          .map((link) => this.pageTabAttributesToAttributeData(link))
      });
    }

    if (hasFiles) {
      features.push(<FeatureData>{
        type: 'File',
        entries: files
          .map((file) => [<PtAttribute>{ name: 'Path', value: file.path }].concat(file.attributes || []))
          .map((file) => this.pageTabAttributesToAttributeData(file))
      });
    }

    if (hasLibraryFile) {
      features.push(<FeatureData>{
        type: 'LibraryFile',
        entries: [[<PtAttribute>{ name: 'Path', value: ptSection.libraryFile }]]
      });
    }

    if (hasKeywords) {
      features.push(<FeatureData>{
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
          .map((featureSection) => this.pageTabAttributesToAttributeData(featureSection.attributes || []));

        features.push(<FeatureData>{
          type: featureType,
          entries: entries
        });
      });
    }

    const formattedSections = subsections
      .filter(this.hasSubsections)
      .map((section) => this.pageTabSectionToSectionData(section));

    const formattedSubSections = subsections
      .filter((section) => section.type !== 'Protocol')
      .map((subSection) => this.pageTabSectionToSectionData(subSection));

    return <SectionData>{
      type: ptSection.type,
      accno: ptSection.accno,
      attributes: attributes,
      features: features,
      sections: formattedSections,
      subsections: formattedSubSections
    };
  }
}