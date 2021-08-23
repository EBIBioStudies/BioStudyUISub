import { TestBed } from '@angular/core/testing';
import { extRootSection } from './../../../tests/fixtures/section';
import { extFile } from './../../../tests/fixtures/file';
import { extAuthor } from './../../../tests/fixtures/author';
import { ExtSubmissionToSubmissionService } from 'app/submission/submission-transform/ext-submission-to-submission.service';
import { SubmissionSharedModule } from './../submission-shared/submission-shared.module';
import { Attribute, Section, Submission } from '../submission-shared/model';
import { extSubmission } from './../../../tests/fixtures/submission';
import { AttributeNames, SectionNames } from '../utils/constants';
import { findAttributeByName } from './utils/attribute.utils';

const getColumnValue = (columnName, columns, row) => {
  const { id } = columns.find((column: Attribute) => column.name === columnName) || { id: '' };

  return row.valueFor(id);
};

describe('ExtSubmissionToSubmissionService', () => {
  let extSubmissionToSubmissionService: ExtSubmissionToSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubmissionSharedModule],
      providers: [ExtSubmissionToSubmissionService]
    });

    extSubmissionToSubmissionService = TestBed.inject(ExtSubmissionToSubmissionService);
  });

  test('should create submission model from extended submission', () => {
    const submission: Submission = extSubmissionToSubmissionService.extSubmissionToSubmission(extSubmission);

    expect(submission.accno).toEqual(extSubmission.accNo);
    expect(submission.collections).toEqual(extSubmission.collections);

    // Takes release date from submission property
    expect(findAttributeByName(AttributeNames.RELEASE_DATE, submission.attributes)?.value).toEqual(
      extSubmission.releaseTime
    );

    // Takes title from submission property
    expect(findAttributeByName(AttributeNames.TITLE, submission.attributes)?.value).toEqual(extSubmission.title);

    // Study Section
    const studySection: Section = submission.section;

    // Fields
    studySection.fields.list().forEach((field) => {
      if (field.name === AttributeNames.RELEASE_DATE) {
        expect(field.value).toEqual(extSubmission.releaseTime);
      }

      extSubmission.section.attributes.forEach((extAttribute) => {
        if (extAttribute.name === field.name) {
          expect(field.value).toEqual(extAttribute.value);
        }
      });
    });

    // Tables
    studySection.tables.list().forEach((table) => {
      // Keywords
      if (table.type.name.toLowerCase() === SectionNames.KEYWORDS.toLowerCase()) {
        const attributesNames = [AttributeNames.KEYWORD];
        const firstKeyword = table.rows[0];

        attributesNames.forEach((attributeName) => {
          const tableRowValue = getColumnValue(attributeName, table.columns, firstKeyword);
          const extendedAttrValue = findAttributeByName(attributeName, extRootSection.attributes) || {};

          expect(extendedAttrValue).toMatchObject(tableRowValue);
        });
      }

      // Contacts
      if (table.type.name.toLowerCase() === SectionNames.CONTACT.toLowerCase()) {
        const attributesNames = [AttributeNames.NAME, AttributeNames.EMAIL];
        const firstContact = table.rows[0];

        attributesNames.forEach((attributeName) => {
          const tableRowValue = getColumnValue(attributeName, table.columns, firstContact);
          const extendedAttrValue = findAttributeByName(attributeName, extAuthor.attributes) || {};

          expect(extendedAttrValue).toMatchObject(tableRowValue);
        });
      }

      // Files
      if (table.type.name.toLowerCase() === SectionNames.FILE.toLowerCase()) {
        const attributeNames = ['Description', 'Type'];
        const firstFile = table.rows[0];

        attributeNames.forEach((attributeName) => {
          const tableRowValue = getColumnValue(attributeName, table.columns, firstFile);
          const extendedAttrValue = findAttributeByName(attributeName, extFile.attributes) || {};

          expect(extendedAttrValue).toMatchObject(tableRowValue);
        });

        const fileColumn = getColumnValue('File', table.columns, firstFile);
        expect(fileColumn.value).toEqual(extFile.fileName);
      }
    });
  });
});
