import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import {
    SectionType,
    FeatureType,
    ValueType,
    FieldType,
    SubmissionType, ColumnType
} from './submission-type.model';

import * as pluralize from 'pluralize';
import * as _ from 'lodash';
import {NameAndValue, Tag} from './model.common';

//Names of attributes as they come from the server that must be external.
//NOTE: As per PageTab's requirements, "AttachTo", "ReleaseDate" and "Title" are special attributes that pertain the
//whole submission and must therefore be outside the section.
//NOTE: Only these attributes follow an Upper Camel Case convention. Any attributes different from these are arbitrarily
//formatted.
export const rootAttrs: string[] = ['Title', 'ReleaseDate', 'AttachTo'];

const nextId = (function () {
    let count = 0;
    return function () {
        return `id${count++}`;
    }
})();

export class HasUpdates<T> {
    private subj$: Subject<T>;

    constructor() {
        this.subj$ = new Subject<T>();
    }

    updates(): Observable<T> {
        return this.subj$.asObservable();
    }

    protected notify(v: T) {
        this.subj$.next(v);
    }
}

export class UpdateEvent {
    leafEvent?: UpdateEvent;      //pointer to original first event if a cascade is triggered

    constructor(public name: string,
                public value: any,
                public source?: UpdateEvent) {

        //Keeps track of the source event.
        //NOTE: In certain instances, the chain of events is recorded as a nested object.
        if (this.source && this.source.leafEvent && !this.source.leafEvent.source) {
            this.leafEvent = this.source.leafEvent;
        } else {
            this.leafEvent = this;
        }
    }
}

export class Attribute extends HasUpdates<UpdateEvent> {
    readonly id: string;
    required: boolean;
    displayed: boolean;
    readonly: boolean;
    removable: boolean;
    valueType: ValueType;
    values: string[];

    private _name: string;

    constructor(name: string = '', required: boolean = false, displayed: boolean = false, readonly: boolean = false,
                removable: boolean = true, valueType: ValueType = 'text', values: string[] = []) {
        super();
        this.required = required;
        this.displayed = displayed;
        this.readonly = readonly;
        this.removable = removable;
        this.valueType = valueType;
        this.values = values;
        this._name = name;
        this.id = `attr_${nextId()}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        if (this.required || this._name === name) {
            return;
        }
        this._name = name;
        this.notify(new UpdateEvent('name', name));
    }

    /**
     * Changes the type properties of the column to a given set.
     * NOTE: Columns whose type are updated are only those columns that were non-readonly in the first place.
     * Given the sweeping effects of the "readonly" flag (making uneditable not just the column but all its member
     * fields too), to avoid the update coming across as an uninteded, it is ignored on purpose.
     * @param {ColumnType} colType - New type values for the column.
     */
    updateType(colType: ColumnType) {
        this.required = colType.required;
        this.displayed = colType.displayed;
        this.removable = colType.removable;
        this.valueType = colType.valueType;
        this.values = colType.values;
    }
}

export class AttributeValue extends HasUpdates<UpdateEvent> {
    constructor(private _value: string = '') {
        super();
    }

    set value(value: string) {
        if (this.value !== value) {
            this._value = value;
            this.notify(new UpdateEvent('value', value));
        }
    }

    get value(): string {
        return this._value;
    }
}

export class ValueMap extends HasUpdates<UpdateEvent> {
    private valueMap: Map<string, AttributeValue> = new Map();
    private subscriptionMap: Map<string, Subscription> = new Map();

    constructor(keys?: string[]) {
        super();
        (keys || []).forEach(key => this.add(key));
    }

    /**
     * Determines if the values making this map up are all empty strings.
     * @returns {boolean} True if the map has no non-empty value.
     */
    get isEmpty(): boolean {
        let valuesLength = 0;

        this.valueMap.forEach(valueObj => {
            valuesLength = valuesLength + valueObj.value.length;
        });
        return valuesLength == 0;
    }

    valueFor(key: string): AttributeValue | undefined {
        return this.valueMap.get(key);
    }

    add(key: string, value?: string): void {
        if (this.valueMap.has(key)) {
            console.warn(`adding multiple values for a key:${key}`);
            return;
        }
        const v = new AttributeValue(value);
        this.valueMap.set(key, v);
        this.subscriptionMap.set(key,
            v.updates().subscribe(m => {
                this.notify(new UpdateEvent('value_update', {key: key}, m));
            }));
    }

    remove(key: string): void {
        if (!this.valueMap.has(key)) {
            console.warn(`remove: the key '${key}' does not exist in the map`);
            return;
        }
        this.subscriptionMap.get(key)!.unsubscribe();
        this.subscriptionMap.delete(key);
        this.valueMap.delete(key);
    }

    values(keys?: string[]): AttributeValue[] {
        return (keys || this.keys()).map(key => this.valueMap.get(key)!);
    }

    keys(): string[] {
        return Array.from(this.valueMap.keys());
    }
}

export class Columns extends HasUpdates<UpdateEvent> {
    private columns: Attribute[] = [];
    private subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    list(): Attribute[] {
        return this.columns.slice();
    }

    /**
     * Adds a new column to the attribute array, updating the event system in the process.
     * @param {Attribute} column - Column to be added
     */
    add(column: Attribute): void {
        const columns = this.columns;

        //Makes sure the new column notifies name changes, dynamically working out its current array index.
        //NOTE: Mind you, columns could be removed. Therefore, the initial array index may no longer apply.
        columns.push(column);
        this.subscriptions.push(
            column.updates().subscribe(event => {
                this.notify(new UpdateEvent(
                    'column_name_update',
                    {id: column.id, index: columns.indexOf(column)},
                    event
                ));
            })
        );

        //Triggers the corresponding event for the add operation
        this.notify(new UpdateEvent('column_add', {id: column.id, index: columns.length - 1}));
    }

    remove(id: string): boolean {
        const index = this.columns.findIndex(attr => attr.id === id);
        if (index < 0) {
            console.warn(`Column index out of bounds: ${index}`);
            return false;
        }
        if (this.columns[index].required) {
            console.warn(`Can't remove required column [index: ${index}`);
            return false;
        }
        this.columns.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.notify(new UpdateEvent('column_remove', {id: id, index: index}));
        return true;
    }

    at(index: number): Attribute | undefined {
        return (index >= 0) && (index < this.columns.length) ? this.columns[index] : undefined;
    }

    allWithName(name: string): Attribute[] {
        return this.columns.filter(attr => attr.name.toLowerCase() === name.toLowerCase());
    }

    keys(): string[] {
        return this.columns.map(attr => attr.id);
    }

    names(): any {
        return this.columns.map(attr => attr.name);
    }

    size(): number {
        return this.columns.length;
    }
}

export class Rows extends HasUpdates<UpdateEvent> {
    private rows: ValueMap[] = [];
    private subscriptions: Subscription[] = [];

    constructor() {
        super();
    }

    list(): ValueMap[] {
        return this.rows.slice();
    }

    add(keys: string[]): ValueMap {
        const row = new ValueMap(keys);
        const rowIndex = {index: this.rows.length};
        this.rows.push(row);
        this.subscriptions.push(
            row.updates()
                .subscribe(m => {
                    this.notify(new UpdateEvent('row_value_update', rowIndex, m));
                }));
        this.notify(new UpdateEvent('row_add', rowIndex));
        return row;
    }

    removeAt(index: number): void {
        if ((index < 0) || (index > this.rows.length)) {
            console.warn(`index is out of range: ${index}`);
            return;
        }
        this.rows.splice(index, 1);
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.notify(new UpdateEvent('row_remove', {index: index}));
    }

    addKey(key: string) {
        this.rows.forEach(r => {
            r.add(key);
        });
    }

    removeKey(key: string) {
        this.rows.forEach(r => {
            r.remove(key);
        });
    }

    size(): number {
        return this.rows.length;
    }
}

export class Feature extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly type: FeatureType;

    private _columns: Columns = new Columns();
    private _rows: Rows = new Rows();

    static create(type: FeatureType, attrs: NameAndValue[]): Feature {
        return new Feature(type,
            {
                type: type.name,
                entries: [attrs]
            });
    }

    constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
        super();

        this.id = `feature_${nextId()}`;
        this.type = type;

        if (type.singleRow) {
            this.addRow();
        }

        //TODO: Make displayed columns less permanent. Should be added once when the submission is new. Link with "isNew" from submission edit view.
        type.columnTypes.forEach(ct => {
            if (ct.required || ct.displayed) {
                this.addColumn(ct.name, ct.required, ct.displayed, ct.readonly, ct.removable, ct.valueType, ct.values);
            }
        });

        (data.entries || []).forEach(entry => {
            this.add(entry);
        });

        if (type.required && this.rowSize() === 0) {
            this.addRow();
        }

        this._columns.updates()
            .subscribe(event => {
                this.notify(new UpdateEvent('columns_update', {id: this.id}, event));

                if (event.name == 'column_name_update') {
                    this.onColumnUpdate(event.source!.value, event.value.index);
                }
            });
        this._rows.updates()
            .subscribe(m => {
                this.notify(new UpdateEvent('rows_update', {id: this.id}, m));
            });
    }

    get singleRow(): boolean {
        return this.type.singleRow;
    }

    get uniqueCols(): boolean {
        return this.type.uniqueCols;
    }

    get typeName(): string {
        return this.type.name;
    }

    set typeName(val: string) {
        this.type.name = val;
        if (this.type.name === val) {
            this.notify(new UpdateEvent('type', val));
        }
    }

    get rows(): ValueMap[] {
        return this._rows.list();
    }

    get columns(): Attribute[] {
        return this._columns.list();
    }

    /**
     * Convenience method to retrieve the names of the feature's current columns
     * @returns {string[]} Column names
     */
    get colNames(): string[] {
        return this._columns.names();
    }

    rowSize(): number {
        return this._rows.size();
    }

    colSize(): number {
        return this._columns.size();
    }

    size(): number {
        return this.singleRow ? this.colSize() : this.rowSize();
    }

    /**
     * ID of the first column with a matching name. For features with unique columns (eg: grids), it's a safe guess
     * for any given attribute name.
     * @param {string} name - Name of the column whose ID is to be retrieved.
     * @returns {string} Attribute ID for the named column.
     */
    firstId(name: string): string {
        return this._columns.allWithName(name)[0].id
    }

    /**
     * Determines the feature is made up of empty rows.
     * NOTE: This is equally applicable to lists as long as they are considered transposed grids, the
     * only row being the set of values for each key.
     * @returns {boolean} True if all rows are empty.
     */
    isEmpty(): boolean {
        return this.rows.every(row => row.isEmpty);
    }

    /**
     * Converts the feature's name to plural if it has more than one row (or column if only one row allowed).
     * It employs the Pluralize global JS plugin: {@link https://github.com/blakeembrey/pluralize}
     * @returns {string} Pluralized or unmodified feature name.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    pluralName(): string {
        return pluralize(this.type.name);
    }

    /**
     * Splits a given camel-cased name into words.
     * @param {string} Name of the feature.
     * @returns {string} Separated words.
     *
     * @author Hector Casanova <hector@ebi.ac.uk>
     */
    splitName(name: string): string {
        return name.replace(/([a-z])([A-Z])/g, '$1 $2');
    }


    /**
     * Sets the values of a given row.
     * @param {{name: string; value: string}[]} attributes - Data the row will be set to.
     * @param {number} [rowIdx = null] - Index of row to be set to the provided attributes. By default, the row will be
     * added if the feature is not limited to a single row, in which case the first row is changed.
     */
    add(attributes: { name: string, value: string }[] = [], rowIdx?: number): void {
        const attrsWithName = attributes.filter(attr => attr.name !== '');
        const attrNames = attrsWithName.map(attr => attr.name);

        const usedColIds: string[] = [];
        let rowMap;

        //Adds a column if any of the passed-in attribute names doesn't occur as often as it does in the column list.
        attrNames
            .forEach((attrName) => {
                const colNames = this._columns.names();
                const instancesFn = (name) => attrName == name;
                const occurAttrs = attrNames.filter(instancesFn).length;
                const occurCols = colNames.filter(instancesFn).length;
                const colType = this.type.getColumnType(attrName);

                if (occurAttrs != occurCols) {
                    this.addColumn(attrName, colType.required, colType.displayed, colType.readonly, colType.removable,
                        colType.valueType, colType.values);
                }
            });

        //If row not provided, add it if applicable.
        if (rowIdx === undefined) {
            rowMap = this.singleRow ? this.rows[0] : this.addRow();
        } else {
            rowMap = this.rows[rowIdx];
        }

        //Finds out the column corresponding to each of the attributes and sets its value
        attrsWithName.forEach(attr => {
            let cols: Attribute[] = this._columns.allWithName(attr.name);

            //Prevents the same attribute becoming the value for multiple columns of the same name
            cols = cols.filter((col) => (usedColIds.indexOf(col.id) === -1));
            usedColIds.push(cols[0].id);

            rowMap.valueFor(cols[0].id).value = attr.value;
        });
    }

    addColumn(name?: string, required?: boolean, displayed?: boolean, readonly?: boolean, removable?: boolean,
              valueType?: ValueType, values?: string[]): Attribute {
        let defColName = ' ' + (this.colSize() + 1);
        let col;

        //Creates the new column with the appropriate name (it could be a single-row grid column)
        if (this.singleRow) {
            defColName = this.typeName + defColName;
        } else {
            defColName = 'Column' + defColName;
        }
        col = new Attribute(name || defColName, required, displayed, readonly, removable, valueType, values);

        //Updates row and column maps
        this._rows.addKey(col.id);
        this._columns.add(col);

        return col;
    }

    removeColumn(id: string): void {
        if (this._columns.remove(id)) {
            this._rows.removeKey(id);
        }
    }

    /**
     * Handler for column name updates. It refreshes the type properties of a given column if
     * the new name is unique.
     * @param {string} newName - Updated column name.
     * @param {number} colIndex - Index of the updated column.
     */
    onColumnUpdate(newName: string, colIndex: number) {
        if (this._columns.allWithName(newName).length === 1 || !this.type.uniqueCols) {
            this._columns.at(colIndex)!.updateType(this.type.getColumnType(newName));
        }
    }

    addRow(): ValueMap | undefined {
        if (this.singleRow && this._rows.size() > 0) {
            console.warn(`addRow: The feature [type=${this.type.name}] can't have more than one row`);
            return;
        }
        return this._rows.add(this._columns.keys());
    }

    canRemoveRowAt(index: number): boolean {
        return !this.singleRow && !(this.type.required && this.rowSize() === 1);
    }

    removeRowAt(index: number): void {
        if (!this.canRemoveRowAt(index)) {
            console.warn(`removeRowAt: The feature [type=${this.type.name}] can't have less than one row`);
            return;
        }
        this._rows.removeAt(index);
    }
}

/**
 * Annotation groups are implemented as grid features whose columns act as different annotations or rows.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
export class AnnotationFeature extends Feature {

    /**
     * Instantiates an annotation group based on its type and data.
     * @param {FeatureType} type - Normally of type "annotationsType"
     * @param {FeatureData} data - Key-value pairs wrapped with type.
     */
    constructor(type: FeatureType, data: FeatureData = <FeatureData>{}) {
        super(type, data);
    }

    /**
     * Convenience method for instantiating this annotation from attributes
     * @param {FeatureType} type - Normally of type "annotationsType"
     * @param {{name: string; value: string}[]} attrs - Key-value pairs
     */
    static create(type: FeatureType, attrs: NameAndValue[]): Feature {
        return new AnnotationFeature(type,
            {
                type: type.name,
                entries: [attrs]
            });
    }

    /**
     * Uses columns when counting the name of annotation "rows"
     * @returns {number} Number of columns.
     */
    rowSize(): number {
        return this.colSize();
    }

    /**
     * Bypasses the check for the singleRow flag as this is always true for annotations. See {@link AnnotationsType}
     * @param {number} index - Index in the list of columns
     * @returns {boolean} True if removable.
     */
    canRemoveRowAt(index: number): boolean {
        return this.rowSize() > 1 || !this.type.required;
    }

    /**
     * Checks that a column-like row can be removed.
     * @param {number} index - Index in the list of columns
     */
    removeRowAt(index: number): void {
        if (!this.canRemoveRowAt(index)) {
            console.warn(`removeRowAt: This annotation group is required. It cannot have less than one row`);
            return;
        }
        this.removeColumn(this.columns[index].id);
    }
}

export class Features extends HasUpdates<UpdateEvent> {
    private features: Feature[] = [];
    private subscriptions: Subscription[] = [];

    constructor(type: SectionType, data: SectionData) {
        super();

        const fd = (data.features || []).reduce((rv, d) => {
            rv[d.type] = d;
            return rv;
        }, {});

        type.featureTypes.forEach(ft => {
            this.add(ft, fd[ft.name]);
            fd[ft.name] = undefined;
        });

        Object.keys(fd).forEach(key => {
            if (fd[key] !== undefined) {
                const ft = type.getFeatureType(key);
                this.add(ft, fd[ft.name]);
            }
        });
    }

    get length(): number {
        return this.features.length;
    }

    list(): Feature[] {
        return this.features.slice();
    }

    add(type: FeatureType, data?: FeatureData): Feature | undefined {
        if (this.features.filter(f => f.type === type).length > 0) {
            console.error(`Feature of type ${type} already exists in the section`);
            return;
        }
        const feature = new Feature(type, data);
        const featureId = {id: feature.id, index: (this.features.length), key: type.name};
        this.features.push(feature);
        this.subscriptions.push(
            feature.updates().subscribe(
                u => this.notify(new UpdateEvent('feature_update', featureId, u))
            ));
        this.notify(new UpdateEvent('feature_add', featureId));
        return feature;
    }

    remove(feature: Feature): void {
        if (feature.type.tmplBased) {
            return;
        }
        const index = this.features.indexOf(feature);
        if (index < 0) {
            return;
        }
        this.subscriptions[index].unsubscribe();
        this.subscriptions.splice(index, 1);
        this.features.splice(index, 1);
        this.notify(new UpdateEvent('feature_remove', {index: index, id: feature.id}));

        //NOTE: Existing type names in the scope are guaranteed to be unique at setting time
        feature.type.destroy();
    }

    /**
     * Retrieves the feature object that fulfills a scalar comparison with one of its property values.
     * By default, it will look for a given ID.
     * @param {string} value - Value of the required feature's property.
     * @param {string} [property = 'id'] - Property name by which features are looked up.
     * @returns {Feature} Feature fulfilling the predicated comparison.
     */
    find(value: string, property: string = 'id'): Feature | undefined {
        return this.features.find((feature) => (feature[property] === value));
    }
}

export class Field extends HasUpdates<UpdateEvent> {
    readonly id: string;
    readonly type;

    private _value: string;

    constructor(type: FieldType,
                value: string = '') {
        super();
        this.id = `field_${nextId()}`;
        this.type = type;
        this._value = value;
    }

    get name(): string {
        return this.type.name;
    }

    get valueType(): string {
        return this.type.valueType;
    }

    get readonly(): string {
        return this.type.readonly;
    }

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        if (this._value !== v) {
            this._value = v;
            this.notify(new UpdateEvent('value', v));
        }
    }
}

export class Fields extends HasUpdates<UpdateEvent> {
    private fields: Field[];

    constructor(type: SectionType, data: SectionData) {
        super();
        this.fields = [];

        //Converts the array of attribute objects from the server to an object of type {attrName: attrValue}
        const attrObj = (data.attributes || []).reduce((obj, attr) => {
            let attrName = attr.name; //.name.replace(/([a-z])([A-Z])/g, '$1 $2');  //uncamelcased version
            let fieldType;

            //NOTE: Root-level attribute names from the server are UpperCamelCased whereas type field names are
            //in human-readable form. For external attributes only, this means lower-case and only first letter
            //capitalised with spaces in between.
            if (_.includes(rootAttrs, attrName)) {
                attrName = _.upperFirst(attrName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
            }
            fieldType = type.getFieldType(attrName);

            if (fieldType !== undefined) {
                obj[attrName] = attr.value;
            }

            return obj;
        }, {});

        type.fieldTypes.forEach(fieldType => {
            this.add(fieldType, attrObj[fieldType.name] || '');
        });
    }

    list(): Field[] {
        return this.fields.slice();
    }

    get length(): number {
        return this.fields.length;
    }

    private add(type: FieldType, value?: string): void {
        const field = new Field(type, value);
        const fieldId = {id: field.id, index: this.fields.length};
        this.fields.push(field);

        field.updates().subscribe(
            u => this.notify(new UpdateEvent('field_change', fieldId, u))
        )
    }

    /**
     * Retrieves the field object that fulfills a scalar comparison with one of its property values.
     * By default, it will look for a given ID.
     * @param {string} value - Value of the required field's property.
     * @param {string} [property = 'id'] - Property name by which fields are looked up.
     * @returns {Field} Field fulfilling the predicated comparison.
     */
    find(value: string, property: string = 'id'): Field | undefined {
        return this.fields.find((field) => (field[property] === value));
    }
}

export class Section extends HasUpdates<UpdateEvent> {
    private _accno: string;

    readonly id: string;
    readonly type: SectionType;
    readonly annotations: Feature;
    readonly fields: Fields;
    readonly features: Features;
    readonly sections: Sections;
    readonly tags: Tags;

    constructor(type: SectionType, data: SectionData = <SectionData>{}) {
        super();

        this.tags = Tags.create(data);

        this.id = `section_${nextId()}`;
        this.type = type;

        this._accno = data.accno || '';

        this.fields = new Fields(type, data);

        //Any attribute names from the server that do not match top-level field names are added as annotations.
        this.annotations = AnnotationFeature.create(type.annotationsType,
            (data.attributes || []).filter((attribute) => {
                let attrName = attribute.name;

                //NOTE: Root-level attribute names from the server are UpperCamelCased whereas type field names are
                //in human-readable form. For external attributes only, this means lower-case and only first letter
                //capitalised with spaces in between.
                if (_.includes(rootAttrs, attrName)) {
                    attrName = _.upperFirst(attrName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
                }

                return (type.getFieldType(attrName) === undefined);
            })
        );
        this.features = new Features(type, data);
        this.sections = new Sections(type, data);

        this.subscribeTo(this.fields, 'fields');
        this.subscribeTo(this.annotations, 'annotations');
        this.subscribeTo(this.features, 'features');
        this.subscribeTo(this.sections, 'sections');
    }

    get accno(): string {
        return this._accno;
    }

    set accno(accno: string) {
        this._accno = accno;
        this.notify(new UpdateEvent('accno', accno));
    }

    get typeName(): string {
        return this.type.name;
    }

    set typeName(name: string) {
        this.type.name = name;
        if (this.type.name === name) {
            this.notify(new UpdateEvent('type', name));
        }
    }

    isRequired(): boolean {
        return this.type.required;
    }

    sectionPath(id: string): Section[] {
        if (id === this.id) {
            return [this];
        }
        const path = this.sections
            .list()
            .map(s => s.sectionPath(id))
            .filter(p => p.length > 0);

        return (path.length > 0) ? ([] as Section[]).concat([this], path[0]) : [];
    }

    subscribeTo(hasUpdates: HasUpdates<UpdateEvent>, type: string) {
        hasUpdates.updates().subscribe(
            m => this.notify(new UpdateEvent(type, undefined, m))
        );
    }
}

export class Sections extends HasUpdates<UpdateEvent> {
    private sections: Section[];
    private subscriptions: Subscription[];

    constructor(type: SectionType, data: SectionData = {} as SectionData) {
        super();
        this.sections = [];
        this.subscriptions = [];

        const sd: { [key: string]: SectionData | undefined } = (data.sections || []).reduce((rv, d) => {
            rv[d.type] = d;
            return rv;
        }, {});

        type.sectionTypes.forEach(st => {
            if (st.required) {
                this.add(st, sd[st.name]);
                sd[st.name] = undefined;
            }
        });

        Object.keys(sd).forEach(key => {
            const d = sd[key];
            if (d !== undefined) {
                this.add(type.getSectionType(d.type), d);
            }
        });
    }

    get length(): number {
        return this.sections.length;
    }

    list(): Section[] {
        return this.sections.slice();
    }

    add(type: SectionType, data?: SectionData): Section {
        const s = new Section(type, data);

        const sectionId = {id: s.id, index: this.sections.length};
        this.sections.push(s);
        this.subscriptions.push(
            s.updates().subscribe(
                u => this.notify(new UpdateEvent('section_change', sectionId, u))
            )
        );
        this.notify(new UpdateEvent('section_add', sectionId));
        return s;
    }

    remove(section: Section): void {
        const sections = this.sections;
        const index = sections.indexOf(section);

        if (this.isRemovable(section)) {
            this.subscriptions[index].unsubscribe();
            this.subscriptions.splice(index, 1);
            this.notify(new UpdateEvent('section_remove', {index: index}));

            sections.splice(index, 1);
        }
    }

    //It is assumed that removable sections
    isRemovable(section: Section): boolean {
        return !section.isRequired() || !this.isLastOfType(section.typeName);
    }

    isLastOfType(typeName: string): boolean {
        const sectionsFiltered = this.sections.filter(section => {
            return section.type.name === typeName;
        });
        return sectionsFiltered.length === 1;
    }
}

export class Submission {
    accno: string;
    isRevised: boolean;        //true if submission has been sent and is marked as revised by PageTab class.
    readonly section: Section;
    readonly type;

    readonly tags: Tags;

    /**
     * Creates a new submission from PageTab-formatted data and pre-defined type definitions.
     * @see {@link PageTab}
     * @param {SubmissionType} type Type definitions object
     * @param {SubmissionData} data Submission data in PageTab format.
     */
    constructor(type: SubmissionType, data: SubmissionData = <SubmissionData>{}) {
        this.tags = Tags.create(data);
        this.type = type;
        this.accno = data.accno || '';
        this.isRevised = !this.isTemp && data.isRevised;
        this.section = new Section(type.sectionType, data.section);
    }

    /**
     * Determines if the current submission is a temporary one by probing its accession number's format
     * @returns {boolean} True if the submission is temporary.
     */
    get isTemp(): boolean {
        return this.accno.length == 0 || this.accno.indexOf('TMP') == 0;
    }

    sectionPath(id: string): Section[] {
        return this.section.sectionPath(id);
    }

    updates(): Observable<UpdateEvent> {
        return this.section.updates();
    }
}

export class Tags {
    private _tags: Tag[];
    private _accessTags: string[];

    static create(data?: TaggedData): Tags {
        if (data !== undefined) {
            return new Tags(data.tags, data.accessTags);
        }
        return new Tags();
    }

    constructor(tags: Tag[] = [], accessTags: string[] = []) {
        this._tags = tags.slice();
        this._accessTags = accessTags.slice();
    }

    get tags(): any[] {
        return this._tags.map(t => Object.assign({}, t));
    }

    get accessTags(): string[] {
        return this._accessTags.slice();
    }
}

export interface AttributeData {
    name: string;
    value: string;
    rootLevel: boolean;
    reference: boolean;
    terms: NameAndValue[];
}

export interface FeatureData {
    type: string;
    entries: AttributeData[][];
}

export interface TaggedData {
    tags: Tag[];
    accessTags: string[];
}

export interface SectionData extends TaggedData {
    type: string;
    accno: string;
    attributes: AttributeData[];
    features: FeatureData[];
    sections: SectionData[];
}

export interface SubmissionData extends TaggedData {
    accno: string;
    section: SectionData;
    isRevised: boolean;
}