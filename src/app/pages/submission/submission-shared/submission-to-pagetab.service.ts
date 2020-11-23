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
import { isNotDefinedOrEmpty, isArrayEmpty, isStringDefined, isEqualIgnoringCase } from 'app/utils';
import { AttributeData, Feature, Section, Submission } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { Injectable } from '@angular/core';

const isFileType = (type: string) => isEqualIgnoringCase(type, 'file');
const isLinkType = (type: string) => isEqualIgnoringCase(type, 'link');
const isLibraryFileType = (type: string) => isEqualIgnoringCase(type, 'libraryfile');
const isKeywordType = (type: string) => isEqualIgnoringCase(type, 'keywords');
const isEmptyAttr = (attr: PtAttribute) => {
  if (Array.isArray(attr.value)) {
    return attr.value.length === 0;
  }

  return isNotDefinedOrEmpty(attr.value);
};

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
        return at.name && AttrExceptions.editable.includes(at.name);
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
    const isPathAttr = (at: PtAttribute) => isStringDefined(at.name) && isEqualIgnoringCase(at.name!, 'path');
    const attr = attributes.find((at) => isPathAttr(at));
    const attrs = attributes.filter((at) => !isPathAttr(at));
    return { path: attr && attr.value, attributes: attrs } as PtFile;
  }

  private attributesAsLink(attributes: PtAttribute[]): PtLink {
    return LinksUtils.toTyped(attributes);
  }

  private extractFeatureAttributes(feature: Feature, isSanitise: boolean): PtAttribute[][] {
    const mappedFeatures: PtAttribute[][] = feature.rows.map((row) => {
      const attributes: PtAttribute[] = feature.columns.map((column) => {
        const rowValue = row.valueFor(column.id);

        return { name: column.name, value: rowValue && rowValue.value } as PtAttribute;
      });

      return attributes.filter((attr) => (isSanitise && !isEmptyAttr(attr)) || !isSanitise);
    });

    return mappedFeatures.filter((mappedFeature) => mappedFeature.length > 0);
  }

  private extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    const keywordsFeature: Feature | undefined = section.features
      .list()
      .find((feature) => feature.typeName === 'Keywords');
    let keywordsAsAttributes: PtAttribute[] = [];

    if (keywordsFeature !== undefined) {
      const attributes: PtAttribute[][] = this.extractFeatureAttributes(keywordsFeature, isSanitise);

      if (attributes.length > 0) {
        keywordsAsAttributes = attributes.map((column) => column.pop() as PtAttribute);
      }
    }

    return ([] as Array<PtAttribute>).concat(
      this.fieldsAsAttributes(section, isSanitise),
      this.extractFeatureAttributes(section.annotations, isSanitise).pop() || [],
      keywordsAsAttributes
    );
  }

  private extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const feature = section.features.list().find((f) => isFileType(f.typeName));
    if (feature !== undefined) {
      return this.extractFeatureAttributes(feature, isSanitise).map((attrs) => this.attributesAsFile(attrs));
    }
    return [];
  }

  private extractSectionLibraryFile(section: Section): string | undefined {
    const feature = section.features.list().find((f) => isLibraryFileType(f.typeName));
    if (feature !== undefined && !feature.isEmpty) {
      const featureRowValue = feature.rows[0].values()[0];

      return featureRowValue ? featureRowValue.value : undefined;
    }

    return undefined;
  }

  private extractSectionLinks(section: Section, isSanitise: boolean): PtLinkItem[] {
    const feature = section.features.list().find((f) => isLinkType(f.typeName));
    if (feature !== undefined) {
      return this.extractFeatureAttributes(feature, isSanitise).map((attrs) => this.attributesAsLink(attrs));
    }
    return [];
  }

  private extractSectionSubsections(section: Section, isSanitize: boolean): PageTabSection[] {
    const validFeatures = section.features
      .list()
      .filter(
        (feature) =>
          !isFileType(feature.typeName) &&
          !isLinkType(feature.typeName) &&
          !isLibraryFileType(feature.typeName) &&
          !isKeywordType(feature.typeName)
      );

    const featureToPageTabSection = (feature) => {
      const featureAttributes = this.extractFeatureAttributes(feature, isSanitize);

      return featureAttributes.map((attrs) => {
        return {
          type: feature.typeName,
          attributes: attrs
        } as PageTabSection;
      });
    };

    const featureAttributesAsPageTabSection = validFeatures
      .map(featureToPageTabSection)
      .reduce((rv, el) => rv.concat(el), []);

    const authorsSections = contactsToAuthors(featureAttributesAsPageTabSection);
    const protocolSections = submissionToPageTabProtocols(authorsSections);

    return protocolSections.concat(section.sections.list().map((s) => this.sectionToPtSection(s, isSanitize)));
  }

  private fieldsAsAttributes(section: Section, isSanitise: boolean): any[] {
    return section.fields
      .list()
      .map((field) => {
        if (field.valueType.isRich()) {
          const fieldValue: string = field.value || '';
          const [richValue] = fieldValue.split('@');

          return {
            name: field.name,
            value: richValue,
            valqual: [{ name: 'display', value: 'html' }]
          } as PtAttribute;
        }

        return { name: field.name, value: field.value } as PtAttribute;
      })
      .filter((attr) => (isSanitise && !isEmptyAttr(attr)) || !isSanitise);
  }

  private sectionToPtSection(section: Section, isSanitise: boolean = false): PageTabSection {
    return {
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: this.extractSectionAttributes(section, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name)
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
