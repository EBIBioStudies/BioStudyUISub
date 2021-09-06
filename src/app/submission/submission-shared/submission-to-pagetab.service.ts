import { AttrExceptions, PageTab, PageTabSection, PtAttribute, PtFile, PtLink, mergeAttributes } from './model/pagetab';
import { AttributeData, Field, Section, Submission, Table } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { PAGE_TAG, Tag } from './model/model.common';
import { attributesAsFile, attributesAsLink, fieldsAsAttributes } from './utils/attribute.utils';
import { isArrayEmpty, isValueEmpty } from 'app/utils/validation.utils';
import { tableRowToSections, tableToPtTable, tableToSectionItem } from './utils/table.utils';

import { Injectable } from '@angular/core';
import { LowerCaseSectionNames } from '../utils/constants';
import { isDefinedAndNotEmpty } from 'app/utils/validation.utils';
import { partition } from 'app/utils/array.utils';

@Injectable()
export class SubmissionToPageTabService {
  newPageTab(collection?: string, templateName: string = DEFAULT_TEMPLATE_NAME): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = this.submissionToPageTab(subm);

    // Guarantees that for non-default templates, an AttachTo attribute always exists.
    // NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (collection) {
      pageTab.attributes = mergeAttributes(pageTab.attributes || [], [
        {
          name: AttrExceptions.attachToAttr,
          value: collection
        }
      ]);
    }
    return pageTab;
  }

  submissionToPageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    const rootSectionAttributes = this.extractAttributesFromSection(subm.section.fields.list(), [], isSanitise).filter(
      (at) => at.name && AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
    );

    return {
      type: 'Submission',
      accno: subm.accno,
      section: this.sectionToPtSection(subm.section, isSanitise),
      tags: subm.tags.tags,
      accessTags: subm.tags.accessTags,
      attributes: mergeAttributes(
        subm.attributes.map((at) => this.attributeDataToPtAttribute(at)),
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

    const [tableSectionItems, ownPropTables] = partition<Table>(rowAsSectionTables, (table) =>
      [LowerCaseSectionNames.FILE, LowerCaseSectionNames.LINK].includes(table.typeName.toLowerCase())
    );

    return {
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: this.extractAttributesFromSection(section.fields.list(), section.tables.list(), isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
      ),
      files: this.extractFilesFromSection(ownPropTables, isSanitise),
      links: this.extractLinksFromSection(ownPropTables, isSanitise),
      subsections: [
        ...tableToSectionItem(tableSectionItems, isSanitise, isSubsection),
        ...tableToPtTable(otherTables, isSanitise),
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

    if (!isArrayEmpty(attr.terms || [])) {
      ptAttr.valqual = attr.terms!.slice();
    }

    return ptAttr;
  }

  private withPageTag(tags: Tag[]): Tag[] {
    if (tags.find((t) => t.value === PAGE_TAG.value) !== undefined) {
      return tags;
    }
    return [...tags, ...[PAGE_TAG]];
  }

  private extractFilesFromSection(tables: Table[], isSanitise: boolean): PtFile[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.FILE);

    return tableRowToSections<PtFile>(
      (rows) => [attributesAsFile(rows)],
      (attr) => isDefinedAndNotEmpty(attr.path),
      isSanitise,
      table
    );
  }

  private extractAttributesFromSection(fields: Field[], tables: Table[], isSanitise: boolean): PtAttribute[] {
    const fieldAsAttributes = fieldsAsAttributes(fields, isSanitise);
    const keywordAttributes = this.extractKeywordsFromSection(tables, isSanitise);

    return [...fieldAsAttributes, ...keywordAttributes];
  }

  private extractKeywordsFromSection(tables: Table[], isSanitise: boolean): PtAttribute[] {
    const table = tables.find((t) =>
      [LowerCaseSectionNames.KEYWORDS, LowerCaseSectionNames.ANNOTATION].includes(t.typeName.toLowerCase())
    );

    return tableRowToSections<PtAttribute>(
      (rows) => rows,
      () => true,
      isSanitise,
      table
    );
  }

  private extractLinksFromSection(tables: Table[], isSanitise: boolean): PtLink[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.LINK);

    return tableRowToSections<PtLink>(
      (rows) => [attributesAsLink(rows)],
      (attr) => isDefinedAndNotEmpty(attr.url),
      isSanitise,
      table
    );
  }
}
