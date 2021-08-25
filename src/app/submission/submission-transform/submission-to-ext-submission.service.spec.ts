import { TestBed } from '@angular/core/testing';
import { testTemplate } from './../../../tests/templates/test-template';
import { extSubmission as submissionFixture } from './../../../tests/fixtures/submission';
import { Submission } from '../submission-shared/model';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { ExtSubmissionToSubmissionService } from './ext-submission-to-submission.service';
import { ExtSubmission } from './model/ext-submission-types';
import { SubmissionToExtSubmissionService } from './submission-to-ext-submission.service';
import { SubmissionTemplatesService } from '../submission-shared/submission-templates.service';

const findSubmissionTemplateNameMock = jest.fn(() => 'TestTemplate');
const findSubmissionTemplateByNameMock = jest.fn(() => testTemplate);

describe('SubmissionToExtSubmissionService', () => {
  let submissionToExtSubmissionService: SubmissionToExtSubmissionService;
  let extSubmissionToSubmissionService: ExtSubmissionToSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubmissionSharedModule],
      providers: [
        {
          provide: SubmissionTemplatesService,
          useValue: {
            findSubmissionTemplateName: findSubmissionTemplateNameMock,
            findSubmissionTemplateByName: findSubmissionTemplateByNameMock
          }
        },
        SubmissionToExtSubmissionService,
        ExtSubmissionToSubmissionService
      ]
    });

    submissionToExtSubmissionService = TestBed.inject(SubmissionToExtSubmissionService);
    extSubmissionToSubmissionService = TestBed.inject(ExtSubmissionToSubmissionService);
  });

  test('should transform model to extended format', () => {
    const submission: Submission = extSubmissionToSubmissionService.extSubmissionToSubmission(submissionFixture);
    const extSubmission: ExtSubmission = submissionToExtSubmissionService.toExtSubmission(submission, false);

    expect(extSubmission).toEqual(submissionFixture);
  });
});
