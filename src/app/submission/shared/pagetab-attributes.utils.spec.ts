import {attachTo, copyAttributes} from './pagetab-attributes.utils';

describe('Submission Attributes:', () => {
    it('joins attributes from submission root and submission.section.attributes', () => {
        const result = copyAttributes({
            type: 'Submission',
            attributes: [
                {
                    name: 'attr1',
                    value: 'value1'
                },
                {
                    name: 'attr2',
                    value: 'value2'
                }
            ],
            section: {
                type: 'Study',
                attributes: [
                    {
                        name: 'attr3',
                        value: 'value3'
                    }
                ]
            }
        });

        expect(result).toBeDefined();
        expect(result.attributes.length).toBe(2);
        expect(result.section.attributes.length).toBe(3);

        expect(result.attributes.map(a => a.value).sort()).toEqual(['value1', 'value2']);
        expect(result.section.attributes.map(a => a.value).sort()).toEqual(['value1', 'value2', 'value3']);
    });

    it('does nothing if there are no submission attributes (1)', () => {
        const result = copyAttributes({
            type: 'Submission',
            section: {
                type: 'Study',
                attributes: [
                    {
                        name: 'attr3',
                        value: 'value3'
                    }
                ]
            }
        });

        expect(result).toBeDefined();
        expect(result.attributes).toBeUndefined();
        expect(result.section.attributes.length).toBe(1);

        expect(result.section.attributes.map(a => a.value)).toEqual(['value3']);
    });

    it('does nothing if there are no submission attributes (2)', () => {
        const result = copyAttributes({
            type: 'Submission',
            section: {
                type: 'Study'
            }
        });

        expect(result).toBeDefined();
        expect(result.attributes).toBeUndefined();
        expect(result.section.attributes).toBeUndefined();
    });


    it('copies submission attributes to study if there are no any', () => {
        const result = copyAttributes({
            type: 'Submission',
            attributes: [
                {
                    name: 'attr1',
                    value: 'value1'
                },
                {
                    name: 'attr2',
                    value: 'value2'
                }
            ],
            section: {
                type: 'Study'
            }
        });

        expect(result).toBeDefined();
        expect(result.attributes.length).toBe(2);
        expect(result.section.attributes.length).toBe(2);

        expect(result.attributes).toEqual(result.section.attributes);
    });

    it('does not attach projects to an undefined object', () => {
        const newObj = attachTo(undefined, []);
        expect(newObj).toBeUndefined();
    });

    it('creates empty list of attributes and adds AttachTo attributes to it', () => {
        const projects = ['proj1', 'proj2'];
        let obj: any = {};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual(projects.map(p => {
            return {name: 'AttachTo', value: p}
        }));
    });

    it('adds AttachTo attributes to the existing list of attributes', () => {
        const projects = ['proj1', 'proj2'];
        const attr = {name: 'otherAttr', value: 'otherValue'};
        let obj: any = {attributes: [attr]};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual([[attr], projects.map(p => {
            return {name: 'AttachTo', value: p}
        })]);
    });

    it('replaces AttachTo attributes in the attribute list', () => {
        const projects = ['proj1', 'proj2'];
        const attr = {name: 'otherAttr', value: 'otherValue'};
        let obj: any = {attributes: [attr]};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual([[attr], projects.map(p => {
            return {name: 'AttachTo', value: p}
        })]);
    });
});
