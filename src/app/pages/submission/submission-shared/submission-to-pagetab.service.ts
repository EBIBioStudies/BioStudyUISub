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
  contacts2Authors,
  mergeAttributes,
  submissionToPageTabProtocols,
} from './model/pagetab';
import { AttributeData, Feature, Section, Submission } from './model/submission';
import { DEFAULT_TEMPLATE_NAME, SubmissionType } from './model/templates';
import { Injectable } from '@angular/core';

const isFileType = (type: string) => type.isEqualIgnoringCase('file');
const isLinkType = (type: string) => type.isEqualIgnoringCase('link');
const isLibraryFileType = (type: string) => type.isEqualIgnoringCase('libraryfile');
const isKeywordType = (type: string) => type.isEqualIgnoringCase('keywords');
const isEmptyAttr = (attr: PtAttribute) => String.isNotDefinedOrEmpty(attr.value);

@Injectable()
export class SubmissionToPageTabService {
  newPageTab(templateName: string = DEFAULT_TEMPLATE_NAME): PageTab {
    const subm = new Submission(SubmissionType.fromTemplate(templateName));
    const pageTab = this.submissionToPageTab(subm);

    // Guarantees that for non-default templates, an AttachTo attribute always exists.
    // NOTE: The PageTab constructor does not bother with attributes if the section is empty.
    if (templateName && templateName !== DEFAULT_TEMPLATE_NAME) {
      pageTab.attributes = mergeAttributes((pageTab.attributes || []), [{
        name: AttrExceptions.attachToAttr,
        value: templateName
      }]);
    }
    return pageTab;
  }

  submissionToPageTab(subm: Submission, isSanitise: boolean = false): PageTab {
    return <PageTab>{
      type: 'Submission',
      accno: subm.accno,
      section: this.section2PtSection(subm.section, isSanitise),
      tags: subm.tags.tags,
      accessTags: subm.tags.accessTags,
      attributes: mergeAttributes(
        subm.attributes.map(at => this.attributeData2PtAttribute(at)),
        this.extractSectionAttributes(subm.section, isSanitise)
          .filter(at => AttrExceptions.editable.includes(at.name!)))
    };
  }

  private attributeData2PtAttribute(attr: AttributeData): PtAttribute {
    const ptAttr = <PtAttribute>{
      name: attr.name,
      value: attr.value,
      reference: attr.reference
    };
    if (!(attr.terms || []).isEmpty()) {
      ptAttr.valqual = attr.terms!.slice();
    }
    return ptAttr;
  }

  private attributesAsFile(attributes: PtAttribute[]): PtFile {
    const isPathAttr = (at: PtAttribute) => String.isDefined(at.name) && at.name!.isEqualIgnoringCase('path');
    const attr = attributes.find(at => isPathAttr(at));
    const attrs = attributes.filter(at => !isPathAttr(at));
    return <PtFile>{ path: attr!.value, attributes: attrs };
  }

  private attributesAsLink(attributes: PtAttribute[]): PtLink {
    return LinksUtils.toTyped(attributes);
  }

  private extractFeatureAttributes(feature: Feature, isSanitise: boolean): PtAttribute[][] {
    return feature.rows.map(row =>
      feature.columns.map(c => <PtAttribute>{ name: c.name, value: row.valueFor(c.id)!.value })
        .filter(attr => (isSanitise && !isEmptyAttr(attr)) || !isSanitise));
  }

  private extractSectionAttributes(section: Section, isSanitise: boolean): PtAttribute[] {
    const keywordsFeature = section.features.list().find((feature) => feature.typeName === 'Keywords');
    const keywordsAsAttributes = keywordsFeature ?
      this.extractFeatureAttributes(keywordsFeature, isSanitise).map((keyword) => <PtAttribute>keyword.pop()) : [];

    return ([] as Array<PtAttribute>).concat(
      this.fieldsAsAttributes(section, isSanitise),
      (this.extractFeatureAttributes(section.annotations, isSanitise).pop() || []),
      keywordsAsAttributes || []
    );
  }

  private extractSectionFiles(section: Section, isSanitise: boolean): PtFileItem[] {
    const feature = section.features.list().find(f => isFileType(f.typeName));
    if (feature !== undefined) {
      return this.extractFeatureAttributes(feature, isSanitise).map(attrs => this.attributesAsFile(attrs));
    }
    return [];
  }

  private extractSectionLibraryFile(section: Section): string | undefined {
    const feature = section.features.list().find(f => isLibraryFileType(f.typeName));
    if (feature !== undefined && !feature.isEmpty) {
      return feature.rows[0].values()[0].value;
    }
    return undefined;
  }

  private extractSectionLinks(section: Section, isSanitise: boolean): PtLinkItem[] {
    const feature = section.features.list().find(f => isLinkType(f.typeName));
    if (feature !== undefined) {
      return this.extractFeatureAttributes(feature, isSanitise).map(attrs => this.attributesAsLink(attrs));
    }
    return [];
  }

  private extractSectionSubsections(section: Section, isSanitize: boolean): PageTabSection[] {
    const validFeatures = section.features.list().filter((feature) => (
      !isFileType(feature.typeName) &&
      !isLinkType(feature.typeName) &&
      !isLibraryFileType(feature.typeName) &&
      !isKeywordType(feature.typeName)
    ));

    const featureToPageTabSection = (feature) => {
      const featureAttributes = this.extractFeatureAttributes(feature, isSanitize);

      return featureAttributes.map(attrs => {
        return <PageTabSection>{
          type: feature.typeName,
          attributes: attrs
        };
      });
    };

    const featureAttributesAsPageTabSection = validFeatures
      .map(featureToPageTabSection)
      .reduce((rv, el) => rv.concat(el), []);

    const authorsSections = contacts2Authors(featureAttributesAsPageTabSection);
    const protocolSections = submissionToPageTabProtocols(authorsSections);

    return protocolSections.concat(section.sections.list().map(s => this.section2PtSection(s, isSanitize)));
  }

  private fieldsAsAttributes(section: Section, isSanitise: boolean) {
    return section.fields.list().map((field) => <PtAttribute>{ name: field.name, value: field.value })
      .filter(attr => (isSanitise && !isEmptyAttr(attr)) || !isSanitise);
  }

  private section2PtSection(section: Section, isSanitise: boolean = false): PageTabSection {
    return <PageTabSection>{
      accessTags: section.tags.accessTags,
      accno: section.accno,
      attributes: this.extractSectionAttributes(section, isSanitise)
        .filter(at => !AttrExceptions.editableAndRootOnly.includes(at.name!)),
      files: this.extractSectionFiles(section, isSanitise),
      libraryFile: this.extractSectionLibraryFile(section),
      links: this.extractSectionLinks(section, isSanitise),
      subsections: this.extractSectionSubsections(section, isSanitise),
      tags: this.withPageTag(section.tags.tags),
      type: section.typeName,
    };
  }

  private withPageTag(tags: Tag[]): Tag[] {
    if (tags.find(t => t.value === PAGE_TAG.value) !== undefined) {
      return tags;
    }
    return [...tags, ...[PAGE_TAG]];
  }
}
