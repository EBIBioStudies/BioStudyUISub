import { ExtAttributeType } from 'app/submission/submission-shared/model/ext-submission-types';
import { SectionNames } from './utils/section.utils';
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
import {
  AttrExceptions,
  AttributeNames,
  attributesAsFile,
  attributesAsLink,
  fieldsAsAttributes
} from './utils/attribute.utils';
import { tableToSections } from './utils/table.utils';
import { partition } from 'app/utils/array.utils';
import { Organisations } from './resources/organisation';
import { Protocols } from './resources/protocol';

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

  private extSectionToSection(section: Section, isSanitise: boolean): ExtSectionType {
    const [rootTables, otherTables] = partition<Table>(section.tables.list(), (table) =>
      [SectionNames.FILE, SectionNames.LINK, SectionNames.FILE_LIST, SectionNames.KEYWORDS].includes(
        table.typeName.toLowerCase() as SectionNames
      )
    );

    return {
      accNo: section.accno,
      attributes: this.extractAttributesFromSection(section.fields.list(), rootTables, isSanitise).filter(
        (at) => at.name && !AttrExceptions.editableAndRootOnly.includes(at.name) && !isValueEmpty(at.value)
      ),
      fileList: this.extractFileListFromSection(rootTables),
      files: this.extractFilesFromSection(rootTables, isSanitise),
      links: this.extractLinksFromSection(rootTables, isSanitise),
      extType: SectionNames.SECTION,
      sections: this.subsections(section, otherTables, isSanitise),
      type: SectionNames.STUDY
    };
  }

  private subsections(section: Section, tables: Table[], isSanitise: boolean) {
    const subsections = section.sections;

    let tableSections: ExtSectionType[] = [];
    tables.forEach((table) => {
      tableSections = [
        ...tableSections,
        ...tableToSections<ExtSectionType>(
          (attrs, currentTable) => ({
            type: currentTable?.typeName || '',
            attributes: attrs.filter((attr) => !isValueEmpty(attr.value))
          }),
          (currentSection) => currentSection.attributes.length > 0,
          isSanitise,
          table
        )
      ];
    });

    console.log(subsections, tableSections);

    return [];
  }

  private contactsToExtSection(sections: ExtSectionType[]) {
    const orgs: Organisations = Organisations.getInstance();
    const [contacts, sectionsWithoutContacts] = partition<ExtSectionType>(sections, (section) =>
      [SectionNames.CONTACT].includes(section.type.toLowerCase() as SectionNames)
    );
    const authors: ExtSectionType[] = contacts.map((contact) => ({
      type: SectionNames.AUTHOR,
      attributes: orgs.orgToReferences(contact).filter((ref) => !isValueEmpty(ref.value))
    }));
    const affiliations: ExtSectionType[] = orgs.list().map((org) => ({
      type: SectionNames.ORGANISATION,
      accno: org.accno,
      attributes: [{ name: AttributeNames.NAME, value: org.name }]
    }));

    return [...authors, ...affiliations, ...sectionsWithoutContacts];
  }

  private protocolsToExtSection(sections: ExtSectionType[]) {
    const protocols: Protocols = Protocols.getInstance();
    const componentProtocols = sections.filter((section) => section.type === SectionNames.PROTOCOLS);
    // const studyProtocols = sections.filter((section) => isStudyProtocol(section.type));

    console.log(protocols, componentProtocols);
  }

  private extractAttributesFromSection(fields: Field[], tables: Table[], isSanitise: boolean): ExtAttributeType[] {
    const fieldAsAttributes = fieldsAsAttributes(fields, isSanitise);
    const keywordAttributes = this.extractKeywordsFromSection(tables, isSanitise);

    return [...fieldAsAttributes, ...keywordAttributes];
  }

  private extractFilesFromSection(tables: Table[], isSanitise: boolean): ExtFileType[] {
    const table = tables.find((t) => t.typeName === SectionNames.FILE);

    return tableToSections<ExtFileType>(
      (rows) => attributesAsFile(rows),
      (attr) => isDefinedAndNotEmpty(attr.path),
      isSanitise,
      table
    );
  }

  private extractLinksFromSection(tables: Table[], isSanitise: boolean): ExtLinkType[] {
    const table = tables.find((t) => t.typeName === SectionNames.LINK);

    return tableToSections<ExtLinkType>(
      (rows) => attributesAsLink(rows),
      (attr) => isDefinedAndNotEmpty(attr.url),
      isSanitise,
      table
    );
  }

  private extractKeywordsFromSection(tables: Table[], isSanitise: boolean): ExtAttributeType[] {
    const table = tables.find((t) => t.typeName === SectionNames.KEYWORDS);

    return tableToSections<ExtAttributeType>(
      (row) => row[0],
      () => true,
      isSanitise,
      table
    );
  }

  private extractFileListFromSection(tables: Table[]): ExtFileListType {
    const table = tables.find((t) => t.typeName === SectionNames.FILE_LIST);
    const emtpyFileList = { fileName: null };

    if (table !== undefined && !table.isEmpty) {
      const tableRowValue = table.rows[0].values()[0];

      return tableRowValue ? { fileName: tableRowValue.value || null } : emtpyFileList;
    }

    return emtpyFileList;
  }
}
