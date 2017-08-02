import {Section} from './submission.model';
import {SectionType} from './submission-type.model';

describe('Submission Model: Section', () => {
    it('can be empty', () => {
        const sec = new Section(SectionType.createDefault('MySectionType'));
        expect(sec.type.name).toBe('MySectionType');
        expect(sec.typeName).toBe('MySectionType');
        expect(sec.accno).toBe('');
        expect(sec.annotations.size()).toBe(0);
        expect(sec.fields.length).toBe(0);
        expect(sec.features.length).toBe(0);
        expect(sec.sections.length).toBe(0);
    });

    it('auto creates all fields declared in the type', () => {
        const type = new SectionType('MySectionType', {
            fieldTypes: [
                {
                    name: 'Field1'
                },
                {
                    name: 'Field2'
                }
            ]
        });
        const sec = new Section(type);
        expect(sec.typeName).toBe('MySectionType');
        expect(sec.fields.length).toBe(2);
    });

    it('auto creates all features declared in the type', () => {
        const type = new SectionType('MySectionType', {
            featureTypes: [
                {
                    name: 'Feature1',
                    required: true
                },
                {
                    name: 'Feature2',
                    required: false
                }
            ]
        });
        const sec = new Section(type);
        expect(sec.typeName).toBe('MySectionType');
        expect(sec.features.length).toBe(2);
    });

    it('auto creates required-only sections declared in the type', () => {
        const type = new SectionType('MySectionType', {
            sectionTypes: [
                {
                    name: 'Section1',
                    required: true
                },
                {
                    name: 'Feature2',
                    required: false
                }
            ]
        });
        const sec = new Section(type);
        expect(sec.typeName).toBe('MySectionType');
        expect(sec.sections.length).toBe(1);
    });
});