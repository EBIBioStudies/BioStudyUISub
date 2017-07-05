import {Submission, Section} from './submission.model';
import {SubmissionTemplate, SectionTemplate, FieldTemplate, FeatureTemplate} from './submission-template.model';

export function createSubmission(tmpl: SubmissionTemplate): Submission {
    const subm = new Submission();
    tmpl.sections.forEach(
        (st: SectionTemplate) => {
            if (st.required) {
                addSection(subm.root, st);
            }
        }
    );
    return subm;
}

export function addSection(sec:Section, tmpl:SectionTemplate): void {
    const newSec = sec.sections.add(tmpl.type);

    tmpl.fields.forEach(
        (ft: FieldTemplate) => {
            if (ft.required) {
                addField(newSec, ft);
            }
        }
    );
    tmpl.features.forEach(
        (ft: FeatureTemplate) => {
            if (ft.required) {
                addFeature(newSec, ft);
            }
        }
    );
    tmpl.sections.forEach(
        (st: SectionTemplate) => {
            if (st.required) {
                addSection(newSec, st);
            }
        }
    );
}

export function addField(sec: Section, tmpl: FieldTemplate): void {
    sec.fields.add(tmpl.name, '', tmpl.type);
}

export function addFeature(sec: Section, tmpl: FeatureTemplate): void {
    sec.features.add(tmpl.type, tmpl.singleRow);
}


