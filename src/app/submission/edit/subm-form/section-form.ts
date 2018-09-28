import {Feature, Field, Section} from '../../shared/submission.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ValueValidators} from './value-validators';

export class FieldControl {
    readonly control: FormControl;

    constructor(readonly field: Field, readonly parentRef: string) {
        this.control = new FormControl(field.value, ValueValidators.forField(this.field, parentRef))
    }
}

export class FeatureForm {
    readonly form: FormGroup;

    constructor(readonly feature: Feature) {
        this.form = new FormGroup({
            columns: new FormGroup({}),
            rows: new FormArray([])
        });
    }

    get isEmpty(): boolean {
        return this.feature.rowSize() === 0;
    }
}

export class SectionForm {
    readonly form: FormGroup;

    readonly fieldControls: FieldControl[] = [];
    readonly featureForms: FeatureForm[] = [];

    constructor(section: Section) {
        this.form = new FormGroup({
            fields: new FormGroup({}),
            features: new FormGroup({})
        });

        section.fields.list().forEach(
            field => {
                this.addFieldControl(field, section.typeName);
            }
        );

        [section.annotations].concat(section.features.list()).forEach(
            feature => {
                this.addFeatureForm(feature);
            }
        );
    }

    private get fieldsForm(): FormGroup {
        return <FormGroup>this.form.get('fields');
    }

    private get featuresForm(): FormGroup {
        return <FormGroup>this.form.get('features');
    }

    private addFieldControl(field: Field, parentRef: string): void {
        const fieldControl = new FieldControl(field, parentRef);
        this.fieldControls.push(fieldControl);
        this.fieldsForm.addControl(field.id, fieldControl.control);
    }

    private addFeatureForm(feature: Feature) {
        const featureForm = new FeatureForm(feature);
        this.featureForms.push(featureForm);
        this.featuresForm.addControl(feature.id, featureForm.form);
    }
}