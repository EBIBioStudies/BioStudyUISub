import { AttributeValue } from './submission.model.attribute-value';
import { ColumnType, TableType, invalidateGlobalScope } from '../templates';
import { Feature, TableData } from './submission.model';

describe('Submission Model: Feature', () => {
  beforeEach(() => {
    invalidateGlobalScope();
  });

  it('can be multi row', () => {
    const f = new Feature(TableType.createDefault('MultiRowFeature'));
    expect(f.colSize()).toBe(0);
    expect(f.rowSize()).toBe(0);
    expect(f.singleRow).toBeFalsy();
    expect(f.type.name).toEqual('MultiRowFeature');
  });

  it('can be single row', () => {
    const f = new Feature(TableType.createDefault('SingleRowFeature', true));
    expect(f.colSize()).toBe(0);
    expect(f.rowSize()).toBe(0);
    expect(f.singleRow).toBeTruthy();
  });

  it('allows to add more rows to a multi row feature', () => {
    const f = new Feature(TableType.createDefault('MultiRowFeature'));
    expect(f.singleRow).toBeFalsy();
    expect(f.rowSize()).toBe(0);
    f.addRow();
    f.addRow();
    expect(f.rowSize()).toBe(2);
  });

  it('creates default empty values (in rows) when a new column is added', () => {
    const f = new Feature(TableType.createDefault('AFeature'));
    f.addRow();
    const col = f.addColumn('col1')!;
    expect(f.rows[0]!.valueFor(col.id)!.value).toBe('');
  });

  it('removes values from all rows when a column is deleted', () => {
    const f = new Feature(TableType.createDefault('AFeature'));
    const col = f.addColumn('col1')!;
    f.addRow();
    f.addRow();
    expect(f.rowSize()).toBe(2);
    expect(f.rows[0]!.valueFor(col.id)!.value).toBe('');
    expect(f.rows[1]!.valueFor(col.id)!.value).toBe('');

    f.removeColumn(col.id);
    expect(f.rows[0].valueFor(col.id)).toStrictEqual(new AttributeValue(''));
    expect(f.rows[1].valueFor(col.id)).toStrictEqual(new AttributeValue(''));
  });

  it('automatically updates columns and rows when new data added as attributes', () => {
    const f = new Feature(TableType.createDefault('AFeature'));
    f.add([
      {
        name: 'col1',
        value: 'value1'
      },
      {
        name: 'col2',
        value: 'value2'
      }
    ]);
    expect(f.rowSize()).toBe(1);
    expect(f.colSize()).toBe(2);
    const ids = f.columns.map((c) => c.id);
    expect(
      f.rows[0]
        .values(ids)
        .map((v) => v && v.value)
        .sort()
    ).toEqual(['value1', 'value2']);
  });

  it('can be created with the pre-existed data', () => {
    const data = {
      type: 'AFeature',
      entries: [
        [
          {
            name: 'col1',
            value: 'value1'
          },
          {
            name: 'col2',
            value: 'value2'
          }
        ]
      ]
    } as TableData;
    const f = new Feature(TableType.createDefault(data.type!), data);
    expect(f.rowSize()).toBe(1);
    expect(f.colSize()).toBe(2);
    const ids = f.columns.map((c) => c.id);
    expect(
      f.rows[0]
        .values(ids)
        .map((v) => v && v.value)
        .sort()
    ).toEqual(['value1', 'value2']);
  });

  it('creates required columns according the type definition', () => {
    const type = new TableType(
      'AFeature',
      {
        columnTypes: [
          { name: 'col1', display: 'required' } as ColumnType,
          { name: 'col2', display: 'optional' } as ColumnType
        ]
      },
      undefined,
      true
    );
    const f = new Feature(type);
    expect(f.rowSize()).toBe(0);
    expect(f.colSize()).toBe(1);
  });
});
