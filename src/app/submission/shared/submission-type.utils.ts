import {
    Submission,
    Section,
    Feature
} from './submission.model';

import {
    SubmissionType,
    SectionType,
    FieldType,
    FeatureType,
    ColumnType
} from './submission-type.model';

export function createSubmission(type: SubmissionType): Submission {
    const sectionType = type.sectionTypes.length > 0 ? type.sectionTypes[0] :
        SectionType.createDefault('Submission');

    const subm = new Submission(sectionType);

    sectionType.sectionTypes.forEach(
        (sectionType: SectionType) => {
            if (sectionType.required) {
                addSection(subm.root, sectionType);
            }
        }
    );
    return subm;
}

export function addSection(sec: Section, type: SectionType): void {
    const newSec = sec.sections.add(type);

    type.fieldTypes.forEach(
        (fieldType: FieldType) => {
            addField(newSec, fieldType);
        }
    );
    type.featureTypes.forEach(
        (featureType: FeatureType) => {
            // adding all features (not just required only)
            addFeature(newSec, featureType);
        }
    );
    type.sectionTypes.forEach(
        (sectionType: SectionType) => {
            if (sectionType.required) {
                addSection(newSec, sectionType);
            }
        }
    );
}

export function addField(sec: Section, type: FieldType): void {
    sec.fields.add(type.name, '');
}

export function addFeature(sec: Section, type: FeatureType): void {
    const feature: Feature = sec.features.add(type);
    type.columnTypes.forEach(
        (columnType: ColumnType) => {
            if (columnType.required) {
                feature.addColumn(columnType)
            }
        }
    )
}