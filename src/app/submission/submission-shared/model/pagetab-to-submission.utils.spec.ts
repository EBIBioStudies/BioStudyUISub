import { pageTab2SubmissionData } from './pagetab-to-submission.utils';
import { PageTab } from './pagetab';

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

        const submData = pageTab2SubmissionData(pageTab);
        expect(submData.section!.features!.length).toEqual(1);
        expect(submData.section!.features![0].entries!.length).toEqual(3);
    });

    it('Files should go to section feature list', () => {
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

        const submData = pageTab2SubmissionData(pageTab);
        expect(submData.section!.features!.length).toEqual(1);
        expect(submData.section!.features![0].entries!.length).toEqual(3);
    });

    it('Sections without subsections should go to section feature list', () => {
        const pageTab = {
            section: {
                subsections: [
                    {
                        type: 'secType1'
                    },
                    [
                        {
                            type: 'secType2'

                        },
                        {
                            type: 'secType2'
                        }
                    ]
                ]
            }
        };

        const submData = pageTab2SubmissionData(<PageTab>(pageTab));
        expect(submData.section!.features!.length).toEqual(2);

        const f1 = submData.section!.features!.find(f => f.type === 'secType1');
        expect(f1).toBeDefined();
        expect(f1!.entries!.length).toEqual(1);

        const f2 = submData.section!.features!.find(f => f.type === 'secType2');
        expect(f2!.entries!.length).toEqual(2);
    });

    it('Sections with subsections should go to section subsections list', () => {
        const pageTab = {
            section: {
                subsections: [
                    {
                        type: 'secType1',
                        links: [{url: 'url1'}]
                    },
                    [
                        {
                            type: 'secType2',
                            links: [{url: 'url2'}]
                        },
                        {
                            type: 'secType2',
                            links: [{url: 'url3'}]
                        }
                    ]
                ]
            }
        };

        const submData = pageTab2SubmissionData(<PageTab>(pageTab));
        expect(submData.section!.features!.isEmpty()).toBeTruthy();
        expect(submData.section!.sections!.length).toBe(3);

        const s1 = submData.section!.sections!.find(s => s.type === 'secType1');
        expect(s1).toBeDefined();
        expect(s1!.features!.length).toEqual(1);
    });

});
