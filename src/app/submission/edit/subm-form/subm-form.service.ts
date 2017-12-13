import {Injectable} from '@angular/core';
import {
    FormGroup,
    Validators,
    FormControl,
    FormArray
} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {
    ColumnType,
    FeatureType,
    FieldType
} from '../../shared/submission-type.model';
import {
    Section,
    Field,
    Feature,
    UpdateEvent,
    Attribute,
    ValueMap
} from '../../shared/submission.model';

/**
 * Augments the FormControl class with various pointers to structures related to the control for ease of access during
 * rendering. Hence, the term "field" here refers to the rendered state of the control.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
export class FieldControl extends FormControl {
    static numPending: number = 0;          //total number of touched controls still invalid
    template: Field | Attribute;            //the control's model containing reference properties such as its name
    parentType: FieldType | FeatureType;    //the type descriptor the control refers to for things such as validation
    nativeElement: HTMLElement;             //DOM element the control is rendered into

    /**
     * Instantiates a simple form control with validators, keeping a reference to related model or type structures.
     * @param value - Initial value of the new control.
     * @param validators - Validation routines for the control.
     * @param {Field | Attribute} template - The reference model for the control.
     * @param {FieldType | FeatureType} parentType - The reference type descriptor for the control.
     * @param {HTMLElement} nativeEl - DOM element which the control render into.
     */
    constructor(value: any, validators: any, template: Field | Attribute, parentType: FieldType | FeatureType, nativeEl?: HTMLElement | null) {
        super(value, validators);
        this.template = template;
        this.parentType = parentType;
        this.nativeElement = nativeEl;
    }

    /**
     * Recursively traverses a given form grouping to mark all its controls as touched.
     * @param {FormGroup | FormArray} formGroup - Group containing all controls, regardless of any nested groups or arrays.
     * {@link https://stackoverflow.com/a/44150793}
     */
    static groupTouched(formGroup: FormGroup | FormArray) {

        //Alternative to ES7's Object.values() method to get all controls within the grouping
        (<any>Object).keys(formGroup.controls).map(key => formGroup.controls[key]).forEach(control => {
            control.markAsTouched();

            //Branches will always have a further "controls" property
            control.controls && this.groupTouched(control);
        });
    }

    /**
     * Recursively traverses a given form grouping to get all controls as a flattened array.
     * @param {FormGroup | FormArray} formGroup - Group containing all controls, regardless of any nested groups or arrays.
     * @param {FormControl[]} controlList - Flattened array of form controls.
     */
    static toArray(formGroup: FormGroup | FormArray, controlList: FormControl[]) {

        //Alternative to ES7's Object.values() method to get all controls within the grouping
        (<any>Object).keys(formGroup.controls).map(key => formGroup.controls[key]).forEach(control => {
            if (control.controls) {
                this.toArray(control, controlList);

            //Leaf objects characterised by a "template" property (the name of the control)
            } else if (control.template) {
                controlList.push(control);

                //Keeps track of controls that have been modified but still invalid
                if (control.touched && control.invalid) {
                    this.numPending++;
                }
            }
        });
    }

    /**
     * Determines all the error messages for each of the members of a given control group.
     * @param parent The structure encompassing this control group.
     * @param {FormGroup} fieldsGroup - The group of fields for which errors are to be determined
     * @returns {{[key: string]: string}} to error message map.
     */
    static getErrors(parent: any, fieldsGroup: FormGroup): { [key: string]: string } {
        const formErrors: { [key: string]: string } = {};
        let control;

        fieldsGroup.controls && Object.keys(fieldsGroup.controls).forEach(fieldId => {
            formErrors[fieldId] = '';
            control = fieldsGroup.get(fieldId);
            if (control && !control.valid) {
                Object.keys(control.errors).forEach(key => {
                    formErrors[fieldId] += this.errorMessage(parent, control.template.name, key, control.errors[key]);
                });
            }
        });

        return formErrors;
    }

    /**
     * Builds the string to be used as a validation error message.
     * @param parent - Structure that encompasses the control, eg: feature.
     * @param {string} fieldName - Name with which the control will be identified to the user.
     * @param {string} errorKey - Property in error object pointing to the type of issue.
     * @param errorString - Value of the property in error object.
     * @returns {string} The error message.
     */
    static errorMessage(parent: any, fieldName: string, errorKey: string, errorString?: any | null): string {
        if (errorKey === 'required') {
            return `Please enter the ${parent.typeName.toLowerCase()}'s ${fieldName.toLowerCase()}`;
        }
        if (errorKey === 'minlength') {
            const type = parent.type.getFieldType(fieldName);
            return `Please use at least ${type.minlength} characters`;
        }
        if (errorKey === 'maxlength') {
            const type = parent.type.getFieldType(fieldName);
            return `Please use up to ${type.maxlength} characters`;
        }
        if (errorKey === 'pattern') {
            const type = parent.type.getFieldType(fieldName);
            return `Please match the ${errorString} format`;
        }
        return errorKey;
    }
}

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
            data => this.formErrors = FieldControl.getErrors(this.section, this.fieldsFormGroup)
        );
        this.formErrors = FieldControl.getErrors(this.section, this.fieldsFormGroup);
    }

    get fields(): Field[] {
        return this._fields;
    }

    get features(): Feature[] {
        return this._features;
    }

    /**
     * Traverses the form in its entirety in order to get all its controls, both the section's and features' controls.
     * While at it, it initialises the current number of pending fields.
     * @param {FormControl[]} controls - Final array with all the form's controls.
     */
    controls(controls: FormControl[]) {
        FieldControl.numPending = 0;

        controls.length = 0;
        FieldControl.toArray(this.fieldsFormGroup, controls);
        FieldControl.toArray(this.featuresFormGroup, controls);
    }

    fieldControl(fieldId: string): FieldControl {
        return <FieldControl>this.fieldsFormGroup.get(fieldId);
    }

    featureForm(featureId: string): FeatureForm {
        return this.featureForms.get(featureId);
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
        const type = this.section.type.getFieldType(field.name);
        const validators = [];
        let control;

        if (type.required) {
            validators.push(Validators.required);
        }
        if (type.minlength > 0) {
            validators.push(Validators.minLength(type.minlength));
        }
        if (type.maxlength > 0) {
            validators.push(Validators.maxLength(type.maxlength));
        }

        control = new FieldControl(field.value, validators, field, field.type);
        this.fieldsFormGroup.addControl(field.id, control);
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

    /**
     * Marks all the controls of the section and its features as touched.
     */
    markAsTouched(): void {
        FieldControl.groupTouched(this.fieldsFormGroup);
        FieldControl.groupTouched(this.featuresFormGroup);
    }
}

export class FeatureForm {
    readonly form: FormGroup;
    readonly feature: Feature;

    private subscriptions: Subscription[] = [];
    private _columns: Attribute[] = [];
    private _rows: ValueMap[] = [];

    rowErrors: { [key: string]: string }[] = [];

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

                //Removes the error entry in the current row for the deleted column
                delete this.rowErrors[rowIndex][colId];
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

                //Regenerates the field errors for the whole current row
                this.addRowErrors(fg);
            }
        );
    }

    private removeRowArray(index: number) {
        this.rowsFormArray.removeAt(index);
    }

    /**
     * Adds a new row to the array of form groups representing the feature's rows.
     * @param {ValueMap} row Set of values for each of the row's controls.
     * @returns {FormGroup} The form group corresponding to the row just added.
     */
    private addRowArray(row: ValueMap): FormGroup {
        const formGroup = new FormGroup({});
        this.rowsFormArray.push(formGroup);

        this.columns.forEach(
            column => {
                const t = this.feature.type.getColumnType(column.name);
                this.addRowValueControl(formGroup, column.id, row, t);
            });

        return formGroup;
    }

    private addRowValueControl(fg: FormGroup, columnId: string, row: ValueMap, tmpl: ColumnType): void {
        const valueValidators = [];     //validators for the control
        let colAttr;                    //attribute corresponding to the column under which this control will lie
        let control;

        if (tmpl.required) {
            valueValidators.push(Validators.required);
        }

        colAttr = this.columns.find(column => column.id === columnId);
        control = new FieldControl(row.valueFor(columnId).value, valueValidators, colAttr, this.feature.type);
        fg.addControl(columnId, control);
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
            this.rowErrors.splice(ue.source.value.index, 1);
            return;
        }

        let toAdd: ValueMap[] = this.rows;
        if (ue && ue.source && ue.source.name === 'row_add') {
            toAdd = [this.rows[ue.source.value.index]];
        }

        toAdd.forEach(
            (row: ValueMap) => {
                this.addRowErrors(this.addRowArray(row));
            }
        );
    }

    private addRowErrors(rowGroup: FormGroup) {
        const newIdx = this.rowsFormArray.controls.indexOf(rowGroup);

        rowGroup.valueChanges.subscribe((data) => {
            this.rowErrors[newIdx] = FieldControl.getErrors(this.feature, rowGroup);
        });
        this.rowErrors[newIdx] = FieldControl.getErrors(this.feature, rowGroup);
    }

    /**
     * Marks the controls of every row of the feature as touched
     */
    private markAsTouched(): void {
        FieldControl.groupTouched(this.rowsFormArray);
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
