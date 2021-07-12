import { isValueEmpty } from 'app/utils/string.utils';
import { ExtAttributeType } from 'app/submission/submission-shared/model/ext-submission-types';
import { PAGE_TAG } from './model/model.common';
import {
  PageTab,
  PageTabSection,
  PtFile,
  PtFileItem,
  PtLink,
  PtLinkItem,
  contactsToAuthors,
  mergeAttributes,
  submissionToPageTabProtocols
} from './model/pagetab';
import { isArrayEmpty, isStringDefined, isEqualIgnoringCase, isDefinedAndNotEmpty } from 'app/utils';
import { AttributeData, Table, Field, Section, Submission } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { Injectable } from '@angular/core';
import { AttributeType, Tag } from './model/submission-common-types';
import { AttrExceptions } from './utils/attribute.utils';
import { toTyped } from './utils/link.utils';

const isFileType = (type: string) => isEqualIgnoringCase(type, 'file');
const isLinkType = (type: string) => isEqualIgnoringCase(type, 'link');
const isLibraryFileType = (type: string) => isEqualIgnoringCase(type, 'libraryfile');
const isKeywordType = (type: string) => isEqualIgnoringCase(type, 'keywords');

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
          value: templateName,
          reference: false
        }
      ]);
    }
    return pageTab;
  }

  submissionToPageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    const sectionAttributes: ExtAttributeType[] = this.extractSectionAttributes(subm.section, isSanitise).filter(
      (at: ExtAttributeType) => {
        return at.name && AttrExceptions.editable.includes(at.name) && !isValueEmpty(at.value);
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

  private attributeDataToPtAttribute(attr: AttributeData): ExtAttributeType {
    const ptAttr = {
      name: attr.name,
      value: attr.value,
      reference: attr.reference
    } as ExtAttributeType;

    if (!isArrayEmpty(attr.terms || [])) {
      ptAttr.valueAttrs = attr.terms!.slice();
    }

    return ptAttr;
  }

  private attributesAsFile(attributes: ExtAttributeType[]): PtFile {
    const isPathAttr = (at: ExtAttributeType) => isStringDefined(at.name) && isEqualIgnoringCase(at.name!, 'file');
    const attr = attributes.find((at) => isPathAttr(at));
    const attrs = attributes.filter((at) => !isPathAttr(at) && !isValueEmpty(at.value));

    return { path: attr && attr.value, attributes: attrs } as PtFile;
  }

  private attributesAsLink(attributes: ExtAttributeType[]): PtLink {
    return toTyped(attributes);
  }

  private extractTableAttributes(table: Table, isSanitise: boolean): AttributeType[][] {
    const mappedTables: AttributeType[][] = table.rows.map((row) => {
      const attributes: AttributeType[] = table.columns.map((column) => {
        const rowValue = row.valueFor(column.id);

        return { name: column.name, value: rowValue && rowValue.value } as AttributeType;
      });

      return attributes.filter((attr) => (isSanitise && !isValueEmpty(attr.value)) || !isSanitise);
    });

    return mappedTables.filter((mappedTable) => mappedTable.length > 0);
  }

  private extractSectionAttributes(section: Section, isSanitise: boolean): AttributeType[] {
    const keywordsTable: Table | undefined = section.tables.list().find((table) => table.typeName === 'Keywords');
    let keywordsAsAttributes: AttributeType[] = [];

    if (keywordsTable !== undefined) {
      const attributes: AttributeType[][] = this.extractTableAttributes(keywordsTable, isSanitise);

      if (attributes.length > 0) {
        keywordsAsAttributes = attributes.map((column) => column.pop() as AttributeType);
      }
    }

    return ([] as Array<AttributeType>).concat(
      this.fieldsAsAttributes(section, isSanitise),
      this.extractTableAttributes(section.annotations, isSanitise).pop() || [],
      keywordsAsAttributes
    );
  }

  private extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const table = section.tables.list().find((f) => isFileType(f.typeName));

    if (table !== undefined) {
      const tableAttributes: ExtAttributeType[][] = this.extractTableAttributes(table, isSanitise);
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
      const tableAttributes: ExtAttributeType[][] = this.extractTableAttributes(table, isSanitise);
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
          attributes: attrs.filter((attr) => !isValueEmpty(attr.value))
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

  private fieldAsAttribute(field: Field, displayType?: string): AttributeType {
    if (displayType) {
      return {
        name: field.name,
        value: field.value,
        valueAttrs: [{ name: 'display', value: displayType }]
      } as AttributeType;
    }

    return { name: field.name, value: field.value } as AttributeType;
  }

  private fieldsAsAttributes(section: Section, isSanitise: boolean): AttributeType[] {
    const fields: Field[] = section.fields.list();
    const attributes: AttributeType[] = [];

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
        attributes.push({ name: field.name, value: field.value, reference: false });
      }
    });

    return attributes.filter((attr) => (isSanitise && !isValueEmpty(attr.value)) || !isSanitise);
  }

  private sectionToPtSection(section: Section, isSanitise: boolean = false): PageTabSection {
    return {
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: this.extractSectionAttributes(section, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
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
