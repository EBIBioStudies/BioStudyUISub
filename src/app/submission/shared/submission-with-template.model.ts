import {Submission, Section, Feature} from './submission.model';
import {SubmissionTemplate, SectionTemplate, FieldTemplate, FeatureTemplate} from './submission-template.model';

export class FeatureWithTemplate {
    readonly feature: Feature;
    readonly tmpl: FeatureTemplate;

    constructor(feature: Feature, tmpl: FeatureTemplate) {
        this.feature = feature;
        this.tmpl = tmpl || FeatureTemplate.createDefault(feature.type, feature.singleRow);
    }

    addItem() {
        //TODO try to create column according the template
        if (this.feature.singleRow) {
            this.feature.addColumn();
            return;
        }
        if (this.feature.colSize() === 0) {
            this.feature.addColumn();
        }
        this.feature.addRow();
    }
}

export class SectionWithTemplate {
    readonly section: Section;
    readonly tmpl: SectionTemplate;

    constructor(section: Section, tmpl?: SectionTemplate) {
        this.section = section;
        this.tmpl = tmpl || SectionTemplate.createDefault(section.type);
    }

    get features(): FeatureWithTemplate[] {
       return this.section.features.list().map(
           f => {
               const tmpl = this.tmpl.getFeatureTemplate(f.type);
               return new FeatureWithTemplate(f, tmpl);
           }
       )
    }

    addField(fieldName: string): void {
        let tmpl = this.tmpl.getFieldTemplate(fieldName);
        if (tmpl === undefined) {
            tmpl = FieldTemplate.createDefault(fieldName);
        }
        this.section.fields.add(tmpl.name, '', tmpl.type);
    }

    addFeature(featureName: string, singleRow: boolean): void {
        let tmpl = this.tmpl.getFeatureTemplate(featureName);
        if (tmpl === undefined) {
            tmpl = FeatureTemplate.createDefault(featureName, singleRow);
        }
        this.section.features.add(tmpl.type, tmpl.singleRow);
        //TODO: add required columns
    }

    addSection(sectionType: string): void {
        let tmpl = this.tmpl.getSectionTemplate([sectionType]);
        if (tmpl === undefined) {
            tmpl = SectionTemplate.createDefault(sectionType);
        }
        this.section.sections.add(tmpl.type);
        //TODO: add required fields, features and sections recursively
    }
}

export class SubmissionWithTemplate {
    readonly subm: Submission;
    readonly tmpl: SubmissionTemplate;

    constructor(subm: Submission, tmpl?: SubmissionTemplate) {
        this.tmpl = tmpl || SubmissionTemplate.createDefault();
        this.subm = subm;
    }

    sectionWithTmplById(sectionId: string) {
        let sec = this.subm.sectionById(sectionId);
        const types: string[] = this.subm
            .sectionPath(sectionId)
            .map(s => s.type);

        let tmpl = this.tmpl.getSectionTemplate(types.splice(1));
        return new SectionWithTemplate(sec, tmpl || SectionTemplate.createDefault(sec.type));
    }
}
