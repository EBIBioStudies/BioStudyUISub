import { zip } from 'fp-ts/lib/Array';
import {
  FeatureType,
  ValueType,
  DisplayType
} from '../../templates';
import { AttributeData, FeatureData } from './submission';
import Columns from './submission-columns.model';
import Rows from './submission-rows.model';
import Attribute from './submission-attribute.model';
import { identifierGenerator } from '../utils/identifier-generator';
import ValueMap from '../common/value-map';

type FeatureGroup = Feature[];

class Feature {
  readonly id: string;
  readonly type: FeatureType;
  readonly groups: FeatureGroup[] = [];
  private _columns: Columns;
  private _rows: Rows;

  static create(type: FeatureType, attrs: AttributeData[]): Feature {
      return new Feature(type,
          {
              type: type.name,
              entries: [attrs]
          });
  }

  constructor(type: FeatureType, data: FeatureData = {} as FeatureData) {
      this.id = `feature_${identifierGenerator()}`;
      this.type = type;
      this._columns = new Columns();
      this._rows = new Rows(type.singleRow ? 1 : undefined);

      type.columnTypes.filter(ct => ct.isRequired || ct.isDesirable)
          .forEach(ct => {
              this.addColumn(ct.name, ct.valueType, ct.displayType, true);
          });

      (data.entries || []).forEach(entry => {
          this.add(entry);
      });

      if (type.displayType.isShownByDefault && this.isEmpty) {
          this.addRow();
      }
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
  }

  get rows(): ValueMap[] {
      return this._rows.list();
  }

  get columns(): Attribute[] {
      return this._columns.list();
  }

  get colNames(): string[] {
      return this._columns.names();
  }

  rowSize(): number {
      return this._rows.size();
  }

  colSize(): number {
      return this._columns.size();
  }

  get isEmpty(): boolean {
      return this.rowSize() === 0;
  }

  add(attributes: AttributeData[] = [], rowIdx?: number): void {
      if (attributes.isEmpty()) {
          return;
      }

      const rowMap = this.getOrCreateRow(rowIdx);
      if (rowMap === undefined) {
          throw new Error(`Can't add new row to ${this.typeName}: ${attributes.map(at => at.name).join(',')}`);
      }

      const attrsWithName = attributes.filter(attr => String.isDefinedAndNotEmpty(attr.name));
      const newColNames = attrsWithName.map(attr => attr.name!);

      const existedColNames = this._columns.names();

      newColNames.uniqueValues().forEach(colName => {
          const colType = this.type.getColumnType(colName);
          const requiredColCount = newColNames.filter(name => name === colName).length;
          let colCount = existedColNames.filter(name => name === colName).length;
          while (colCount < requiredColCount) {
              this.addColumn(colName, colType!.valueType, colType!.displayType);
              colCount++;
          }

          const attrs = attrsWithName.filter(attr => attr.name === colName);
          const columns = this._columns.filterByName(colName);

          zip(attrs, columns).forEach((pair) => {
              rowMap!.valueFor(pair[1].id)!.value = pair[0].value || '';
          });
      });
  }

  private getOrCreateRow(rowIdx?: number): ValueMap | undefined {
      return (rowIdx === undefined) ? this.addRow() : this._rows.at(rowIdx);
  }

  addColumn(name?: string, valueType?: ValueType, displayType?: DisplayType, isTemplateBased: boolean = false): Attribute {
      const defColName = (this.singleRow ? this.typeName : 'Column') + ' ' + this._columns.index.next;
      const colName = name || defColName;
      const col = new Attribute(colName, valueType, displayType, isTemplateBased);
      this._rows.addKey(col.id);
      this._columns.add(col);
      return col;
  }

  addRow(): ValueMap | undefined {
      if (this.canAddRow()) {
          return this._rows.add(this._columns.keys());
      }
      return undefined;
  }

  canAddRow(): boolean {
      return (!this.singleRow || this.rowSize() === 0);
  }

  removeRowAt(index: number): boolean {
      return this._rows.removeAt(index);
  }

  removeColumn(id: string): boolean {
      this._columns.remove(id);
      this._rows.removeKey(id);
      return true;
  }

  findColumnById(columnId: string): Attribute | undefined {
      return this._columns.findById(columnId);
  }
}

export default Feature;
