import {Submission, Section, Feature} from './submission.model';
import {SubmissionType, SectionType, FieldType, FeatureType, ColumnType} from './submission-template.model';

export function createSubmission(type: SubmissionType): Submission {
    const sectionType = type.sectionTypes.length > 0 ? type.sectionTypes[0] :
        SectionType.createDefault('Submission');

    const subm = new Submission(sectionType.name);

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
    const newSec = sec.sections.add(type.name);

    type.fieldTypes.forEach(
        (fieldType: FieldType) => {
            if (fieldType.required) {
                addField(newSec, fieldType);
            }
        }
    );
    type.featureTypes.forEach(
        (featureType: FeatureType) => {
            if (featureType.required) {
                addFeature(newSec, featureType);
            }
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
    const feature: Feature = sec.features.add(type.name, type.singleRow);
    type.columnTypes.forEach(
        (columnType: ColumnType) => {
             if (columnType.required) {
                feature.addColumn(columnType)
             }
        }
    )
}

/*
export function sectionWithTmplById(sectionId: string): SectionType {
        let sec = this.subm.sectionById(sectionId);
        const types: string[] = this.subm
            .sectionPath(sectionId)
            .map(s => s.type);

        let tmpl = this.tmpl.getSectionTemplate(types.splice(1));
        return new SectionWithTemplate(sec, tmpl || SectionTemplate.createDefault(sec.type));
    }
}
*/
