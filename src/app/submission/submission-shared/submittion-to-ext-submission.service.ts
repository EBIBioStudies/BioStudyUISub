import { ExtAttributeType } from 'app/submission/submission-shared/model/ext-submission-types';
import { tableSectionsToSections } from './utils/section.utils';
import { Injectable } from '@angular/core';
import { isDefinedAndNotEmpty, isValueEmpty } from 'app/utils/string.utils';
import {
  ExtSubmissionType,
  ExtSectionType,
  ExtFileType,
  ExtLinkType,
  ExtFileListType
} from './model/ext-submission-types';
import { Field, Section, Submission, Table } from './model/submission/submission.model';
import { AttrExceptions, attributesAsFile, attributesAsLink, fieldsAsAttributes } from './utils/attribute.utils';
import { tableToSections } from './utils/table.utils';
import { partition } from 'app/utils/array.utils';
import { AttributeNames, LowerCaseSectionNames } from '../utils/constants';

@Injectable()
export class SubmissionToExtSubmissionService {
  submissionToExtSubmission(subm: Submission, isSanitise: boolean): ExtSubmissionType {
    const { value: title } = subm.findAttributeByName(AttributeNames.TITLE) || {};
    const { value: releaseDate } = subm.findAttributeByName(AttributeNames.RELEASE_DATE) || {};

    return {
      accNo: subm.accno || '',
      title: (title as string) || '',
      releaseTime: (releaseDate as string) || '',
      section: this.extSectionToSection(subm.section, isSanitise)
    };
  }

  private extSectionToSection(section: Section, isSanitise: boolean, isSubsection: boolean = false): ExtSectionType {
    const [rootTables, otherTables] = partition<Table>([...section.tables.list(), section.annotations], (table) =>
      [
        LowerCaseSectionNames.FILE,
        LowerCaseSectionNames.LINK,
        LowerCaseSectionNames.FILE_LIST,
        LowerCaseSectionNames.KEYWORDS,
        LowerCaseSectionNames.ANNOTATION
      ].includes(table.typeName.toLowerCase())
    );

    return {
      accNo: section.accno,
      attributes: this.extractAttributesFromSection(section.fields.list(), rootTables, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
      ),
      fileList: this.extractFileListFromSection(rootTables),
      files: this.extractFilesFromSection(rootTables, isSanitise),
      links: this.extractLinksFromSection(rootTables, isSanitise),
      extType: LowerCaseSectionNames.SECTION,
      sections: [
        ...tableSectionsToSections(otherTables, isSanitise, isSubsection),
        ...section.sections.list().map((s) => this.extSectionToSection(s, isSanitise, true))
      ],
      type: LowerCaseSectionNames.STUDY
    };
  }

  private extractAttributesFromSection(fields: Field[], tables: Table[], isSanitise: boolean): ExtAttributeType[] {
    const fieldAsAttributes = fieldsAsAttributes(fields, isSanitise);
    const keywordAttributes = this.extractKeywordsFromSection(tables, isSanitise);

    return [...fieldAsAttributes, ...keywordAttributes];
  }

  private extractFilesFromSection(tables: Table[], isSanitise: boolean): ExtFileType[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.FILE);

    return tableToSections<ExtFileType>(
      (rows) => [attributesAsFile(rows)],
      (attr) => isDefinedAndNotEmpty(attr.path),
      isSanitise,
      table
    );
  }

  private extractLinksFromSection(tables: Table[], isSanitise: boolean): ExtLinkType[] {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.LINK);

    return tableToSections<ExtLinkType>(
      (rows) => [attributesAsLink(rows)],
      (attr) => isDefinedAndNotEmpty(attr.url),
      isSanitise,
      table
    );
  }

  private extractKeywordsFromSection(tables: Table[], isSanitise: boolean): ExtAttributeType[] {
    const table = tables.find((t) =>
      [LowerCaseSectionNames.KEYWORDS, LowerCaseSectionNames.ANNOTATION].includes(t.typeName.toLowerCase())
    );

    return tableToSections<ExtAttributeType>(
      (rows) => rows,
      () => true,
      isSanitise,
      table
    );
  }

  private extractFileListFromSection(tables: Table[]): ExtFileListType | null {
    const table = tables.find((t) => t.typeName.toLowerCase() === LowerCaseSectionNames.FILE_LIST);

    if (table === undefined || table.isEmpty) {
      return null;
    }

    const tableRowValue = table.rows[0].values()[0];

    return tableRowValue && tableRowValue.value ? { fileName: tableRowValue.value } : null;
  }
}
