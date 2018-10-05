import {Attribute, Feature, Field, Section, ValueMap} from '../../shared/submission.model';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ErrorMessages, FormValidators, ValueValidators} from './value-validators';
import {ColumnType, ValueType} from '../../shared/submission-type.model';
import {fromNullable} from 'fp-ts/lib/Option';
import {Observable} from 'rxjs';
import {typeaheadSource} from './typeahead.utils';

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

    private typeahead: Observable<string[]> | undefined;

    constructor(private column: Attribute, readonly parentRef: string) {
        this.control = new FormControl(column.name, ValueValidators.forColumn(column, parentRef));
    }

    get isRemovable(): boolean {
        return this.column.displayType.isRemovable
    }

    get isRequired(): boolean {
        return this.column.displayType.isRequired;
    }

    get canEditName() {
        return this.column.canEditName;
    }

    get isReadonly() {
        return this.column.displayType.isReadonly;
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

    get hasErrors(): boolean {
        return this.control.invalid && this.control.touched;
    }

    get errors(): string[] {
        return ErrorMessages.map(this.control.errors);
    }

    typeaheadSource(sourceFunc: () => string[]): Observable<string[]> {
        if (this.typeahead === undefined) {
            this.typeahead = typeaheadSource(sourceFunc, this.control.valueChanges);
        }
        return this.typeahead;
    }
}

export class CellControl {
    readonly control: FormControl;

    constructor(value: string, column: Attribute, readonly parentRef: string) {
        this.control = new FormControl(value, ValueValidators.forCell(column, parentRef));
    }

    get errors(): string[] {
        return ErrorMessages.map(this.control.errors);
    }

    get hasErrors(): boolean {
        return this.control.invalid && this.control.touched
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

    hasErrorsAt(columnId: string): boolean {
        return fromNullable(this.cellControlAt(columnId))
            .map(c => c.hasErrors)
            .getOrElse(false);
    }

    errorsAt(columnId: string): string[] {
        return fromNullable(this.cellControlAt(columnId))
            .map(c => c.errors)
            .getOrElse([]);
    }
}

export class FeatureForm {
    readonly form: FormGroup;

    private columnControls: ColumnControl[] = [];
    private rowForms: RowForm[] = [];

    constructor(private feature: Feature) {
        this.form = new FormGroup({
            columns: new FormGroup({}, FormValidators.forFeatureColumns(feature)),
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

    private get rowFormArray(): FormArray {
        return <FormArray>this.form.get('rows');
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
        return this.feature.type.displayType.isRequired;
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
            .filter(type => !type.displayType.isReadonly)
            .map(type => type.name);
    }

    columnNamesTypeahead(column: ColumnControl): Observable<string[]> {
        return column.typeaheadSource(this.columnNamesTypeaheadFunc());
    }

    columnNameValues(): string[] {
        if (this.hasUniqueColumns) {
            const colNames = this.columnNames;
            return this.colTypeNames.filter(name => !colNames.includes(name));
        }
        return this.colTypeNames;
    }

    columnNamesTypeaheadFunc(): () => string[] {
        return () => {
            return this.columnNameValues();
        };
    }

    columnValuesTypeaheadFunc(rowIndex: number, columnId: string): () => string[] {
        const skipRow = this.rowForms[rowIndex];
        return () => {
            return this.rowForms
                .filter(row => row !== skipRow)
                .map(row => row.cellControlAt(columnId))
                .filter(c => c !== undefined)
                .map(c => c!.control.value)
                .filter((v: string) => !v.isEmpty())
                .uniqueValues();
        }
    }

    cellControlAt(rowIndex: number, columnId: string): CellControl | undefined {
        return this.rowForms[rowIndex].cellControlAt(columnId);
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

    onColumnRemove(columnId: string) {
        const index = this.columnControls.findIndex(c => c.id === columnId);
        if (index >= 0) {
            this.columnControls.splice(index, 1);
            this.columnsForm.removeControl(columnId);
            this.feature.removeColumn(columnId);
        }
    }

    onRowRemove(rowIndex: number) {
        this.rowForms.splice(rowIndex, 1);
        this.rowFormArray.removeAt(rowIndex);
        this.feature.removeRowAt(rowIndex);
    }

    get canRemoveRow(): boolean {
        return this.feature.canRemoveRow;
    }

    private addRowForm(row: ValueMap, columns: Attribute[]) {
        const rowForm = new RowForm(row, columns, this.featureTypeName);
        this.rowForms.push(rowForm);
        this.rowFormArray.push(rowForm.form);
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