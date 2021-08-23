import { Injectable } from '@angular/core';
import { tableSectionsToSections } from './utils/section.utils';
import { isDefinedAndNotEmpty, isValueEmpty } from 'app/utils/string.utils';
import { partition } from 'app/utils/array.utils';
import {
  ExtAttribute,
  ExtCollection,
  ExtFile,
  ExtFileList,
  ExtLink,
  ExtSection,
  ExtSubmission
} from './model/ext-submission-types';
import { AttrExceptions, attributesAsFile, attributesAsLink, fieldsAsAttributes } from './utils/attribute.utils';
import { tableToSections } from './utils/table.utils';
import { AttributeNames, LowerCaseSectionNames } from '../utils/constants';
import { Field, Section, Submission, SubmissionType, Table } from '../submission-shared/model';
import { DEFAULT_TEMPLATE_NAME } from '../submission-shared/submission-templates.service';

@Injectable()
export class SubmissionToExtSubmissionService {
  toExtSubmissionFromTemplate(collection?: string, templateName: string = DEFAULT_TEMPLATE_NAME): ExtSubmission {
    const collections: ExtCollection[] = collection ? [{ accNo: collection }] : [];
    const submission: Submission = new Submission(SubmissionType.fromTemplate(templateName), { collections });

    return this.toExtSubmission(submission, false);
  }

  submissionToExtSubmission(subm: Submission, isSanitise: boolean): ExtSubmission {
    return this.toExtSubmission(subm, isSanitise);
  }

  toExtSubmission(subm: Submission, isSanitise: boolean): ExtSubmission {
    const titleField = subm.section.fields.list().find((field) => field.name === AttributeNames.TITLE);
    const releaseDateField = subm.section.fields.list().find((field) => field.name === AttributeNames.RELEASE_DATE);

    return {
      accNo: subm.accno || 'S-BIAD100',
      attributes: [],
      collections: subm.collections,
      creationTime: '2021-08-17T14:27:49.234Z',
      method: 'PAGE_TAB',
      modificationTime: '2021-08-17T14:27:49.234Z',
      owner: 'ndiaz+1@ebi.ac.uk',
      relPath: '',
      releaseTime: (releaseDateField?.value as string) || '',
      released: false,
      rootPath: null,
      secretKey: '',
      section: this.extSectionToSection(subm.section, isSanitise),
      status: 'REQUESTED',
      submitter: 'ndiaz+1@ebi.ac.uk',
      title: (titleField?.value as string) || ''
    };
  }

  private extSectionToSection(section: Section, isSanitise: boolean, isSubsection: boolean = false): ExtSection {
    const [rootTables, otherTables] = partition<Table>([...section.tables.list(), section.annotations], (table) =>
      [
        LowerCaseSectionNames.FILE,
        LowerCaseSectionNames.LINK,
        LowerCaseSectionNames.KEYWORDS,
        LowerCaseSectionNames.ANNOTATION
      ].includes(table.typeName.toLowerCase())
    );

    return {
      accNo: section.accno,
      attributes: this.extractAttributesFromSection(section.fields.list(), rootTables, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
      ),
      fileList: this.extractFileListFromFields(section.fields.list()),
      files: this.extractFilesFromSection(rootTables, isSanitise),
      links: this.extractLinksFromSection(rootTables, isSanitise),
      extType: LowerCaseSectionNames.SECTION,
      sections: [
        ...tableSectionsToSections(otherTables, isSanitise, isSubsection),
        ...section.sections.list().map((s) => this.extSectionToSection(s, isSanitise, true))
      ],
      type: section.type.name
    };
  }

  private extractAttributesFromSection(fields: Field[], tables: Table[], isSanitise: boolean): ExtAttribute[] {
    const fieldAsAttributes = fieldsAsAttributes(fields, isSanitise);
    const keywordAttributes = this.extractKeywordsFromSection(tables, isSanitise);

    return [...fieldAsAttributes, ...keywordAttributes];
  }

  private extractFilesFromSection(tables: Table[], isSanitise: boolean): ExtFile[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.FILE);

    return tableToSections<ExtFile>(
      (rows) => [attributesAsFile(rows)],
      (attr) => isDefinedAndNotEmpty(attr.path),
      isSanitise,
      table
    );
  }

  private extractLinksFromSection(tables: Table[], isSanitise: boolean): ExtLink[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.LINK);

    return tableToSections<ExtLink>(
      (rows) => [attributesAsLink(rows)],
      (attr) => isDefinedAndNotEmpty(attr.url),
      isSanitise,
      table
    );
  }

  private extractKeywordsFromSection(tables: Table[], isSanitise: boolean): ExtAttribute[] {
    const table = tables.find((t) =>
      [LowerCaseSectionNames.KEYWORDS, LowerCaseSectionNames.ANNOTATION].includes(t.typeName.toLowerCase())
    );

    return tableToSections<ExtAttribute>(
      (rows) => rows,
      () => true,
      isSanitise,
      table
    );
  }

  private extractFileListFromFields(fields: Field[]): ExtFileList | null {
    const fileListField: Field | undefined = fields.find((field) => field.type.name === AttributeNames.FILE_LIST);
    const fileName = fileListField ? fileListField.value : '';

    if (fileName.length === 0) {
      return null;
    }

    return { fileName, filesUrl: '' };
  }
}
