import {pageTabSample1} from './pagetab.samples';
import {PageTab} from './pagetab.model';
import {SubmissionType} from './submission-type.model';

describe('PageTab', () => {
    it("doesn't create the root section if the original object is undefined", () => {
        const pt = new PageTab();
        expect(pt.section).not.toBeDefined();
    });

    it("allows undefined section type", () => {
        const pt = new PageTab({});
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBeUndefined();
    });

    it("doesn't change the original object", () => {
        const obj = pageTabSample1();
        const pt = new PageTab(obj);
        expect(obj).toEqual(pageTabSample1());
    });

    it("extracts features from the original PageTab", () => {
        const pt = new PageTab({
            type: "Study",
            subsections: [
                {
                    type: "Feature1"
                },
                {
                    type: "Feature1"
                }
            ]
        });
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.features.length).toBe(1);

        const feature = pt.section.features[0];
        expect(feature.type).toBe('Feature1');
    });

    it("extracts files as a feature from an original PageTab", () => {
        const pt = new PageTab({
            type: "Study",
            files: [
                {
                    path: "path1",
                    attributes: [
                        {
                            name: "attr1",
                            value: "file1"
                        }
                    ]
                },
                {
                    path: "path2",
                    attributes: [
                        {
                            name: "attr1",
                            value: "file2"
                        }
                    ]
                }
            ]
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
                name: "attr1",
                value: "file1"
            },
            {
                name: "Path",
                value: "path1"
            }
        ]);
    });

    it("extracts links as a feature from an original PageTab", () => {
        const pt = new PageTab({
            type: "Study",
            links: [
                {
                    url: "url1",
                    attributes: [
                        {
                            name: "attr1",
                            value: "url1"
                        }
                    ]
                },
                {
                    url: "url2",
                    attributes: [
                        {
                            name: "attr1",
                            value: "url2"
                        }
                    ]
                }
            ]
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
                name: "attr1",
                value: "url1"
            },
            {
                name: "URL",
                value: "url1"
            }
        ]);
    });

    it("flattens double arrays", () => {
        const pt = new PageTab({
            type: "Study",
            files: [[
                {
                    path: "file1"
                },
                {
                    path: "file2"
                }
            ]],
            links: [[
                {
                    url: "url1"
                },
                {
                    url: "url2"
                }
            ]],
            subsections: [[
                {
                    type: "Feature1"
                },
                {
                    type: "Feature1"
                }
            ], [
                {
                    type: "Feature2"
                },
                {
                    type: "Feature2"
                }
            ]]
        });

        expect(pt.section).toBeDefined();
        expect(pt.section.type).toBe('Study');
        expect(pt.section.features.length).toEqual(4);

        const types = pt.section.features.map(f => f.type);
        expect(types.sort()).toEqual(['Feature1', 'Feature2', 'Link', 'File'].sort());
    });

    it("can be converted into submission object", () => {
        const pt = new PageTab({
            type: "Submission",
            accno: "123",
            section: {
                type: "Study",
                attributes: [
                    {
                        name: "Title",
                        value: "Title value"
                    },
                    {
                        name: "attr1",
                        value: "attr1 value"
                    }
                ],
                links: [{
                    url: "url1"
                }],
                files: [{
                    path: "file1"
                }]
            }
        });

        const type = SubmissionType.createDefault();
        const studyType = type.submType.sectionTypes[0];

        const subm = pt.toSubmission(type);
        expect(subm.root).toBeDefined();
        expect(subm.root.accno).toBe("123");
        expect(subm.root.type).toBeDefined();
        expect(subm.root.type.name).toBe('Submission');

        expect(subm.root.sections.length).toBe(1);

        const study = subm.root.sections.list()[0];
        expect(study.type).toBeDefined();
        expect(study.fields.length).toBe(studyType.fieldTypes.length);
        expect(study.annotations.size()).toBe(1);
        expect(study.features.length).toBe(studyType.featureTypes.length);
    });
});