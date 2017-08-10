import {SubmissionValidator} from './submission.validator';
import {SubmissionType} from './submission-type.model';
import {Submission} from './submission.model';

describe('Submission Validator', () => {

    it('validates field values', () => {
        const submType = new SubmissionType({
            sectionType: {
                name: 'SectionType',
                fieldTypes: [
                    {
                        name: 'FieldType1',
                    },
                    {
                        name: 'FieldType2'
                    }
                ]
            }
        });

        const subm = new Submission(submType);
        let errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(2);

        subm.root.fields.list().forEach(fld => fld.value = '123');
        errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(0);
    });

    it('validates feature values', () => {
        const submType = new SubmissionType({
            sectionType: {
                name: 'SectionType',
                featureTypes: [
                    {
                        name: 'FeatureType',
                        required: true,
                        columnTypes: [
                            {
                                name: 'Title',
                                required: true
                            },
                            {
                                name: 'Description'
                            }
                        ]
                    }
                ]
            }
        });
        const subm = new Submission(submType);
        let errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(1); // one row, one required column

        const feature = subm.root.features.list()[0];
        feature.columns.forEach(c => {
            if (c.name === 'Title') {
                feature.rows[0].valueFor(c.id).value = '123';
            }
        });
        errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(0);
    });

    it('validates value format', () => {
        const submType = new SubmissionType({
            sectionType: {
                name: 'SectionType',
                fieldTypes: [
                    {
                        name: 'FieldType1',
                        valueType: 'date'
                    },
                    {
                        name: 'FieldType2',
                        valueType: 'text',
                        minlength: 5
                    }
                ]
            }
        });

        const subm = new Submission(submType);
        let errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(2);

        subm.root.fields.list().forEach(fld => fld.value = 'v');
        errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(2); // date format is invalid; text value is too short

        subm.root.fields.list().forEach(fld => {
            if (fld.type.name === 'FieldType1') {
                fld.value = '2017-09-09';
            }
            if (fld.type.name === 'FieldType2') {
                fld.value = '12345';
            }
        });
        errors = SubmissionValidator.validate(subm);
        expect(errors.total()).toEqual(0);
    })
});
