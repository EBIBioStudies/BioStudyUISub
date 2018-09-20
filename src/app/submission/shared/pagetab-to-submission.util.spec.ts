import {pageTab2SubmissionData} from './pagetab-to-submission.util';

describe('PageTab To Submission Util:', () => {
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
                }],
            section: {
                attributes: [title2]
            }
        };
        const submData = pageTab2SubmissionData(pageTab);

        expect(submData.attributes!.length).toEqual(3);
        expect(submData.section).toBeDefined();
        expect(submData.section!.attributes!.length).toEqual(2);
        expect(submData.section!.attributes!.map(at => at.value)).toContain(title2.value);
    });

    it('Links should go to section feature list', () => {
        const pageTab = {
            section: {
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

        const submData = pageTab2SubmissionData(pageTab);
        expect(submData.section!.features!.length).toEqual(1);
        expect(submData.section!.features![0].entries!.length).toEqual(3);


    });

    it('Files should go to section feature list', () => {
        //TODO
    });

    it('Sections without subsections should go to section feature list', () => {
        //TODO
    });

    it('Sections with subsections should go to section subsections list', () => {
        //TODO
    });

});
