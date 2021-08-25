import { Injectable } from '@angular/core';
import { SubmissionTemplatesService } from 'app/submission/submission-shared/submission-templates.service';
import { SubmissionTypeService } from 'app/submission/submission-shared/submission-type.service';
import { SectionData, Submission, SubmissionType } from 'app/submission/submission-shared/model';
import { ExtAttribute, ExtSection, ExtSubmission } from './model/ext-submission-types';
import { extAttrToAttrData } from './utils/ext-attribute-to-attribute.utils';
import { extSectionsToTables } from './utils/ext-section-to-section.utils';
import { filterAttributesByName, findAttributeByName, mergeAttributes } from './utils/attribute.utils';
import { toUntyped } from './utils/link.utils';
import { ExtAttrExceptions } from './shared/attr-exceptions';
import { partition } from 'app/utils';
import { AttributeNames } from '../utils/constants';

@Injectable()
export class ExtSubmissionToSubmissionService {
  constructor(
    private submissionTemplatesService: SubmissionTemplatesService,
    private submissionTypeService: SubmissionTypeService
  ) {}

  extSubmissionToSubmission(extSubmission: ExtSubmission): Submission {
    const { attributes = [], collections, section } = extSubmission;
    const templateName = this.submissionTemplatesService.findSubmissionTemplateName(collections);
    const type: SubmissionType = this.submissionTypeService.fromTemplate(templateName);

    const studyAttributes = mergeAttributes(attributes, [
      this.releaseDateAttr(extSubmission),
      this.titleAttr(extSubmission)
    ]);

    const submission = new Submission(type, {
      accno: extSubmission.accNo,
      attributes: extAttrToAttrData(studyAttributes, type.sectionType.fieldValueTypes),
      collections,
      section: this.extSectionToSection(section, studyAttributes, type),
      tags: extSubmission.tags
    });

    return submission;
  }

  private extSectionToSection(
    section: ExtSection,
    parentAttributes: ExtAttribute[],
    submissionType: SubmissionType,
    isSubsection: boolean = false
  ): SectionData {
    const { attributes, links = [], files = [], fileList, sections = [] } = section;
    const { sectionType } = submissionType;
    const editableParentAttributes = parentAttributes.filter((attribute) =>
      ExtAttrExceptions.editable.includes(attribute.name!)
    );
    const fileListAttribute: ExtAttribute = {
      name: AttributeNames.FILE_LIST,
      value: fileList?.fileName || '',
      reference: false
    };
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, [...attributes, fileListAttribute]);
    const attributesData = extAttrToAttrData(parentAndChildAttributes, sectionType.fieldValueTypes);
    const keywords = filterAttributesByName(AttributeNames.KEYWORD, attributes);
    const [subsections, pageSections] = partition<ExtSection>(sections, (sec) =>
      Boolean(sec.sections && sec.sections.length > 0)
    );

    const tableSections: ExtSection[] = [
      ...links.map((link) => ({
        type: 'Link',
        attributes: toUntyped(link)
      })),
      ...files.map((file) => ({
        type: 'File',
        attributes: [{ name: 'File', value: file.fileName }, ...file.attributes]
      })),
      ...keywords.map((keyword) => ({
        type: 'Keywords',
        attributes: [{ name: 'Keyword', value: keyword.value }]
      }))
    ];

    const tables = extSectionsToTables([...pageSections, ...tableSections], sectionType.tableTypes, isSubsection);
    const formattedSubsections = subsections.map((subsection) =>
      this.extSectionToSection(subsection, section.attributes, submissionType, isSubsection)
    );

    return {
      accno: section.accNo || '',
      attributes: attributesData,
      tables,
      type: section.type,
      sections: formattedSubsections
    };
  }

  private releaseDateAttr(extSubmision: ExtSubmission): ExtAttribute {
    return {
      name: AttributeNames.RELEASE_DATE,
      value: extSubmision.releaseTime
    };
  }

  private titleAttr(extSubmission: ExtSubmission): ExtAttribute {
    let title: string | undefined = extSubmission.title;
    if (!title) {
      const titleAttribute = findAttributeByName(AttributeNames.TITLE, extSubmission.section.attributes);
      title = (titleAttribute?.value as string) || undefined;
    }

    return {
      name: AttributeNames.TITLE,
      value: title
    };
  }
}
