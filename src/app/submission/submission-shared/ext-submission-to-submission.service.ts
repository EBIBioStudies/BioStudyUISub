import { Injectable } from '@angular/core';
import { SectionData, Submission } from './model/submission/submission.model';
import {
  ExtAttributeType,
  ExtSectionType,
  ExtSubmissionType
} from 'app/submission/submission-shared/model/ext-submission-types';
import { findSubmissionTemplateName } from './utils/template.utils';
import { SubmissionType } from './model/templates';
import { extAttrToAttrData } from './utils/ext-attribute-to-attribute.utils';
import { extSectionsToTables } from './utils/ext-section-to-section.utils';
import { filterAttributesByName, findAttributeByName, mergeAttributes } from './utils/attribute.utils';
import { toUntyped } from './utils/link.utils';
import { ExtAttrExceptions } from './resources/attr-exceptions';
import { partition } from 'app/utils';
import { AttributeNames } from '../utils/constants';

@Injectable()
export class ExtSubmissionToSubmissionService {
  extSubmissionToSubmission(extSubmission: ExtSubmissionType): Submission {
    const { attributes = [], collections, section, releaseTime, title } = extSubmission;
    const templateName = findSubmissionTemplateName(collections);
    const type: SubmissionType = SubmissionType.fromTemplate(templateName);

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
    section: ExtSectionType,
    parentAttributes: ExtAttributeType[],
    submissionType: SubmissionType,
    isSubsection: boolean = false
  ): SectionData {
    const { attributes, links = [], files = [], fileList: fileListValue, sections = [] } = section;
    const { sectionType } = submissionType;
    const editableParentAttributes = parentAttributes.filter((attribute) =>
      ExtAttrExceptions.editable.includes(attribute.name!)
    );
    const fileList: ExtAttributeType = { name: 'FileList', value: fileListValue, reference: false };
    const parentAndChildAttributes = mergeAttributes(editableParentAttributes, [...attributes, fileList]);
    const attributesData = extAttrToAttrData(parentAndChildAttributes, sectionType.fieldValueTypes);
    const keywords = filterAttributesByName('Keyword', attributes);
    const [subsections, pageSections] = partition<ExtSectionType>(sections, (sec) =>
      Boolean(sec.sections && sec.sections.length > 0)
    );

    const tableSections: ExtSectionType[] = [
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

  private releaseDateAttr(extSubmision: ExtSubmissionType): ExtAttributeType {
    return {
      name: AttributeNames.RELEASE_DATE,
      value: extSubmision.releaseTime
    };
  }

  private titleAttr(extSubmission: ExtSubmissionType): ExtAttributeType {
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
