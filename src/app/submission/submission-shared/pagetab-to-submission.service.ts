import {
  AttrExceptions,
  PageTab,
  PageTabSection,
  PtAttribute,
  PtFile,
  PtLink,
  authorsToContacts,
  findAttributesByName,
  mergeAttributes,
  pageTabToSubmissionProtocols
} from './model/pagetab';
import { AttributeData, SectionData, Submission, SubmissionData, TableData } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SectionType, SubmissionType } from './model/templates';
import { FieldType, SelectValueType, ValueTypeName } from './model/templates/submission-type.model';
import { NameAndValue, PAGE_TAG, Tag } from './model/model.common';
import { arrayUniqueValues, flatArray } from 'app/utils/array.utils';
import { isDefinedAndNotEmpty, isStringDefined } from 'app/utils/validation.utils';

import { Injectable } from '@angular/core';
import { findAttribute } from './utils/pagetab.utils';
import { isArrayEmpty } from 'app/utils/validation.utils';
import { toUntyped } from './utils/link.utils';
import { AttributeNames } from './../utils/constants';

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
      attributes: this.pageTabAttributesToAttributeData(pageTab.attributes || []),
      section: pageTab.section
        ? this.pageTabSectionToSectionData(pageTab.section, pageTab.attributes, sectionType)
        : undefined
    } as SubmissionData;
  }

  private findSubmissionTemplateName(pageTab: PageTab): string {
    let templateName = DEFAULT_TEMPLATE_NAME;
    const templateAttribute: PtAttribute[] = findAttribute(pageTab, AttributeNames.TEMPLATE);

    if (templateAttribute.length > 0) {
      templateName = (templateAttribute[0].value as string) || '';
    } else {
      const attachToAttributes: PtAttribute[] = findAttribute(pageTab, AttributeNames.ATTACH_TO);
      const attachToValue: string[] = attachToAttributes.map((attribute) => (attribute.value as string) || '');

      if (attachToValue.length && attachToValue[0] === 'BioImages') {
        templateName = 'BioImages.implicit.v0';
      } else {
        templateName = attachToValue.length === 0 ? DEFAULT_TEMPLATE_NAME : attachToValue[0];
      }
    }

    return templateName;
  }

  private hasSubsections(section: PageTabSection): boolean {
    const hasSubsection = typeof section.subsections !== 'undefined' && section.subsections.length > 0;
    const hasLinks = typeof section.links !== 'undefined' && section.links.length > 0;
    const hasFiles = typeof section.files !== 'undefined' && section.files.length > 0;
    const sectionTags = section.tags === undefined ? [] : Array.from(section.tags);
    const hasPageTag = sectionTags
      .map((tagItem) => new Tag(tagItem.classifier, tagItem.tag))
      .some((tagInstance) => tagInstance.equals(PAGE_TAG));

    const pagetabSectionTypes = [
      'Study Component',
      'Biosample',
      'Specimen',
      'Image acquisition',
      'Image correlation',
      'Image analysis',
      'MINSEQE Score',
      'MIAME Score'
    ].map((el) => el.toLowerCase());
    const hasSectionType = pagetabSectionTypes.includes(section.type!.toLowerCase());

    return hasSubsection || hasLinks || hasFiles || hasPageTag || hasSectionType;
  }

  private attributeToAttributeData(attr: PtAttribute): AttributeData {
    const attrData = {
      name: attr.name || '',
      valqual: (attr.valqual || []).map((t) => new NameAndValue(t.name, t.value)),
      value: attr.value as string
    } as AttributeData;
    if (attr.reference || attr.isReference) {
      attrData.reference = true;
    }
    return attrData;
  }

  private pageTabStudyAttributesToAttributesData(
    attrs: PtAttribute[],
    sectionType: SectionType | null
  ): AttributeData[] {
    if (sectionType === null) {
      return this.pageTabAttributesToAttributeData(attrs);
    }

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

  private pageTabAttributesToAttributeData(attrs: PtAttribute[]): AttributeData[] {
    return attrs.map((attr) => this.attributeToAttributeData(attr));
  }

  private pageTabSectionToSectionData(
    ptSection: PageTabSection,
    parentAttributes: PtAttribute[] = [],
    sectionType: SectionType | null
  ): SectionData {
    const parentAttributesWithName = parentAttributes.filter((attribute) => isStringDefined(attribute.name));
    const editableParentAttributes = parentAttributesWithName.filter((attribute) =>
      AttrExceptions.editable.includes(attribute.name!)
    );
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, ptSection.attributes || []);
    const attributes = this.pageTabStudyAttributesToAttributesData(parentAndChildAttributes, sectionType);
    const links = flatArray<PtLink>(ptSection.links || []);
    const files = flatArray<PtFile>(ptSection.files || []);
    const subsections = flatArray(ptSection.subsections || []);
    const contacts = authorsToContacts(subsections.filter((section) => !this.hasSubsections(section)));
    const tableSections = pageTabToSubmissionProtocols(contacts);
    const keywords = findAttributesByName('Keyword', ptSection.attributes || []);

    const tables: TableData[] = [];
    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;
    const hasTableSections = tableSections.length > 0;
    const hasKeywords = keywords.length > 0;

    if (hasLinks) {
      tables.push({
        type: 'Link',
        entries: links
          .map((link) => toUntyped(link))
          .map((link) => this.pageTabStudyAttributesToAttributesData(link, null))
      } as TableData);
    }

    if (hasFiles) {
      tables.push({
        type: 'File',
        entries: files
          .map((file) => [{ name: 'File', value: file.path } as PtAttribute].concat(file.attributes || []))
          .map((file) => this.pageTabStudyAttributesToAttributesData(file, null))
      } as TableData);
    }

    if (hasKeywords) {
      tables.push({
        type: 'Keywords',
        entries: keywords.map((keyword) => [{ name: 'Keyword', value: keyword.value } as PtAttribute])
      } as TableData);
    }

    if (hasTableSections) {
      const allTableTypes = tableSections
        .filter((tableSection) => isDefinedAndNotEmpty(tableSection.type))
        .map((tableSection) => tableSection.type);
      const tableTypes = arrayUniqueValues(allTableTypes);

      tableTypes.forEach((tableType) => {
        const entries = tableSections
          .filter((tableSection) => tableSection.type === tableType)
          .map((tableSection) => this.pageTabStudyAttributesToAttributesData(tableSection.attributes || [], null));

        tables.push({
          type: tableType,
          entries
        } as TableData);
      });
    }

    const formattedSections = subsections
      .filter(this.hasSubsections)
      .map((section) =>
        this.pageTabSectionToSectionData(
          section,
          [],
          sectionType?.sectionTypes.find((secType) => secType.name === section.type) || null
        )
      );

    const formattedSubSections = subsections
      .filter((section) => section.type !== 'Protocol')
      .map((subSection) =>
        this.pageTabSectionToSectionData(
          subSection,
          [],
          sectionType?.sectionTypes.find((secType) => secType.name === subSection.type) || null
        )
      );

    return {
      type: ptSection.type,
      accno: ptSection.accno,
      attributes,
      tables,
      sections: formattedSections,
      subsections: formattedSubSections
    } as SectionData;
  }
}
