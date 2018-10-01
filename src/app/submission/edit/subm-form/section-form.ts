import {Attribute, Feature, Field, Section, ValueMap} from '../../shared/submission.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ErrorMessages, ValueValidators} from './value-validators';
import {ColumnType, ValueType} from '../../shared/submission-type.model';

export class FieldControl {
    readonly control: FormControl;

    constructor(readonly field: Field, readonly parentRef: string) {
        this.control = new FormControl(field.value, ValueValidators.forField(this.field, parentRef))
    }

    get errors(): string[] {
        return ErrorMessages.map(this.control.errors);
    }
}

export class ColumnControl {
    readonly control: FormControl;

    constructor(private column: Attribute, readonly parentRef: string) {
        this.control = new FormControl(column.name, ValueValidators.forColumn(column, parentRef));
    }

    get isRemovable(): boolean {
        return this.column.isRemovable
    }

    get isRequired(): boolean {
        return this.column.isRequired;
    }

    get isDisplayed() {
        return this.column.isDisplayed;
    }

    get id(): string {
        return this.column.id;
    }

    get name(): string {
        return this.column.name;
    }

    get valueType(): ValueType {
        return this.column.valueType;
    }
}

export class CellControl {
    readonly control: FormControl;

    constructor(value: string, column: Attribute, readonly parentRef: string) {
        this.control = new FormControl(value, ValueValidators.forCell(column, parentRef));
    }

    errors(): string[] {
        return ErrorMessages.map(this.control.errors);
    }
}

export class RowForm {
    readonly form: FormGroup;

    private controls: Map<String, CellControl> = new Map();

    constructor(private row: ValueMap, columns: Attribute[], private parentRef: string) {
        this.form = new FormGroup({});

        columns.forEach(column => this.addCellControl(column));
    }

    addCellControl(column: Attribute) {
        const cellControl = new CellControl(this.row.valueFor(column.id)!.value, column, this.parentRef);
        this.form.addControl(column.id, cellControl.control);
        this.controls.set(column.id, cellControl);
    }

    cellControlAt(columnId: string): CellControl | undefined {
        return this.controls.get(columnId);
    }
}

/**
 *
 *
 *  private addColumnControl(column: Attribute) {
        const t = this.feature.type.getColumnType(column.name);
        const colValidators = [nonBlankVal()];
        this.columnsFormGroup.addControl(column.id, new FormControl(column.name, colValidators));
        this.rows.forEach((row, rowIndex) => {
            const fg = (<FormGroup>this.rowsFormArray.at(rowIndex));
            this.addRowValueControl(fg, column.id, row, t!);

            //Regenerates the field errors for the whole current row
            this.addRowErrors(fg);
        });
    }

 private addRowArray(row: ValueMap): FormGroup {
        const formGroup = new FormGroup({});
        this.rowsFormArray.push(formGroup);

        this.columns.forEach(
            column => {
                const t = this.feature.type.getColumnType(column.name);
                this.addRowValueControl(formGroup, column.id, row, t!);
            });

        return formGroup;
    }

 private addRowValueControl(fg: FormGroup, columnId: string, row: ValueMap, tmpl: ColumnType): void {
        const valueValidators: ValidatorFn[] = [];     //validators for the control
        let colAttr;                    //attribute corresponding to the column under which this control will lie
        let control;

        //TODO: follow a recipe similar to addFieldControl's to support other validators
        if (tmpl.required) {
            valueValidators.push(nonBlankVal());
        }

        colAttr = this.columns.find(column => column.id === columnId);
        control = new FieldControlOld(row.valueFor(columnId)!.value, valueValidators, colAttr, this.feature.type);
        fg.addControl(columnId, control);
    }

 */
export class FeatureForm {
    readonly form: FormGroup;

    private columnControls: ColumnControl[] = [];
    private rowForms: RowForm[] = [];

    constructor(private feature: Feature) {
        this.form = new FormGroup({
            columns: new FormGroup({}),
            rows: new FormArray([])
        });

        feature.columns.forEach(column => {
                this.addColumnControl(column);
            }
        );

        feature.rows.forEach(row => {
            this.addRowForm(row, feature.columns);
        });
    }

    private get columnsForm(): FormGroup {
        return <FormGroup>this.form.get('columns');
    }

    private rowForm(index: number): FormGroup {
        return <FormGroup>(<FormArray>this.form.get('rows')).at(index);
    }

    get isEmpty(): boolean {
        return this.feature.rowSize() === 0;
    }

    get canHaveMultipleRows(): boolean {
        return !this.feature.singleRow;
    }

    get hasUniqueColumns(): boolean {
        return this.feature.type.uniqueCols;
    }

    get columnTypes(): ColumnType[] {
        return this.feature.type.columnTypes;
    }

    get columnNames(): string[] {
        return this.feature.colNames;
    }

    get featureName(): string {
        return this.feature.splitName(this.feature.pluralName()).toLowerCase();
    }

    get featureTypeName(): string {
        return this.feature.typeName;
    }

    get isRequired(): boolean {
        return this.feature.type.required;
    }

    get icon(): string {
        return this.feature.type.icon;
    }

    get description(): string {
        return this.feature.type.description;
    }

    get rows(): RowForm[] {
        return this.rowForms;
    }

    get columns(): ColumnControl[] {
        return this.columnControls;
    }

    get colTypeNames(): string[] {
        return this.columnTypes
            .filter(type => !type.readonly)
            .map(type => type.name);
    }

    get columnNameSuggestions(): string[] {
        if (this.hasUniqueColumns) {
            const colNames = this.columnNames;
            return this.colTypeNames.filter(name => colNames.includes(name));
        }
        return this.colTypeNames;
    }

    cellControlAt(rowIndex: number, colId: string): CellControl | undefined {
        return this.rowForms[rowIndex].cellControlAt(colId);
    }

    onRowAdd() {
        if (this.canHaveMultipleRows) {
            this.addRowForm(this.feature.addRow()!, this.feature.columns);
        }
    }

    onColumnAdd() {
        const column = this.feature.addColumn();
        this.addColumnControl(column);
        this.rowForms.forEach(rf => rf.addCellControl(column));
    }

    onColumnDelete(columnId: string) {
        //TODO
    }

    onRowDelete(rowIndex: string) {
        //TODO
    }

    canDeleteRowAt(index: number): boolean {
        //TODO
        return true;
    }

    private addRowForm(row: ValueMap, columns: Attribute[]) {
        const rowForm = new RowForm(row, columns, this.featureTypeName);
        this.rowForms.push(rowForm);
    }

    private addColumnControl(column: Attribute) {
        const colControl = new ColumnControl(column, this.featureTypeName);
        this.columnControls.push(colControl);
        this.columnsForm.addControl(column.id, colControl.control);
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