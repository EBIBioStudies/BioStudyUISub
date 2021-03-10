import { TestBed, inject } from '@angular/core/testing';
import { Submission, SubmissionData } from './model/submission';
import { SubmissionType } from './model/templates';
import { SubmissionToPageTabService } from './submission-to-pagetab.service';
import { PtFile, PtLink } from './model/pagetab';

describe('SubmissionToPageTabService', () => {
  let submType;

  beforeAll(() => {
    submType = SubmissionType.fromEmptyTemplate();

    TestBed.configureTestingModule({
      imports: [],
      providers: [SubmissionToPageTabService]
    });
  });

  it('Title and ReleaseDate attributes should be moved to the submission level', () => {
    const subm = new Submission(submType, {
      attributes: [{ name: 'AttachTo', value: 'proj1' }],
      section: {
        attributes: [
          { name: 'Title', value: 'A title' },
          { name: 'ReleaseDate', value: 'A release date' },
          { name: 'Attr1', value: 'Value1' }
        ]
      }
    } as SubmissionData);

    inject([SubmissionToPageTabService], (submToPageTabService) => {
      const pageTab = submToPageTabService.submission2PageTab(subm);
      expect(pageTab.attributes!.length).toBe(3);
      expect(pageTab.attributes!.find((at) => at.name === 'Title')).toBeDefined();
      expect(pageTab.attributes!.find((at) => at.name === 'ReleaseDate')).toBeDefined();
      expect(pageTab.attributes!.find((at) => at.name === 'AttachTo')).toBeDefined();

      const secAttributes = pageTab.section!.attributes!;
      expect(secAttributes.length).toBe(2);
    });
  });

  it('Section Link features should go to section links list', () => {
    const subm = new Submission(submType, {
      section: {
        tables: [
          {
            type: 'Link',
            entries: [
              [
                { name: 'Link', value: 'url1' },
                { name: 'Type', value: '' }
              ]
            ]
          }
        ]
      }
    } as SubmissionData);

    inject([SubmissionToPageTabService], (submToPageTabService) => {
      const pageTab = submToPageTabService.submission2PageTab(subm);
      expect(pageTab.section!.links!.length).toBe(1);
      expect(pageTab.section!.links![0].url as PtLink).toBe('url1');
    });
  });

  it('Section File features should go to section files list', () => {
    const subm = new Submission(submType, {
      section: {
        tables: [
          {
            type: 'File',
            entries: [[{ name: 'Path', value: 'path1' }]]
          }
        ]
      }
    } as SubmissionData);

    inject([SubmissionToPageTabService], (submToPageTabService) => {
      const pageTab = submToPageTabService.submission2PageTab(subm);
      expect(pageTab.section!.files!.length).toBe(1);
      expect(pageTab.section!.files![0].path as PtFile).toBe('path1');
    });
  });
});
