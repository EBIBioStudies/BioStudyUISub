import {pageTabSample1} from './pagetab.samples';
import {PageTab} from './pagetab.model';
import {SubmissionType} from './submission-type.model';

describe('PageTab', () => {
    it('can have undefined root section', () => {
        const pt = new PageTab();
        expect(pt.section).toBeUndefined();
    });

    it('does not change the original object', () => {
        const obj = pageTabSample1();
        const pt = new PageTab(obj);
        expect(obj).toEqual(pageTabSample1());
    });

    it('extracts features from the original PageTab', () => {
        const pt = new PageTab({
            type: 'Submission',
            section: {
                type: 'Study',
                subsections: [
                    {
                        type: 'Feature1'
                    },
                    {
                        type: 'Feature1'
                    }
                ]
            }
        });
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.features.length).toBe(1);

        const feature = pt.section.features[0];
        expect(feature.type).toBe('Feature1');
    });

    it('extracts files as a feature from an original PageTab', () => {
        const pt = new PageTab({
            type: 'Submission',
            section: {
                type: 'Study',
                files: [
                    {
                        path: 'path1',
                        attributes: [
                            {
                                name: 'attr1',
                                value: 'file1'
                            }
                        ]
                    },
                    {
                        path: 'path2',
                        attributes: [
                            {
                                name: 'attr1',
                                value: 'file2'
                            }
                        ]
                    }
                ]
            }
        });
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.features.length).toEqual(1);

        const feature = pt.section.features[0];
        expect(feature.type).toBe('File');
        expect(feature.entries.length).toBe(2);

        const entry = feature.entries[0];
        expect(entry.attributes).toEqual([
            {
                name: 'attr1',
                value: 'file1'
            },
            {
                name: 'Path',
                value: 'path1'
            }
        ]);
    });

    it('extracts links as a feature from an original PageTab', () => {
        const pt = new PageTab({
            type: 'Submission',
            section: {
                type: 'Study',
                links: [
                    {
                        url: 'url1',
                        attributes: [
                            {
                                name: 'attr1',
                                value: 'url1'
                            }
                        ]
                    },
                    {
                        url: 'url2',
                        attributes: [
                            {
                                name: 'attr1',
                                value: 'url2'
                            }
                        ]
                    }
                ]
            }
        });
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.features.length).toEqual(1);

        const feature = pt.section.features[0];
        expect(feature.type).toBe('Link');
        expect(feature.entries.length).toBe(2);

        const entry = feature.entries[0];
        expect(entry.attributes).toEqual([
            {
                name: 'attr1',
                value: 'url1'
            },
            {
                name: 'URL',
                value: 'url1'
            }
        ]);
    });

    it('can be converted into submission object', () => {
        const pt = new PageTab({
            type: 'Submission',
            accno: '123',
            section: {
                type: 'Study',
                attributes: [
                    {
                        name: 'Title',
                        value: 'Title value'
                    },
                    {
                        name: 'attr1',
                        value: 'attr1 value'
                    }
                ],
                links: [{
                    url: 'url1'
                }],
                files: [{
                    path: 'file1'
                }]
            }
        });

        const type = SubmissionType.createDefault();
        const studyType = type.sectionType;

        const subm = pt.toSubmission(type);
        expect(subm.accno).toBe('123');
        expect(subm.root).toBeDefined();
        expect(subm.root.type).toBeDefined();
        expect(subm.root.type.name).toBe('Study');

        const study = subm.root;
        expect(study.sections.length).toBe(0);
        expect(study.fields.length).toBe(studyType.fieldTypes.length);
        expect(study.annotations.size()).toBe(1);
        expect(study.features.length).toBe(studyType.featureTypes.length);
    });

    it('can be created from a submission object', () => {
        const type = SubmissionType.createDefault();
        const secType = type.sectionType;
        const subm = (new PageTab({})).toSubmission(type);
        const pt = PageTab.fromSubmission(subm);

        expect(pt.type).toBe('Submission');
        expect(pt.accno).toBeUndefined();
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.accno).toBeUndefined();
        expect(pt.section.attributes).toBeDefined();
        expect(pt.section.attributes.length).toBe(secType.fieldTypes.length);

        expect(pt.section.links).toBeUndefined(); // no links defined
        expect(pt.section.files).toBeUndefined(); // no files defined
        expect(pt.section.subsections).toBeDefined();
        expect(pt.section.subsections.length).toBe(1); // at least one contact is required

        const s = pt.section.subsections[0];
        expect(s.type).toBe('Author');
        expect(s.attributes).toBeUndefined(); // all values are empty
    });
});
