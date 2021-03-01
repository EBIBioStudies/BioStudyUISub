import { SelectValueType, ValueTypeName, FieldType } from './model/templates/submission-type.model';
import { Injectable } from '@angular/core';
import { flatArray, isDefinedAndNotEmpty, isArrayEmpty, arrayUniqueValues, isStringDefined } from 'app/utils';
import {
  AttrExceptions,
  LinksUtils,
  PageTab,
  PageTabSection,
  PtAttribute,
  authorsToContacts,
  mergeAttributes,
  pageTabToSubmissionProtocols,
  PtLink,
  PtFile,
  findAttributesByName
} from './model/pagetab';
import { AttributeData, FeatureData, SectionData, Submission, SubmissionData } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SectionType, SubmissionType } from './model/templates';
import { NameAndValue, PAGE_TAG, Tag } from './model/model.common';
import { findAttribute } from './utils/pagetab.utils';

@Injectable()
export class PageTabToSubmissionService {
  pageTab2Submission(pageTab: PageTab): Submission {
    const submissionTemplateName: string = this.findSubmissionTemplateName(pageTab);
    const type: SubmissionType = SubmissionType.fromTemplate(submissionTemplateName);

    return new Submission(type, this.pageTabToSubmissionData(pageTab, type.sectionType));
  }

  pageTabToSubmissionData(pageTab: PageTab, sectionType: SectionType): SubmissionData {
    return {
      accno: pageTab.accno,
      tags: (pageTab.tags || []).map((t) => new Tag(t.classifier, t.tag)),
      isRevised: !isArrayEmpty(pageTab.tags || []),
      accessTags: pageTab.accessTags,
      attributes: this.pageTabAttributesToAttributeData(pageTab.attributes || [], sectionType),
      section: pageTab.section
        ? this.pageTabSectionToSectionData(pageTab.section, pageTab.attributes, sectionType)
        : undefined
    } as SubmissionData;
  }

  private findSubmissionTemplateName(pageTab: PageTab): string {
    const attachToAttributes: PtAttribute[] = findAttribute(pageTab, AttrExceptions.attachToAttr);
    const attachToValue: string[] = attachToAttributes.map((attribute) => (attribute.value as string) || '');

    if (attachToValue.length === 0) {
      return DEFAULT_TEMPLATE_NAME;
    }

    return attachToValue[0];
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

  private attributeToAttributeData(attr: PtAttribute): AttributeData {
    return {
      name: attr.name || '',
      reference: attr.reference || attr.isReference,
      terms: (attr.valqual || []).map((t) => new NameAndValue(t.name, t.value)),
      value: attr.value
    };
  }

  private pageTabAttributesToAttributeData(attrs: PtAttribute[], sectionType: SectionType): AttributeData[] {
    const attributesData: AttributeData[] = [];

    const selectFieldTypes: FieldType[] = sectionType.fieldTypes.filter(({ valueType }) =>
      valueType.is(ValueTypeName.select)
    );
    const multiValueAttributeNames: string[] = selectFieldTypes
      .filter((fieldType) => (fieldType.valueType as SelectValueType).multiple)
      .map((fieldType) => fieldType.name);

    const singleValueAttributes = attrs.filter((attr) => !multiValueAttributeNames.includes(attr.name || ''));

    multiValueAttributeNames.forEach((multiValueAttributeName) => {
      const multiValueAttributes = attrs.filter(
        (attr) => attr.name === multiValueAttributeName && attr.value !== undefined
      );

      if (multiValueAttributes.length > 0) {
        const firstAttribute = multiValueAttributes[0];
        const values = multiValueAttributes.map((attr) => attr.value) as string[];

        attributesData.push(this.attributeToAttributeData({ ...firstAttribute, value: values }));
      }
    });

    singleValueAttributes.forEach((attr) => {
      attributesData.push(this.attributeToAttributeData(attr));
    });

    return attributesData;
  }

  private pageTabSectionToSectionData(
    ptSection: PageTabSection,
    parentAttributes: PtAttribute[] = [],
    sectionType: SectionType
  ): SectionData {
    const parentAttributesWithName = parentAttributes.filter((attribute) => isStringDefined(attribute.name));
    const editableParentAttributes = parentAttributesWithName.filter((attribute) =>
      AttrExceptions.editable.includes(attribute.name!)
    );
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, ptSection.attributes || []);
    const attributes = this.pageTabAttributesToAttributeData(parentAndChildAttributes, sectionType);

    const links = flatArray<PtLink>(ptSection.links || []);
    const files = flatArray<PtFile>(ptSection.files || []);
    const subsections = flatArray(ptSection.subsections || []);
    const contacts = authorsToContacts(subsections.filter((section) => !this.hasSubsections(section)));
    const featureSections = pageTabToSubmissionProtocols(contacts);
    const keywords = findAttributesByName('Keywords', ptSection.attributes || []);

    const features: FeatureData[] = [];
    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;
    const hasFeatureSections = featureSections.length > 0;
    const hasLibraryFile = isDefinedAndNotEmpty(ptSection.libraryFile);
    const hasKeywords = keywords.length > 0;

    if (hasLinks) {
      features.push({
        type: 'Link',
        entries: links
          .map((link) => LinksUtils.toUntyped(link))
          .map((link) => this.pageTabAttributesToAttributeData(link, sectionType))
      } as FeatureData);
    }

    if (hasFiles) {
      features.push({
        type: 'File',
        entries: files
          .map((file) => [{ name: 'Path', value: file.path } as PtAttribute].concat(file.attributes || []))
          .map((file) => this.pageTabAttributesToAttributeData(file, sectionType))
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
      const allFeatureTypes = featureSections
        .filter((featureSection) => isDefinedAndNotEmpty(featureSection.type))
        .map((featureSection) => featureSection.type);
      const featureTypes = arrayUniqueValues(allFeatureTypes);

      featureTypes.forEach((featureType) => {
        const entries = featureSections
          .filter((featureSection) => featureSection.type === featureType)
          .map((featureSection) => this.pageTabAttributesToAttributeData(featureSection.attributes || [], sectionType));

        features.push({
          type: featureType,
          entries
        } as FeatureData);
      });
    }

    const formattedSections = subsections
      .filter(this.hasSubsections)
      .map((section) => this.pageTabSectionToSectionData(section, [], sectionType));

    const formattedSubSections = subsections
      .filter((section) => section.type !== 'Protocol')
      .map((subSection) => this.pageTabSectionToSectionData(subSection, [], sectionType));

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
