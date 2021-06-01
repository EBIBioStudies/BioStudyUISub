import { PAGE_TAG, Tag } from './model/model.common';
import {
  AttrExceptions,
  LinksUtils,
  PageTab,
  PageTabSection,
  PtAttribute,
  PtFile,
  PtFileItem,
  PtLink,
  PtLinkItem,
  contactsToAuthors,
  mergeAttributes,
  submissionToPageTabProtocols
} from './model/pagetab';
import { isArrayEmpty, isStringDefined, isEqualIgnoringCase, isAttributeEmpty, isDefinedAndNotEmpty } from 'app/utils';
import { AttributeData, Table, Field, Fields, Section, Submission } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { Injectable } from '@angular/core';

const isFileType = (type: string) => isEqualIgnoringCase(type, 'file');
const isLinkType = (type: string) => isEqualIgnoringCase(type, 'link');
const isLibraryFileType = (type: string) => isEqualIgnoringCase(type, 'libraryfile');
const isKeywordType = (type: string) => isEqualIgnoringCase(type, 'keywords');

@Injectable()
export class SubmissionToPageTabService {
  newPageTab(templateName: string = DEFAULT_TEMPLATE_NAME): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = this.submissionToPageTab(subm);

    // Guarantees that for non-default templates, an AttachTo attribute always exists.
    // NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (templateName && templateName !== DEFAULT_TEMPLATE_NAME) {
      pageTab.attributes = mergeAttributes(pageTab.attributes || [], [
        {
          name: AttrExceptions.attachToAttr,
          value: templateName
        }
      ]);
    }
    return pageTab;
  }

  submissionToPageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    const sectionAttributes: PtAttribute[] = this.extractSectionAttributes(subm.section, isSanitise).filter(
      (at: PtAttribute) => {
        return at.name && AttrExceptions.editable.includes(at.name) && !isAttributeEmpty(at);
      }
    );

    return {
      type: 'Submission',
      accno: subm.accno,
      section: this.sectionToPtSection(subm.section, isSanitise),
      tags: subm.tags.tags,
      accessTags: subm.tags.accessTags,
      attributes: mergeAttributes(
        subm.attributes.map((at) => this.attributeDataToPtAttribute(at)),
        sectionAttributes
      )
    } as PageTab;
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

  private attributesAsFile(attributes: PtAttribute[]): PtFile {
    const isPathAttr = (at: PtAttribute) => isStringDefined(at.name) && isEqualIgnoringCase(at.name!, 'file');
    const attr = attributes.find((at) => isPathAttr(at));
    const attrs = attributes.filter((at) => !isPathAttr(at) && !isAttributeEmpty(at));

    return { path: attr && attr.value, attributes: attrs } as PtFile;
  }

  private attributesAsLink(attributes: PtAttribute[]): PtLink {
    return LinksUtils.toTyped(attributes);
  }

  private extractTableAttributes(table: Table, isSanitise: boolean): PtAttribute[][] {
    const mappedTables: PtAttribute[][] = table.rows.map((row) => {
      const attributes: PtAttribute[] = table.columns.map((column) => {
        const rowValue = row.valueFor(column.id);

        return { name: column.name, value: rowValue && rowValue.value } as PtAttribute;
      });

      return attributes.filter((attr) => (isSanitise && !isAttributeEmpty(attr)) || !isSanitise);
    });

    return mappedTables.filter((mappedTable) => mappedTable.length > 0);
  }

  private extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    const keywordsTable: Table | undefined = section.tables.list().find((table) => table.typeName === 'Keywords');
    let keywordsAsAttributes: PtAttribute[] = [];

    if (keywordsTable !== undefined) {
      const attributes: PtAttribute[][] = this.extractTableAttributes(keywordsTable, isSanitise);

      if (attributes.length > 0) {
        keywordsAsAttributes = attributes.map((column) => column.pop() as PtAttribute);
      }
    }

    return ([] as Array<PtAttribute>).concat(
      this.fieldsAsAttributes(section, isSanitise),
      this.extractTableAttributes(section.annotations, isSanitise).pop() || [],
      keywordsAsAttributes
    );
  }

  private extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const table = section.tables.list().find((f) => isFileType(f.typeName));

    if (table !== undefined) {
      const tableAttributes: PtAttribute[][] = this.extractTableAttributes(table, isSanitise);
      const fileAttributes: PtFile[] = tableAttributes.map((attrs) => this.attributesAsFile(attrs));

      return fileAttributes.filter((attr) => isDefinedAndNotEmpty(attr.path));
    }

    return [];
  }

  private extractSectionLibraryFile(section: Section): string | undefined {
    const table = section.tables.list().find((f) => isLibraryFileType(f.typeName));
    if (table !== undefined && !table.isEmpty) {
      const tableRowValue = table.rows[0].values()[0];

      return tableRowValue ? tableRowValue.value : undefined;
    }

    return undefined;
  }

  private extractSectionLinks(section: Section, isSanitise: boolean): PtLinkItem[] {
    const table = section.tables.list().find((f) => isLinkType(f.typeName));

    if (table !== undefined) {
      const tableAttributes: PtAttribute[][] = this.extractTableAttributes(table, isSanitise);
      const linkAttributes: PtLink[] = tableAttributes.map((attrs) => this.attributesAsLink(attrs));

      return linkAttributes.filter((attr) => isDefinedAndNotEmpty(attr.url));
    }

    return [];
  }

  private extractSectionSubsections(section: Section, isSanitize: boolean): PageTabSection[] {
    const validTables = section.tables
      .list()
      .filter(
        (table) =>
          !isFileType(table.typeName) &&
          !isLinkType(table.typeName) &&
          !isLibraryFileType(table.typeName) &&
          !isKeywordType(table.typeName)
      );

    const tableToPageTabSection = (table) => {
      const tableAttributes = this.extractTableAttributes(table, isSanitize);

      return tableAttributes.map((attrs) => {
        return {
          type: table.typeName,
          attributes: attrs.filter((attr) => !isAttributeEmpty(attr))
        } as PageTabSection;
      });
    };

    const tableAttributesAsPageTabSection = validTables
      .map(tableToPageTabSection)
      .reduce((rv, el) => rv.concat(el), []);

    const authorsSections = contactsToAuthors(tableAttributesAsPageTabSection);
    const protocolSections = submissionToPageTabProtocols(authorsSections);

    return protocolSections.concat(section.sections.list().map((s) => this.sectionToPtSection(s, isSanitize)));
  }

  private fieldAsAttribute(field: Field, displayType?: string): PtAttribute {
    if (displayType) {
      return {
        name: field.name,
        value: field.value,
        valqual: [{ name: 'display', value: displayType }]
      } as PtAttribute;
    }

    return { name: field.name, value: field.value } as PtAttribute;
  }

  private fieldsAsAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    const fields: Field[] = section.fields.list();
    const attributes: PtAttribute[] = [];

    fields.forEach((field) => {
      if (field.valueType.isRich()) {
        const fieldValue: string = field.value || '';
        const [richValue] = fieldValue.split('@');

        attributes.push(this.fieldAsAttribute({ name: field.name, value: richValue } as Field, 'html'));
      } else if (Array.isArray(field.value)) {
        field.value.forEach((value) => {
          attributes.push(this.fieldAsAttribute({ name: field.name, value } as Field));
        });
      } else {
        attributes.push({ name: field.name, value: field.value } as Field);
      }
    });

    return attributes.filter((attr) => (isSanitise && !isAttributeEmpty(attr)) || !isSanitise);
  }

  private sectionToPtSection(section: Section, isSanitise: boolean = false): PageTabSection {
    return {
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: this.extractSectionAttributes(section, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isAttributeEmpty(at)
      ),
      files: this.extractSectionFiles(section, isSanitise),
      libraryFile: this.extractSectionLibraryFile(section),
      links: this.extractSectionLinks(section, isSanitise),
      subsections: this.extractSectionSubsections(section, isSanitise),
      tags: this.withPageTag(section.tags.tags),
      type: section.typeName
    } as PageTabSection;
  }

  private withPageTag(tags: Tag[]): Tag[] {
    if (tags.find((t) => t.value === PAGE_TAG.value) !== undefined) {
      return tags;
    }
    return [...tags, ...[PAGE_TAG]];
  }
}
