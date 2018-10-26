import {
    Attribute,
    AttributeValue,
    ColumnType,
    Feature,
    FeatureType,
    Field,
    Section,
    ValueMap,
    ValueType
} from '../../shared/model';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {ErrorMessages, FormValidators, ValueValidators} from './form-validators';
import {fromNullable} from 'fp-ts/lib/Option';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {typeaheadSource} from './typeahead.utils';
import {throttleTime} from 'rxjs/operators';
import * as pluralize from 'pluralize';

function listOfControls(control: AbstractControl): FormControl[] {
    if (control instanceof FormGroup) {
        const map = (<FormGroup>control).controls;
        return Object.keys(map)
            .map(key => map[key])
            .flatMap(control => listOfControls(control));
    }
    else if (control instanceof FormArray) {
        const array = (<FormArray>control).controls;
        return array.flatMap(control => listOfControls(control));
    }
    return [<FormControl>control];
}

function listOfInvalidControls(control: AbstractControl) {
    return listOfControls(control)
        .filter(control => control.invalid)
        .reverse()
}

export class FieldControl {
    readonly control: FormControl;

    constructor(readonly field: Field, readonly parentRef: string) {
        this.control = new FormControl(field.value, ValueValidators.forField(this.field, parentRef));
        this.control.valueChanges.subscribe((value) => {
            field.value = value;
        });
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
        this.control.valueChanges.subscribe(v => {
            column.name = v;
        });
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

    constructor(attrValue: AttributeValue, column: Attribute, readonly parentRef: string) {
        this.control = new FormControl(attrValue.value, ValueValidators.forCell(column, parentRef));
        this.control.valueChanges.subscribe(value => attrValue.value = value);
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
        const cellControl = new CellControl(this.row.valueFor(column.id)!, column, this.parentRef);
        this.form.addControl(column.id, cellControl.control);
        this.controls.set(column.id, cellControl);
    }

    removeCellControl(columnId: string) {
        this.form.removeControl(columnId);
        this.controls.delete(columnId);
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

    private cellValueTypeahead: Map<string, () => string[]> = new Map();

    errorCount: number = 0;

    columnNamesAvailableCached: string[] = [];

    structureChanges$: Subject<StructureChangeEvent> = new Subject<StructureChangeEvent>();

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

        this.columnsForm.valueChanges.subscribe(() => {
            this.columnNamesAvailableCached = this.columnNamesAvailable();
        });

        this.columnNamesAvailableCached = this.columnNamesAvailable();

        this.form.valueChanges.pipe(throttleTime(500)).subscribe(() => {
            this.onValueFormChanges();
        });

        this.onValueFormChanges();
    }

    private onValueFormChanges() {
        this.errorCount = listOfInvalidControls(this.form).length;
    }

    private get columnsForm(): FormGroup {
        return <FormGroup>this.form.get('columns');
    }

    private get rowFormArray(): FormArray {
        return <FormArray>this.form.get('rows');
    }

    get isEmpty(): boolean {
        return this.feature.isEmpty;
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

    get featureType(): FeatureType {
        return this.feature.type;
    }

    get id(): string {
        return this.feature.id;
    }

    get prettyName(): string {
        const isSingleElementFeature =
            this.feature.singleRow &&
            this.feature.colSize() === 1 &&
            !this.feature.canAddMoreColumns();

        const name = this.feature.typeName.replace(/([A-Z])/g, ' $1');
        return (isSingleElementFeature ? name : pluralize(name));
    }

    get featureTypeName(): string {
        return this.feature.typeName;
    }

    get isRequired(): boolean {
        return this.feature.type.displayType.isRequired;
    }

    get isRemovable(): boolean {
        return this.feature.type.displayType.isRemovable;
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

    get requiredGroups(): string [] {
        return this.feature.groups.length > 0 ? this.feature.groups[0].map(f => f.typeName) : [];
    }

    get hasRequiredGroups(): boolean {
        return this.requiredGroups.length > 0;
    }

    get hasErrors(): boolean {
        return this.form.invalid && this.form.touched;
    }

    get scrollToControl(): FormControl | undefined {
        if (this.rowForms.isEmpty() || this.columnControls.isEmpty()) {
            return undefined;
        }

        const rowForm = this.rowForms[this.rowForms.length - 1];
        const firstColumn = this.columnControls[0].id;
        const lastColumn = this.columnControls[this.columnControls.length - 1].id;
        if (this.canHaveMultipleRows) {
            return rowForm.cellControlAt(firstColumn)!.control;
        }
        return rowForm.cellControlAt(lastColumn)!.control;
    }

    columnNamesTypeahead(column: ColumnControl): Observable<string[]> {
        return column.typeaheadSource(this.columnNamesAvailable);
    }

    /* returns a list of column names available for a new column to add */
    columnNamesAvailable = () => {
        if (this.hasUniqueColumns) {
            const colNames = this.columnNames;
            return this.colTypeNames.filter(name => !colNames.includes(name));
        }
        return this.colTypeNames;
    };

    cellValuesTypeaheadFunc(rowIndex: number, columnId: string): () => string[] {
        const key = `${rowIndex}_${columnId}`;
        if (!this.cellValueTypeahead.has(key)) {
            this.cellValueTypeahead.set(key, () => {
                return this.cellValues(rowIndex, columnId);
            });
        }
        return this.cellValueTypeahead.get(key)!;
    }

    /* returns list of current values for a column, excludes value in the current row */
    cellValues(rowIndex: number, columnId: string): string[] {
        const skipRow = this.rowForms[rowIndex];
        return this.rowForms
            .filter(row => row !== skipRow)
            .map(row => row.cellControlAt(columnId))
            .filter(c => c !== undefined)
            .map(c => c!.control.value)
            .filter((v: string) => !v.isEmpty())
            .uniqueValues();
    }

    cellControlAt(rowIndex: number, columnId: string): CellControl | undefined {
        return this.rowForms[rowIndex].cellControlAt(columnId);
    }

    /*adds one row or column depending on feature type */
    addEntry(): void {
        if (this.canHaveMultipleRows) {
            this.addRow();
        } else {
            this.addColumn();
        }
    }

    addRow() {
        const row = this.feature.addRow();
        if (row !== undefined) {
            this.addRowForm(row, this.feature.columns);
            this.structureChanges$.next(StructureChangeEvent.featureRowAdd);
        }
    }

    removeRow(rowIndex: number) {
        if (this.feature.removeRowAt(rowIndex)) {
            this.removeRowForm(rowIndex);
            this.structureChanges$.next(StructureChangeEvent.featureRowRemove);
        }
    }

    addColumn() {
        const column = this.feature.addColumn();
        if (column !== undefined) {
            this.addColumnControl(column);
            this.rowForms.forEach(rf => rf.addCellControl(column));
            this.structureChanges$.next(StructureChangeEvent.featureColumnAdd);
        }
    }

    removeColumn(columnId: string) {
        if (this.feature.removeColumn(columnId)) {
            this.removeColumnControl(columnId);
            this.rowForms.forEach(rf => rf.removeCellControl(columnId));
            this.structureChanges$.next(StructureChangeEvent.featureColumnRemove);
        }
    }

    canRemoveRow(): boolean {
        return this.feature.canRemoveRow();
    }

    canRemoveColumn(column: ColumnControl): boolean {
        return this.feature.canRemoveColumn(column.id);
    }

    canAddMoreColumns(): boolean {
        return this.feature.canAddMoreColumns();
    }

    private addRowForm(row: ValueMap, columns: Attribute[]) {
        const rowForm = new RowForm(row, columns, this.featureTypeName);
        this.rowForms.push(rowForm);
        this.rowFormArray.push(rowForm.form);
    }

    private removeRowForm(rowIndex: number) {
        this.rowForms.splice(rowIndex, 1);
        this.rowFormArray.removeAt(rowIndex);
    }

    private addColumnControl(column: Attribute) {
        const colControl = new ColumnControl(column, this.featureTypeName);
        this.columnControls.push(colControl);
        this.columnsForm.addControl(column.id, colControl.control);
    }

    private removeColumnControl(columnId: string) {
        const index = this.columnControls.findIndex(c => c.id === columnId);
        this.columnControls.splice(index, 1);
        this.columnsForm.removeControl(columnId);
    }
}

export class StructureChangeEvent {
    constructor(readonly name: string){}
    static init: StructureChangeEvent = new StructureChangeEvent('init');
    static featureAdd: StructureChangeEvent = new StructureChangeEvent('featureAdd');
    static featureRemove: StructureChangeEvent = new StructureChangeEvent('featureRemove');
    static featureRowAdd: StructureChangeEvent = new StructureChangeEvent('featureRowAdd');
    static featureRowRemove: StructureChangeEvent = new StructureChangeEvent('featureRowRemove');
    static featureColumnAdd: StructureChangeEvent = new StructureChangeEvent('featureColumnAdd');
    static featureColumnRemove: StructureChangeEvent = new StructureChangeEvent('featureColumnRemove');
}

export class SectionForm {
    readonly form: FormGroup;

    readonly fieldControls: FieldControl[] = [];
    readonly featureForms: FeatureForm[] = [];

    /* can use form's valueChanges, but then the operations like add/remove column will not be atomic,
    as it requires to apply multiple changes at once */
    readonly structureChanges$ = new BehaviorSubject<StructureChangeEvent>(StructureChangeEvent.init);

    private sb: Map<string, Subscription> = new Map<string, Subscription>();

    constructor(readonly section: Section) {
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

    controls(): FormControl[] {
        return listOfControls(this.form).reverse();
    }

    scrollToControl(featureId: string): FormControl | undefined {
        const featureForm = this.featureForms.find(f => f.id === featureId);
        if (featureForm !== undefined) {
            return featureForm.scrollToControl;
        }
    }

    removeFeature(featureId: string): void {
        const index = this.featureForms.findIndex(f => f.id === featureId);
        if (index < 0) {
            return;
        }

        if (this.section.features.removeById(featureId)) {
            this.unsubscribe(featureId);
            this.featureForms.splice(index, 1);
            this.featuresForm.removeControl(featureId);
            this.structureChanges$.next(StructureChangeEvent.featureRemove);
        }
    }

    addFeatureEntry(featureId: string): void {
        const featureForm = this.featureForms.find(f => f.id === featureId);
        if (featureForm !== undefined) {
            featureForm.addEntry();
        }
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
        this.subscribe(featureForm);
    }

    private subscribe(featureForm : FeatureForm) {
        this.sb.set(featureForm.id, featureForm.structureChanges$.subscribe(ev => {
            this.structureChanges$.next(ev);
        }));
    }

    private unsubscribe(featureId: string) {
        this.sb.get(featureId)!.unsubscribe();
        this.sb.delete(featureId);
    }
}