import {
    Attribute,
    AttributeValue,
    ColumnType,
    Feature,
    FeatureType,
    Field,
    FieldType,
    Section,
    SectionType,
    ValueMap,
    ValueType
} from 'app/submission/submission-shared/model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { fromNullable } from 'fp-ts/lib/Option';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { typeaheadSource } from 'app/submission/submission-edit/shared/typeahead.utils';
import * as pluralize from 'pluralize';
import {
    ControlGroupRef,
    ControlRef,
    ErrorMessages,
    MyFormControl,
    MyFormGroup,
    SubmFormValidators
} from './form-validators';

function listOfControls(control: AbstractControl): FormControl[] {
    if (control instanceof FormGroup) {
        const map = (<FormGroup>control).controls;
        return Object.keys(map)
            .map(key => map[key])
            .flatMap(control => listOfControls(control));
    } else if (control instanceof FormArray) {
        const array = (<FormArray>control).controls;
        return array.flatMap(control => listOfControls(control));
    }
    return [<FormControl>control];
}

export class FieldControl {
    readonly control: MyFormControl;

    constructor(private field: Field, ref: ControlRef) {
        this.control = new MyFormControl(field.value, SubmFormValidators.forField(field)).withRef(ref);
        this.control.valueChanges.subscribe((value) => {
            field.value = value;
        });
    }

    get errors(): string[] {
        return ErrorMessages.map(this.control);
    }

    get type(): FieldType {
        return this.field.type;
    }

    get name(): string {
        return this.field.name;
    }
}

export class ColumnControl {
    readonly control: MyFormControl;

    private typeahead: Observable<string[]> | undefined;

    constructor(private column: Attribute, ref: ControlRef) {
        this.control = new MyFormControl(column.name, SubmFormValidators.forColumn(column)).withRef(ref);
        this.control.valueChanges.subscribe(v => {
            column.name = v;
        });
    }

    get isRemovable(): boolean {
        return this.column.displayType.isRemovable;
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
        return ErrorMessages.map(this.control);
    }

    typeaheadSource(sourceFunc: () => string[]): Observable<string[]> {
        if (this.typeahead === undefined) {
            this.typeahead = typeaheadSource(sourceFunc, this.control.valueChanges);
        }
        return this.typeahead;
    }
}

export class CellControl {
    readonly control: MyFormControl;

    constructor(attrValue: AttributeValue, column: Attribute, ref: ControlRef) {
        this.control = new MyFormControl(attrValue.value, SubmFormValidators.forCell(column)).withRef(ref);
        this.control.valueChanges.subscribe(value => attrValue.value = value);
    }

    get errors(): string[] {
        return ErrorMessages.map(this.control);
    }

    get hasErrors(): boolean {
        return this.control.invalid && this.control.touched;
    }
}

export class RowForm {
    readonly form: FormGroup;

    private controls: Map<String, CellControl> = new Map();
    private row: ValueMap;
    private parentRef: ControlGroupRef;

    constructor(row: ValueMap, columns: Attribute[], parentRef: ControlGroupRef) {
        this.row = row;
        this.parentRef = parentRef;
        this.form = new FormGroup({});
        columns.forEach(column => this.addCellControl(column));
    }

    addCellControl(column: Attribute) {
        const cellControl = new CellControl(this.row.valueFor(column.id)!, column, this.parentRef.rowValueRef(column, this.row.id));
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

export class FormBase {
    private _errorCount: number = 0;

    constructor(readonly form: FormGroup) {
        form.statusChanges.subscribe(() => {
            this.onStatusChanges();
        });
    }

    get errorCount(): number {
        return this._errorCount;
    }

    get hasErrors(): boolean {
        return this.form.invalid && this.form.touched;
    }

    get invalid(): boolean {
        return this.form.invalid;
    }

    get valid(): boolean {
        return this.form.valid;
    }

    controls(): FormControl[] {
        return listOfControls(this.form).reverse();
    }

    invalidControls(): FormControl[] {
        return this.controls().filter(control => control.invalid);
    }

    private onStatusChanges() {
        this._errorCount = this.invalidControls().length;
    }
}

const featureGroupSize = (g: Feature[]) => g.map(f => f.rowSize()).reduce((rv, v) => rv + v, 0);

export class FeatureForm extends FormBase {
    private columnControls: ColumnControl[] = [];
    private rowForms: RowForm[] = [];

    private cellValueTypeahead: Map<string, () => string[]> = new Map();

    columnNamesAvailableCached: string[] = [];

    structureChanges$: Subject<StructureChangeEvent> = new Subject<StructureChangeEvent>();

    constructor(private feature: Feature, private featureRef: ControlGroupRef) {
        super(new FormGroup({
            columns: new MyFormGroup({}, SubmFormValidators.forFeatureColumns(feature)).withRef(featureRef),
            rows: new FormArray([])
        }));

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
            !this.canHaveMoreColumns();

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

    get isReadonly(): boolean {
        return this.feature.type.displayType.isReadonly;
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

    get scrollToTheLastControl(): FormControl | undefined {
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
    }

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

    addEntry(): void {
        this.addRow();

        if (!this.canHaveMultipleRows) {
            this.addColumn();
        }
    }

    canAddRow(): boolean {
        return !this.isReadonly && this.feature.canAddRow();
    }

    addRow() {
        if (this.canAddRow()) {
            const row = this.feature.addRow();
            this.addRowForm(row!, this.feature.columns);
            this.structureChanges$.next(StructureChangeEvent.featureRowAdd);
        }
    }

    canRemoveRow(): boolean {
        return !this.isReadonly &&
            (!this.featureType.displayType.isShownByDefault || this.feature.rowSize() > 1) &&
            this.feature.groups.every(g => featureGroupSize(g) > 1);
    }

    removeRow(rowIndex: number) {
        if (this.canRemoveRow()) {
            this.feature.removeRowAt(rowIndex);
            this.removeRowForm(rowIndex);
            this.structureChanges$.next(StructureChangeEvent.featureRowRemove);
        }
    }

    canAddColumn(): boolean {
        return !this.isReadonly && this.canHaveMoreColumns();
    }

    canHaveMoreColumns(): boolean {
        return this.featureType.allowCustomCols
            || !this.featureType.uniqueCols
            || this.feature.colSize() < this.featureType.columnTypes.length;
    }

    /*canAddColumn(name: string, isTemplateBased: boolean): boolean {
        const notExists = this.columns.find(col => col.name === name) === undefined;
        if (notExists) {
            return isTemplateBased || this.type.allowCustomCols;
        }
        return !this.featureType.uniqueCols;
    }*/

    addColumn() {
        /*if (!isTemplateBased && !this.type.allowCustomCols) {
            if (this.type.columnTypes.length === 0) {
                console.error(`Can't create column for ${this.typeName}; column types are not defined and custom columns are not allowed`);
                return undefined;
            }
            let colType = this.type.columnTypes.find(t => this._columns.findByType(t) === undefined);
            if (colType === undefined && this.type.uniqueCols) {
                return undefined;
            }
            colType = colType || this.type.columnTypes[0];
            colName = colType.name;
            valueType = colType.valueType;
            isTemplateBased = true;
        }*/
        if (this.canAddColumn()) {
            const column = this.feature.addColumn();
            this.addColumnControl(column);
            this.rowForms.forEach(rf => rf.addCellControl(column));
            this.structureChanges$.next(StructureChangeEvent.featureColumnAdd);
        }
    }

    canRemoveColumn(columnCtrl: ColumnControl): boolean {
        return !this.isReadonly && columnCtrl.isRemovable;
    }

    removeColumn(columnCtrl: ColumnControl) {
        if (this.canRemoveColumn(columnCtrl)) {
            this.feature.removeColumn(columnCtrl.id);
            this.removeColumnControl(columnCtrl.id);
            this.rowForms.forEach(rf => rf.removeCellControl(columnCtrl.id));
            this.structureChanges$.next(StructureChangeEvent.featureColumnRemove);
        }
    }

    private addRowForm(row: ValueMap, columns: Attribute[]) {
        const rowForm = new RowForm(row, columns, this.featureRef);
        this.rowForms.push(rowForm);
        this.rowFormArray.push(rowForm.form);
    }

    private removeRowForm(rowIndex: number) {
        this.rowForms.splice(rowIndex, 1);
        this.rowFormArray.removeAt(rowIndex);
    }

    private addColumnControl(column: Attribute) {
        const colControl = new ColumnControl(column, this.featureRef.columnRef(column));
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
    static init: StructureChangeEvent = new StructureChangeEvent('init');
    static featureAdd: StructureChangeEvent = new StructureChangeEvent('featureAdd');
    static featureRemove: StructureChangeEvent = new StructureChangeEvent('featureRemove');
    static featureRowAdd: StructureChangeEvent = new StructureChangeEvent('featureRowAdd');
    static featureRowRemove: StructureChangeEvent = new StructureChangeEvent('featureRowRemove');
    static featureColumnAdd: StructureChangeEvent = new StructureChangeEvent('featureColumnAdd');
    static featureColumnRemove: StructureChangeEvent = new StructureChangeEvent('featureColumnRemove');
    static sectionRemove: StructureChangeEvent = new StructureChangeEvent('sectionRemove');
    static sectionAdd: StructureChangeEvent = new StructureChangeEvent('sectionAdd');

    constructor(readonly name: string) {
    }
}

export class SectionForm extends FormBase {

    readonly fieldControls: FieldControl[] = [];
    readonly featureForms: FeatureForm[] = [];
    readonly subsectionForms: SectionForm[] = [];
    readonly sectionPath: string[];

    /* can use form's valueChanges, but then the operations like add/remove column will not be atomic,
    as it requires to apply multiple changes at once */
    readonly structureChanges$ = new BehaviorSubject<StructureChangeEvent>(StructureChangeEvent.init);

    private sb: Map<string, Subscription> = new Map<string, Subscription>();

    private sectionRef: ControlGroupRef;

    constructor(private section: Section, readonly parent?: SectionForm) {
        super(new FormGroup({
            fields: new FormGroup({}),
            features: new FormGroup({}),
            sections: new FormGroup({})
        }));

        this.sectionPath = this.isRootSection ? [] : [...this.parent!.sectionPath, ...[this.id]];
        this.sectionRef = ControlGroupRef.sectionRef(section, this.isRootSection);

        section.fields.list().forEach(
            field => {
                this.addFieldControl(field);
            });

        [...[section.annotations], ...section.features.list()].forEach(
            feature => {
                this.addFeatureForm(feature);
            });

        section.sections.list().forEach(
            s => {
                this.addSubsectionForm(s);
            });
    }

    getFeatureControl(featureId: string): FormControl | undefined {
        const featureForm = this.featureForms.find(f => f.id === featureId);
        if (featureForm !== undefined) {
            return featureForm.scrollToTheLastControl;
        }
    }

    removeFeatureType(featureId: string): void {
        const index = this.featureForms.findIndex(f => f.id === featureId);
        if (index < 0) {
            return;
        }

        if (this.section.features.removeById(featureId)) {
            this.unsubscribe(featureId);
            this.featureForms.splice(index, 1);
            this.featureFormGroups.removeControl(featureId);
            this.structureChanges$.next(StructureChangeEvent.featureRemove);
        }
    }

    addFeatureEntry(featureId: string): void {
        const featureForm = this.featureForms.find(f => f.id === featureId);
        if (featureForm !== undefined) {
            featureForm.addEntry();
        }
    }

    addFeature(type: FeatureType): Feature | undefined {
        const feature = this.section.features.add(type);
        if (feature) {
            this.addFeatureForm(feature);
            this.structureChanges$.next(StructureChangeEvent.featureAdd);
        }
        return feature;
    }

    addSection(type: SectionType): SectionForm {
        const form = this.addSubsectionForm(this.section.sections.add(type));
        this.structureChanges$.next(StructureChangeEvent.sectionAdd);
        return form;
    }

    removeSection(sectionId: string): void {
        const index = this.subsectionForms.findIndex(s => s.id === sectionId);
        if (index < 0) {
            return;
        }

        if (this.section.sections.removeById(sectionId)) {
            this.subsectionForms.splice(index, 1);
            this.subsectionFormGroups.removeControl(sectionId);
            this.structureChanges$.next(StructureChangeEvent.sectionRemove);
        }
    }

    findSectionForm(sectionId: string) {
        return this.findRoot().lookupSectionForm(sectionId);
    }

    get type(): SectionType {
        return this.section.type;
    }

    get typeName(): string {
        return this.section.typeName;
    }

    get id(): string {
        return this.section.id;
    }

    get accno(): string {
        return this.section.accno;
    }

    get isTypeRemovable(): boolean {
        return this.section.type.displayType.isRemovable;
    }

    get typeMinRequired(): number {
        return this.section.type.minRequired;
    }

    get isRootSection(): boolean {
        return this.parent === undefined;
    }

    get sectionTypes(): Array<SectionType> {
        return <SectionType[]>[...this.section.type.sectionTypes, ...this.subsectionForms.map(sf => sf.type)]
            .reduce((rv, v) => {
                if (rv[0][v.name] === undefined) {
                    rv[0][v.name] = 1;
                    rv[1].push(v);
                }
                return rv;
            }, [{} as { [key: string]: any }, [] as Array<SectionType>])[1];
    }

    isSectionRemovable(sectionForm: SectionForm): boolean {
        const min = sectionForm.typeMinRequired;
        return sectionForm.isTypeRemovable || (this.section.sections.byType(sectionForm.typeName).length > min);
    }

    private get fieldFormGroup(): FormGroup {
        return <FormGroup>this.form.get('fields');
    }

    private get featureFormGroups(): FormGroup {
        return <FormGroup>this.form.get('features');
    }

    private get subsectionFormGroups(): FormGroup {
        return <FormGroup>this.form.get('sections');
    }

    private addFieldControl(field: Field): void {
        const fieldControl = new FieldControl(field, this.sectionRef.fieldRef(field));
        this.fieldControls.push(fieldControl);
        this.fieldFormGroup.addControl(field.id, fieldControl.control);
    }

    private addFeatureForm(feature: Feature): FeatureForm {
        const featureForm = new FeatureForm(feature, this.sectionRef.featureRef(feature));
        this.featureForms.push(featureForm);
        this.featureFormGroups.addControl(feature.id, featureForm.form);
        this.subscribe(featureForm);
        return featureForm;
    }

    private addSubsectionForm(section: Section): SectionForm {
        const sectionForm = new SectionForm(section, this);
        this.subsectionForms.push(sectionForm);
        this.subsectionFormGroups.addControl(section.id, sectionForm.form);
        return sectionForm;
    }

    private subscribe(featureForm: FeatureForm) {
        this.sb.set(featureForm.id, featureForm.structureChanges$.subscribe(ev => {
            this.structureChanges$.next(ev);
        }));
    }

    private unsubscribe(featureId: string) {
        this.sb.get(featureId)!.unsubscribe();
        this.sb.delete(featureId);
    }

    private findRoot(): SectionForm {
        if (this.parent === undefined) {
            return this;
        }
        return this.parent.findRoot();
    }

    private lookupSectionForm(sectionId: string): SectionForm | undefined {
        if (this.section.id === sectionId) {
            return this;
        }
        return this.subsectionForms.find(sf => sf.lookupSectionForm(sectionId) !== undefined);
    }
}
