import { AttrExceptions, PageTab, PageTabSection, PtAttribute, PtFile, PtLink, mergeAttributes } from './model/pagetab';
import { AttributeData, Section, Submission, Table } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { PAGE_TAG, Tag } from './model/model.common';
import { attributesAsFile, attributesAsLink, fieldsAsAttributes } from './utils/attribute.utils';
import { isArrayEmpty, isPtAttributeValueEmpty } from 'app/utils/validation.utils';
import { tableRowToSections, tableToPtTable, tableToSectionItem } from './utils/table.utils';

import { Injectable } from '@angular/core';
import { AttributeNames, LowerCaseSectionNames } from '../utils/constants';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { partition } from 'app/utils/array.utils';

@Injectable()
export class SubmissionToPageTabService {
  newPageTab(collection?: string, templateName: string = DEFAULT_TEMPLATE_NAME): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = this.submissionToPageTab(subm);
    const attributes = [{ name: AttributeNames.TEMPLATE, value: templateName }];

    // Guarantees that for non-default templates, an AttachTo attribute always exists.
    // NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (collection) {
      attributes.push({ name: AttributeNames.ATTACH_TO, value: collection });
    }

    pageTab.attributes = mergeAttributes(pageTab.attributes || [], attributes);

    return pageTab;
  }

  submissionToPageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    const rootSectionAttributes = fieldsAsAttributes(subm.section.fields.list(), isSanitise).filter(
      (at) => at.name && AttrExceptions.editableAndRootOnly.includes(at.name) && !isPtAttributeValueEmpty(at.value)
    );

    return {
      type: 'Submission',
      accno: subm.accno,
      section: this.sectionToPtSection(subm.section, isSanitise),
      tags: subm.tags.tags,
      accessTags: subm.tags.accessTags,
      attributes: mergeAttributes(
        subm.attributes
          .filter((at) => !AttrExceptions.editableAndRootOnly.includes(at.name))
          .map((at) => this.attributeDataToPtAttribute(at)),
        rootSectionAttributes
      )
    } as PageTab;
  }

  private sectionToPtSection(
    section: Section,
    isSanitise: boolean = false,
    isSubsection: boolean = false
  ): PageTabSection {
    const [rowAsSectionTables, otherTables] = partition<Table>(
      section.tables.list(),
      (table) => table.type.rowAsSection
    );

    const [ownPropTables, tableSectionItems] = partition<Table>(rowAsSectionTables, (table) =>
      [LowerCaseSectionNames.FILE, LowerCaseSectionNames.LINK].includes(table.typeName.toLowerCase())
    );

    const [annotationTable, nonAnnotationTables] = partition<Table>(otherTables, (table) =>
      [LowerCaseSectionNames.ANNOTATIONS].includes(table.typeName.toLowerCase())
    );

    const [keywordsTable, nonKeywordsTables] = partition<Table>(nonAnnotationTables, (table) =>
      [LowerCaseSectionNames.KEYWORDS].includes(table.typeName.toLowerCase())
    );

    const keywordAttributes = this.extractAttributesFromSection(
      keywordsTable,
      isSanitise,
      LowerCaseSectionNames.KEYWORDS
    );
    const annotationAttributes = this.extractAttributesFromSection(
      annotationTable,
      isSanitise,
      LowerCaseSectionNames.ANNOTATIONS
    );

    const sectionAttributes = fieldsAsAttributes(section.fields.list(), isSanitise).filter(
      (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isPtAttributeValueEmpty(at.value)
    );

    return {
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: [...sectionAttributes, ...keywordAttributes, ...annotationAttributes],
      files: this.filesToSections(ownPropTables, isSanitise),
      links: this.linksToSections(ownPropTables, isSanitise),
      subsections: [
        ...tableToSectionItem(tableSectionItems, isSanitise, isSubsection),
        ...tableToPtTable(nonKeywordsTables, isSanitise),
        ...section.sections.list().map((s) => this.sectionToPtSection(s, isSanitise, true))
      ],
      tags: this.withPageTag(section.tags.tags),
      type: section.typeName
    } as PageTabSection;
  }

  private attributeDataToPtAttribute(attr: AttributeData): PtAttribute {
    const ptAttr = {
      name: attr.name,
      value: attr.value,
      reference: attr.reference
    } as PtAttribute;

    if (!isArrayEmpty(attr.valqual || [])) {
      ptAttr.valqual = attr.valqual!.slice();
    }

    return ptAttr;
  }

  private withPageTag(tags: Tag[]): Tag[] {
    if (tags.find((t) => t.value === PAGE_TAG.value) !== undefined) {
      return tags;
    }
    return [...tags, ...[PAGE_TAG]];
  }

  private filesToSections(tables: Table[], isSanitise: boolean): PtFile[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.FILE);

    return tableRowToSections<PtFile>(
      (rows) => [attributesAsFile(rows)],
      (attr) =>
        isDefinedAndNotEmpty(attr.path) || (attr.attributes || [])?.some((at) => !isPtAttributeValueEmpty(at.value)),
      isSanitise,
      table
    );
  }

  private extractAttributesFromSection(tables: Table[], isSanitise: boolean, sectionName: string): PtAttribute[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === sectionName.toLowerCase());

    return tableRowToSections<PtAttribute>(
      (rows) => rows,
      () => true,
      isSanitise,
      table
    );
  }

  private linksToSections(tables: Table[], isSanitise: boolean): PtLink[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.LINK);

    return tableRowToSections<PtLink>(
      (rows) => [attributesAsLink(rows)],
      (attr) => isDefinedAndNotEmpty(attr.url),
      isSanitise,
      table
    );
  }
}
