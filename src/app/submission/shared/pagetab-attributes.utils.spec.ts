import {copyAttributes} from './pagetab-attributes.utils';

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
});
