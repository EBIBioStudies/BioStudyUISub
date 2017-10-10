import {Injectable} from '@angular/core';
import {
    FormGroup,
    Validators,
    FormControl,
    FormArray
} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {
    ColumnType
} from '../../shared/submission-type.model';
import {
    Section,
    Field,
    Feature,
    UpdateEvent,
    Attribute,
    ValueMap
} from '../../shared/submission.model';

export class SectionForm {
    formErrors: { [key: string]: string } = {};
    readonly form: FormGroup;

    private section: Section;

    private _fields: Field[] = [];
    private _features: Feature[] = [];

    private subscriptions: Subscription[] = [];
    private featureForms: Map<string, FeatureForm> = new Map();

    constructor(section: Section) {
        this.section = section;

        this.form = new FormGroup({
            fields: new FormGroup({}),
            features: new FormGroup({})
        });

        this.createFieldControls();
        this.updateFeatureForms();

        this.subscriptions.push(
            this.section.features
                .updates()
                .filter(ue => (['feature_add', 'feature_remove'].indexOf(ue.name) > -1))
                .subscribe(ue => {
                    this.updateFeatureForms(ue);
                }));

        this.fieldsFormGroup.valueChanges.subscribe(
            data => this.onFieldValueChanged(data)
        );
        this.onFieldValueChanged();
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
        return this.featureForms.get(featureId);
    }

    onFieldValueChanged(data ?: any): void {
        if (!this.form) {
            return;
        }
        const form = this.fieldsFormGroup;

        this.fields.forEach(field => {
            this.formErrors[field.id] = '';
            const control = form.get(field.id);
            if (control && control.dirty && !control.valid) {
                Object.keys(control.errors).forEach(key => {
                    this.formErrors[field.id] += this.fieldErrorMessage(field, key);
                });
            }
        });
    }

    fieldErrorMessage(field: Field, key: string): string {
        if (key === 'required') {
            return 'the value is required';
        }
        if (key === 'minlength') {
            const type = this.section.type.getFieldType(field.name);
            return `must be at least  ${type.minlength} characters long`;
        }
        if (key === 'maxlength') {
            const type = this.section.type.getFieldType(field.name);
            return `must be no more than ${type.maxlength} characters long`;
        }
        return key;
    }

    valid(): boolean {
        return this.form.valid;
    }

    destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];

        Array.from(this.featureForms.values()).forEach(
            form => form.destroy()
        )
    }

    private get fieldsFormGroup(): FormGroup {
        return <FormGroup>this.form.get('fields');
    }

    private get featuresFormGroup(): FormGroup {
        return <FormGroup>this.form.get('features');
    }

    private addFieldControl(field: Field): void {
        const validators = [Validators.required];

        const type = this.section.type.getFieldType(field.name);
        if (type.minlength > 0) {
            validators.push(Validators.minLength(type.minlength));
        }
        if (type.maxlength > 0) {
            validators.push(Validators.maxLength(type.maxlength));
        }
        this.fieldsFormGroup.addControl(field.id, new FormControl(field.value, validators));
    }

    private createFieldControls(): void {
        this._fields = this.section.fields.list().slice(0);
        this._fields.forEach(
            field => {
                this.addFieldControl(field);
            }
        );
    }

    private removeFeatureForm(featureId: string): void {
        this.featureForms.get(featureId).destroy();
        this.featureForms.delete(featureId);
        this.featuresFormGroup.removeControl(featureId);
    }

    private addFeatureForm(feature: Feature) {
        const featureForm = new FeatureForm(feature);
        this.featureForms.set(feature.id, featureForm);
        this.featuresFormGroup.addControl(feature.id, featureForm.form);
    }

    private updateFeatureForms(ue?: UpdateEvent): void {
        this._features = [this.section.annotations].concat(this.section.features.list());

        if (ue && ue.name === 'feature_remove') {
            this.removeFeatureForm(ue.value.id);
            return;
        }

        let toAdd = this._features;
        if (ue && ue.name === 'feature_add') {
            toAdd = [this._features[ue.value.index + 1]];
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

    private subscriptions: Subscription[] = [];
    private _columns: Attribute[] = [];
    private _rows: ValueMap[] = [];

    constructor(feature: Feature) {
        this.feature = feature;

        this.form = new FormGroup({
            columns: new FormGroup({}),
            rows: new FormArray([])
        });

        this.updateColumnControls();
        this.updateRowControls();

        this.subscriptions.push(
            this.feature.updates()
                .filter(ue => ue.source !== undefined)
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

    columnControl(colId: string): FormControl {
        return <FormControl>this.columnsFormGroup.get(colId);
    }

    rowValueControl(rowIndex: number, colId: string): FormControl {
        const fg = this.rowsFormArray.at(rowIndex);
        return <FormControl>fg.get(colId);
    }

    columnType(colId: string): ColumnType {
        const column = this.columns.find(c => c.id === colId);
        return this.feature.type.getColumnType(column.name);
    }

    destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
    }

    private get columnsFormGroup(): FormGroup {
        return <FormGroup>this.form.get('columns');
    }

    private get rowsFormArray(): FormArray {
        return <FormArray>this.form.get('rows');
    }

    private removeColumnControl(colId: string) {
        this.columnsFormGroup.removeControl(colId);
        this.rows.forEach(
            (row, rowIndex) => {
                (<FormGroup>this.rowsFormArray.at(rowIndex)).removeControl(colId);
            }
        );
    }

    private addColumnControl(column: Attribute) {
        const t = this.feature.type.getColumnType(column.name);
        const colValidators = [Validators.required];
        this.columnsFormGroup.addControl(column.id, new FormControl(column.name, colValidators));
        this.rows.forEach(
            (row, rowIndex) => {
                const fg = (<FormGroup>this.rowsFormArray.at(rowIndex));
                this.addRowValueControl(fg, column.id, row, t);
            }
        );
    }

    private removeRowArray(index: number) {
        this.rowsFormArray.removeAt(index);
    }

    private addRowArray(row: ValueMap) {
        const formGroup = new FormGroup({});
        this.rowsFormArray.push(formGroup);

        this.columns.forEach(
            column => {
                const t = this.feature.type.getColumnType(column.name);
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
        this._columns = this.feature.columns;

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
        this._rows = this.feature.rows;

        if (ue && ue.source && ue.source.name === 'row_remove') {
            this.removeRowArray(ue.source.value.index);
            return;
        }

        let toAdd: ValueMap[] = this.rows;
        if (ue && ue.source && ue.source.name === 'row_add') {
            toAdd = [this.rows[ue.source.value.index]];
        }

        toAdd.forEach(
            (row: ValueMap) => {
                this.addRowArray(row);
            }
        );
    }
}

@Injectable()
export class SubmFormService {
    private sectionForm: SectionForm;

    createForm(section: Section): SectionForm {
        if (this.sectionForm) {
            this.sectionForm.destroy();
        }
        return section === undefined ? undefined : new SectionForm(section);
    }
}
