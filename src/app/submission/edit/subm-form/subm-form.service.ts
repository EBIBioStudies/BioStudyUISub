import {Injectable} from '@angular/core';
import {FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {SectionType, FeatureType, ColumnType, FieldType} from '../../shared/submission-template.model';
import {Section, Field, Feature, UpdateEvent, Attribute, ValueMap} from '../../shared/submission.model';

export class SectionForm {
    formErrors: {[key: string]: string} = {};
    readonly form: FormGroup;

    private section: Section;
    private sectionType: SectionType;

    private _fields: Field[] = [];
    private _features: Feature[] = [];

    private subscriptions: Subscription[] = [];
    private featureForms: {[key: string]: FeatureForm} = {};

    constructor(sectionWithType: [Section, SectionType]) {
        [this.section, this.sectionType] = sectionWithType;

        this.form = new FormGroup({
            fields: new FormGroup({}),
            features: new FormGroup({})
        });

        this.updateFieldControls();
        this.updateFeatureForms();

        this.subscriptions.push(
            this.section.fields
                .updates()
                .filter(ue => (['field_add', 'field_remove'].indexOf(ue.name) > -1))
                .subscribe(ue => {
                    this.updateFieldControls(ue);
                }));

        this.subscriptions.push(
            this.section.features
                .updates()
                .filter(ue => (['feature_add', 'feature_remove'].indexOf(ue.name) > -1))
                .subscribe(ue => {
                    this.updateFeatureForms(ue);
                }));

        /* this.form.valueChanges.subscribe(
         data =>
         this.onValueChanged(data)
         );
         this.onValueChanged();*/
    }

    get fields(): Field[] {
        return this._fields;
    }

    get features(): Feature[] {
        return this._features;
    }

    fieldControl(fieldId: string): FormControl {
        return <FormControl>this.fieldsFormGroup.get(fieldId);
    }

    featureForm(featureId: string): FeatureForm {
        return this.featureForms[featureId];
    }

    onValueChanged(data ?: any): void {
        if (!this.form) {
            return;
        }
        const form = this.form;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                for (const key in control.errors) {
                    this.formErrors[field] += this.validationMessage(key);
                }
            }
        }
    }

    validationMessage(key: string): string {
        //todo make it dependable from a field id as well
        const m = {
            'required': 'the value is required',
            'minlength': 'must be at least 50 characters long'
        };
        return m[key] || key;
    }

    valid(): boolean {
        //todo
        return false;
    }

    destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        for (let key in this.featureForms) {
            this.featureForms[key].destroy();
        }
    }

    private get fieldsFormGroup(): FormGroup {
        return <FormGroup>this.form.get('fields');
    }

    private get featuresFormGroup(): FormGroup {
        return <FormGroup>this.form.get('features');
    }

    private removeFieldControl(fieldId: string): void {
        this.fieldsFormGroup.removeControl(fieldId);
    }

    private addFieldControl(field: Field): void {
        const validators = [];
        const type = this.sectionType.getFieldType(field.name);
        if (type.required) {
            validators.push(Validators.required);
        }
        if (type.minlength > 0) {
            validators.push(Validators.minLength(type.minlength));
        }
        if (type.maxlength > 0) {
            validators.push(Validators.maxLength(type.maxlength));
        }
        this.fieldsFormGroup.addControl(field.id, new FormControl(field.value, validators));
        this.formErrors[field.id] = '';
    }

    private updateFieldControls(ue?: UpdateEvent): void {
        this._fields = this.section.fields.list().slice(0);
        if (ue && ue.name === 'field_remove') {
            this.removeFieldControl(ue.value.id);
            return;
        }

        let toAdd = this.fields;
        if (ue && ue.name === 'field_add') {
            toAdd = [this.fields[ue.value.index]];
        }

        toAdd.forEach(
            field => {
                this.addFieldControl(field);
            }
        );
    }

    private removeFeatureForm(featureId: string): void {
        this.featureForms[featureId].destroy();
        this.featureForms[featureId] = undefined;
        this.featuresFormGroup.removeControl(featureId);
    }

    private addFeatureForm(feature: Feature) {
        const type = this.sectionType.getFeatureType(feature.type, feature.singleRow);
        const featureForm = new FeatureForm([feature, type]);
        this.featureForms[feature.id] = featureForm;
        this.featuresFormGroup.addControl(feature.id, featureForm.form);
    }

    private updateFeatureForms(ue?: UpdateEvent): void {
        this._features = this.section.features.list().slice(0);
        if (ue && ue.name === 'feature_remove') {
            this.removeFeatureForm(ue.value.id);
            return;
        }

        let toAdd = this.features;
        if (ue && ue.name === 'feature_add') {
            toAdd = [this.features[ue.value.index]];
        }

        toAdd.forEach(
            feature => {
                this.addFeatureForm(feature);
            }
        );
    }
}

export class FeatureForm {
    readonly form: FormGroup;

    readonly feature: Feature;
    readonly featureType: FeatureType;

    private subscriptions: Subscription[] = [];
    private _columns: Attribute[] = [];
    private _rows: ValueMap[] = [];

    constructor(featureWithType: [Feature, FeatureType]) {
        [this.feature, this.featureType] = featureWithType;

        this.form = new FormGroup({
            columns: new FormGroup({}),
            rows: new FormArray([])
        });

        this.updateColumnControls();
        this.updateRowControls();

        this.subscriptions.push(
            this.feature.updates()
                .filter(ue => ue.source != undefined)
                .subscribe(ue => {
                    if (['column_add', 'column_remove'].indexOf(ue.source.name) > -1) {
                        this.updateColumnControls(ue);
                    }
                    if (['row_add', 'row_remove'].indexOf(ue.source.name) > -1) {
                        this.updateRowControls(ue);
                    }
                })
        );
    }

    get columns(): Attribute[] {
        return this._columns;
    }

    get rows(): ValueMap[] {
        return this._rows;
    }

    columnControl(columnId: string): FormControl {
        return <FormControl>this.columnsFormGroup.get(columnId);
    }

    rowValueControl(rowIndex: number, columnId: string): FormControl {
        const fg = this.rowsFormArray.at(rowIndex);
        return <FormControl>fg.get(columnId);
    }

    columnTmpl(columnId: string): ColumnType {
        const column = this.columns.find(c => c.id === columnId);
        return this.featureType.getColumnTemplate(column.name);
    }

    private removeColumnControl(columnId: string) {
        //todo
    }

    private removeRowArray(index: number) {
        //todo
    }

    private addColumnControl(column: Attribute) {
        const t = this.featureType.getColumnTemplate(column.name);
        const colValidators = [Validators.required];
        this.columnsFormGroup.addControl(column.id, new FormControl(column.name, colValidators));
        this.rows.forEach(
            (row, rowIndex) => {
                const fg = (<FormGroup>this.rowsFormArray.at(rowIndex));
                this.addRowValueControl(fg, column.id, row, t);
            }
        );
    }

    private addRowArray(row: ValueMap) {
        const formGroup = new FormGroup({});
        this.rowsFormArray.push(formGroup);

        this.columns.forEach(
            column => {
                const t = this.featureType.getColumnTemplate(column.name);
                this.addRowValueControl(formGroup, column.id, row, t);
            });
    }

    private addRowValueControl(fg: FormGroup, columnId: string, row: ValueMap, tmpl: ColumnType): void {
        const valueValidators = [];
        if (tmpl.required) {
            valueValidators.push(Validators.required);
        }
        fg.addControl(columnId, new FormControl(row.valueFor(columnId).value, valueValidators));
    }

    private updateColumnControls(ue?: UpdateEvent): void {
        this._columns = this.feature.columns.slice(0);

        if (ue && ue.name === 'column_remove') {
            this.removeColumnControl(ue.value.id);
            return;
        }

        let toAdd: Attribute[] = this.columns;
        if (ue && ue.name === 'column_add') {
            toAdd = [this.columns[ue.value.index]];
        }

        toAdd.forEach(
            (column: Attribute) => {
                this.addColumnControl(column);
            }
        );
    }

    private updateRowControls(ue?: UpdateEvent): void {
        this._rows = this.feature.rows.slice(0);

        if (ue && ue.name === 'row_remove') {
            this.removeRowArray(ue.value.index);
            return;
        }

        let toAdd: ValueMap[] = this.rows;
        if (ue && ue.name === 'row_add') {
            toAdd = [this.rows[ue.value.index]];
        }

        toAdd.forEach(
            (row: ValueMap) => {
                this.addRowArray(row);
            }
        );
    }

    private get columnsFormGroup(): FormGroup {
        return <FormGroup>this.form.get('columns');
    }

    private get rowsFormArray(): FormArray {
        return <FormArray>this.form.get('rows');
    }

    destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }
}

@Injectable()
export class SubmFormService {
    private sectionForm: SectionForm;

    createForm(sectionWithType: [Section, SectionType]): SectionForm {
        if (this.sectionForm) {
            this.sectionForm.destroy();
        }
        return new SectionForm(sectionWithType);
    }
}