import { Submission, SubmissionData } from './submission';
import { SubmissionType } from './templates';
import { submission2PageTab } from './submission-to-pagetab.utils';
import { PtFile, PtLink } from './pagetab';

describe('Submission To PageTab Util:', () => {
  let submType;

  beforeAll(() => {
    submType = SubmissionType.fromEmptyTemplate();
  });

  it('Title and ReleaseDate attributes should be moved to the submission level', () => {
    const subm = new Submission(submType, <SubmissionData>{
      attributes: [
        {name: 'AttachTo', value: 'proj1'}
      ],
      section: {
        attributes: [
          {name: 'Title', value: 'A title'},
          {name: 'ReleaseDate', value: 'A release date'},
          {name: 'Attr1', value: 'Value1'}
        ]
      }
    });

    const pageTab = submission2PageTab(subm);
    expect(pageTab.attributes!.length).toBe(3);
    expect(pageTab.attributes!.find(at => at.name === 'Title')).toBeDefined();
    expect(pageTab.attributes!.find(at => at.name === 'ReleaseDate')).toBeDefined();
    expect(pageTab.attributes!.find(at => at.name === 'AttachTo')).toBeDefined();

    const secAttributes = pageTab.section!.attributes!;
    expect(secAttributes.length).toBe(2);
  });

  it('Section Link features should go to section links list', () => {
    const subm = new Submission(submType, <SubmissionData>{
      section: {
        features: [
          {
            type: 'Link',
            entries: [
              [{name: 'Pointer', value: 'url1'}, {name: 'Type', value: ''}]
            ]
          }
        ]
      }
    });

    const pageTab = submission2PageTab(subm);
    expect(pageTab.section!.links!.length).toBe(1);
    expect((<PtLink>pageTab.section!.links![0]).url).toBe('url1');
  });

  it('Section File features should go to section files list', () => {
    const subm = new Submission(submType, <SubmissionData>{
      section: {
        features: [
          {
            type: 'File',
            entries: [
              [{name: 'Path', value: 'path1'}]
            ]
          }
        ]
      }
    });

    const pageTab = submission2PageTab(subm);
    expect(pageTab.section!.files!.length).toBe(1);
    expect((<PtFile>pageTab.section!.files![0]).path).toBe('path1');
  });

});
