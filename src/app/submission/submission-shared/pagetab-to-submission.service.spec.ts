import { TestBed, inject } from '@angular/core/testing';
import { PageTabToSubmissionService } from './pagetab-to-submission.service';
import { PageTab } from './model/pagetab';

describe('PageTabToSubmissionService', () => {
  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PageTabToSubmissionService]
    });
  });

  it('Title and ReleaseDate attributes should be merged to the section level attributes', () => {
    const title1 = {
      name: 'Title',
      value: 'a Title 1'
    };

    const title2 = {
      name: 'Title',
      value: 'a Title 2'
    };

    const pageTab = {
      attributes: [
        title1,
        {
          name: 'ReleaseDate',
          value: '12345'
        },
        {
          name: 'AttachTo',
          value: 'proj123'
        }
      ],
      section: {
        attributes: [title2]
      }
    };

    inject([PageTabToSubmissionService], (pagetTabToSubmService) => {
      const submData = pagetTabToSubmService.pageTab2SubmissionData(pageTab);

      expect(submData.attributes!.length).toEqual(3);
      expect(submData.section).toBeDefined();
      expect(submData.section!.attributes!.length).toEqual(2);
      expect(submData.section!.attributes!.map((at) => at.value)).toContain(title2.value);
    });
  });

  it('Links should go to section single column table', () => {
    const pageTab = {
      section: {
        attributes: [],
        links: [
          {
            url: 'url1'
          },
          [
            {
              url: 'url2'
            },
            {
              url: 'url3'
            }
          ]
        ]
      }
    };

    inject([PageTabToSubmissionService], (pagetTabToSubmService) => {
      const submData = pagetTabToSubmService.pageTab2SubmissionData(pageTab);
      expect(submData.section!.tables!.length).toEqual(1);
      expect(submData.section!.tables![0].entries!.length).toEqual(3);
    });
  });

  it('Files should go to section single column table', () => {
    const pageTab = {
      section: {
        attributes: [],
        files: [
          {
            path: 'path1'
          },
          [
            {
              path: 'path2'
            },
            {
              path: 'path3'
            }
          ]
        ]
      }
    };

    inject([PageTabToSubmissionService], (pagetTabToSubmService) => {
      const submData = pagetTabToSubmService.pageTab2SubmissionData(pageTab);
      expect(submData.section!.tables!.length).toEqual(1);
      expect(submData.section!.tables![0].entries!.length).toEqual(3);
    });
  });

  it('Sections without subsections should go to section single column table', () => {
    const pageTab = {
      section: {
        attributes: [],
        subsections: [
          {
            attributes: [],
            type: 'secType1'
          },
          [
            {
              attributes: [],
              type: 'secType2'
            },
            {
              attributes: [],
              type: 'secType2'
            }
          ]
        ]
      }
    };

    inject([PageTabToSubmissionService], (pagetTabToSubmService) => {
      const submData = pagetTabToSubmService.pageTab2SubmissionData(pageTab as PageTab);
      expect(submData.section!.tables!.length).toEqual(2);

      const f1 = submData.section!.tables!.find((f) => f.type === 'secType1');
      expect(f1).toBeDefined();
      expect(f1!.entries!.length).toEqual(1);

      const f2 = submData.section!.tables!.find((f) => f.type === 'secType2');
      expect(f2!.entries!.length).toEqual(2);
    });
  });

  it('Sections with subsections should go to section subsections list', () => {
    const pageTab = {
      section: {
        attributes: [],
        subsections: [
          {
            attributes: [],
            type: 'secType1',
            links: [{ url: 'url1' }]
          },
          [
            {
              attributes: [],
              type: 'secType2',
              links: [{ url: 'url2' }]
            },
            {
              attributes: [],
              type: 'secType2',
              links: [{ url: 'url3' }]
            }
          ]
        ]
      }
    };

    inject([PageTabToSubmissionService], (pagetTabToSubmService) => {
      const submData = pagetTabToSubmService.pageTab2SubmissionData(<PageTab>pageTab);
      expect(submData.section!.tables!.isEmpty()).toBeTruthy();
      expect(submData.section!.sections!.length).toBe(3);

      const s1 = submData.section!.sections!.find((s) => s.type === 'secType1');
      expect(s1).toBeDefined();
      expect(s1!.tables!.length).toEqual(1);
    });
  });
});
