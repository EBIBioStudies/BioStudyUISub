import { SelectValueType, ValueTypeName, FieldType, SectionType } from './model/templates/submission-type.model';
import { Injectable } from '@angular/core';
import { isDefinedAndNotEmpty, isArrayEmpty, arrayUniqueValues, isStringDefined } from 'app/utils';
import { authorsToContacts, mergeAttributes, pageTabToSubmissionProtocols } from './model/pagetab';
import { AttributeData, SectionData, Submission, SubmissionData, TableData } from './model/submission';
import { SubmissionType } from './model/templates';
import { NameAndValue, SubmissionTag } from './model/model.common';
import { findSubmissionTemplateName } from './utils/template.utils';
import {
  ExtSubmissionType,
  ExtSectionType,
  ExtAttributeType
} from 'app/submission/submission-shared/model/ext-submission-types';
import { AttributeType } from './model/submission-common-types';
import { AttrExceptions, filterAttributesByName } from './utils/attribute.utils';
import { toUntyped } from './utils/link.utils';

@Injectable()
export class PageTabToSubmissionService {
  pageTab2Submission(pageTab: ExtSubmissionType): Submission {
    const submissionTemplateName: string = findSubmissionTemplateName(pageTab.collections);
    const type: SubmissionType = SubmissionType.fromTemplate(submissionTemplateName);

    return new Submission(type, this.pageTabToSubmissionData(pageTab, type.sectionType));
  }

  pageTabToSubmissionData(pageTab: ExtSubmissionType, sectionType: SectionType): SubmissionData {
    return {
      accno: pageTab.accNo,
      tags: (pageTab.tags || []).map((t) => new SubmissionTag(t.name, t.value)),
      isRevised: !isArrayEmpty(pageTab.tags || []),
      accessTags: pageTab.accessTags,
      attributes: this.pageTabAttributesToAttributeData(pageTab.attributes || []),
      section: pageTab.section
        ? this.pageTabSectionToSectionData(pageTab.section, pageTab.attributes, sectionType)
        : undefined
    } as SubmissionData;
  }

  private hasSubsections(section: ExtSectionType): boolean {
    const hasSubsection = section.sections !== undefined && section.sections.length > 0;
    const hasLinks = section.links !== undefined && section.links.length > 0;
    const hasFiles = section.files !== undefined && section.files.length > 0;
    const hasLibraryFile = section.fileList !== undefined && section.fileList !== null;
    // const sectionTags = section.tags === undefined ? [] : Array.from(section.tags);
    // const hasPageTag = sectionTags
    //   .map((tagItem) => new SubmissionTag(tagItem.classifier, tagItem.tag))
    //   .some((tagInstance) => tagInstance.equals(PAGE_TAG));

    return hasSubsection || hasLinks || hasFiles || hasLibraryFile; // || hasPageTag;
  }

  private attributeToAttributeData(attr: ExtAttributeType): AttributeData {
    return {
      name: attr.name || '',
      reference: attr.reference,
      terms: (attr.valueAttrs || []).map((t) => new NameAndValue(t.name, t.value)),
      value: attr.value
    };
  }

  private pageTabStudyAttributesToAttributesData(attrs: ExtAttributeType[], sectionType: SectionType): AttributeData[] {
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

  private pageTabAttributesToAttributeData(attrs: ExtAttributeType[]): AttributeData[] {
    return attrs.map((attr) => this.attributeToAttributeData(attr));
  }

  private pageTabSectionToSectionData(
    ptSection: ExtSectionType,
    parentAttributes: ExtAttributeType[] = [],
    sectionType: SectionType | null
  ): SectionData {
    const { accNo, attributes = [], links = [], files = [], fileList, type } = ptSection;
    const parentAttributesWithName = parentAttributes.filter((attribute) => isStringDefined(attribute.name));
    const editableParentAttributes = parentAttributesWithName.filter((attribute) =>
      AttrExceptions.editable.includes(attribute.name!)
    );
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, attributes);
    const attributesData = sectionType
      ? this.pageTabStudyAttributesToAttributesData(parentAndChildAttributes, sectionType)
      : this.pageTabAttributesToAttributeData(parentAndChildAttributes);

    const subsections = ptSection.sections || [];
    const contacts = authorsToContacts(subsections.filter((section) => !this.hasSubsections(section)));
    const tableSections = pageTabToSubmissionProtocols(contacts);
    const keywords = filterAttributesByName('Keyword', attributes);

    const tables: TableData[] = [];
    const hasLinks = links.length > 0;
    const hasFiles = files.length > 0;
    const hasTableSections = tableSections.length > 0;
    const hasFileList = fileList !== undefined && fileList !== null;
    const hasKeywords = keywords.length > 0;

    if (hasLinks) {
      tables.push({
        type: 'Link',
        entries: links.map((link) => toUntyped(link)).map((link) => this.pageTabAttributesToAttributeData(link))
      } as TableData);
    }

    if (hasFiles) {
      tables.push({
        type: 'File',
        entries: files
          .map((file) => [{ name: 'File', value: file.path } as ExtAttributeType].concat(file.attributes || []))
          .map((file) => this.pageTabAttributesToAttributeData(file))
      } as TableData);
    }

    if (hasFileList) {
      tables.push({
        type: 'LibraryFile',
        entries: [[{ name: 'File', value: fileList?.fileName } as AttributeType]]
      } as TableData);
    }

    if (hasKeywords) {
      tables.push({
        type: 'Keywords',
        entries: keywords.map((keyword) => [{ name: 'Keyword', value: keyword.value } as AttributeType])
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
          .map((tableSection) => this.pageTabAttributesToAttributeData(tableSection.attributes || []));

        tables.push({
          type: tableType,
          entries
        } as TableData);
      });
    }

    const formattedSections = subsections
      .filter(this.hasSubsections)
      .map((section) => this.pageTabSectionToSectionData(section, [], null));

    return {
      type,
      accno: accNo,
      attributes: attributesData,
      tables,
      sections: formattedSections
    } as SectionData;
  }
}
