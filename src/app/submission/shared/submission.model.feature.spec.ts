import {FeatureType, invalidateGlobalScope} from './submission-type.model';
import {Feature, FeatureData} from './submission.model';

describe('Submission Model: Feature', () => {

    beforeEach(() => {
        invalidateGlobalScope();
    });

    it('can be multi row', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        expect(f.colSize()).toBe(0);
        expect(f.rowSize()).toBe(0);
        expect(f.singleRow).toBeFalsy();
        expect(f.type.name).toEqual('MultiRowFeature');
    });

    it('can be single row', () => {
        const f = new Feature(FeatureType.createDefault('SingleRowFeature', true));
        expect(f.colSize()).toBe(0);
        expect(f.rowSize()).toBe(1);
        expect(f.singleRow).toBeTruthy();
        expect(f.type.name).toEqual('SingleRowFeature');
    });

    it('allows to add more rows to a multi row feature', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        expect(f.singleRow).toBeFalsy();
        expect(f.rowSize()).toBe(0);
        f.addRow();
        f.addRow();
        expect(f.rowSize()).toBe(2);
    });

    it('does not allow to add rows to a single row feature', () => {
        const f = new Feature(FeatureType.createDefault('SingleRowFeature', true));
        expect(f.singleRow).toBeTruthy();
        expect(f.rowSize()).toBe(1);
        f.addRow();
        f.addRow();
        expect(f.rowSize()).toBe(1);
    });

    it('creates default empty values (in rows) when a new column is added', () => {
        const f = new Feature(FeatureType.createDefault('SingleRowFeature', true));
        const col = f.addColumn('col1');
        expect(f.rows[0].valueFor(col.id).value).toBe('');
    });

    it('removes values from all rows when a column is deleted', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        const col = f.addColumn('col1');
        f.addRow();
        f.addRow();
        expect(f.rowSize()).toBe(2);
        expect(f.rows[0].valueFor(col.id).value).toBe('');
        expect(f.rows[1].valueFor(col.id).value).toBe('');

        f.removeColumn(col.id);
        expect(f.rows[0].valueFor(col.id)).toBeUndefined();
        expect(f.rows[1].valueFor(col.id)).toBeUndefined();
    });

    it('automatically updates columns and rows when new data added as attributes', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        f.add([{
            name: 'col1',
            value: 'value1'
        }, {
            name: 'col2',
            value: 'value2'
        }]);
        expect(f.rowSize()).toBe(1);
        expect(f.colSize()).toBe(2);
        const ids = f.columns.map(c => c.id);
        expect(f.rows[0].values(ids).map(v => v.value).sort()).toEqual(['value1', 'value2']);
    });

    it('can be created with the pre-existed data', () => {
        const data = {
            type: 'MultiRowFeature',
            entries: [
                {
                    attributes: [
                        {
                            name: 'col1',
                            value: 'value1'
                        },
                        {
                            name: 'col2',
                            value: 'value2'
                        }
                    ]
                }
            ]
        } as FeatureData;
        const f = new Feature(FeatureType.createDefault(data.type), data);
        expect(f.rowSize()).toBe(1);
        expect(f.colSize()).toBe(2);
        const ids = f.columns.map(c => c.id);
        expect(f.rows[0].values(ids).map(v => v.value).sort()).toEqual(['value1', 'value2']);
    });

    it('creates required columns according the type definition', () => {
        const type = new FeatureType('MyFeatureType', true, false, {
            columnTypes: [
                {name: 'col1', required: true},
                {name: 'col2', required: false}
            ]
        });
        const f = new Feature(type);
        expect(f.rowSize()).toBe(1);
        expect(f.colSize()).toBe(1);
    });

    it('must not allow to remove/or modify required column', () => {
        const type = new FeatureType('MyFeatureType', true, false, {
            columnTypes: [
                {name: 'col1', required: true},
                {name: 'col2', required: false}
            ]
        });
        const f = new Feature(type);
        expect(f.colSize()).toBe(1);

        const col = f.columns[0];
        col.name = 'col11';
        expect(col.name).toEqual('col1');

        f.removeColumn(col.id);
        expect(f.colSize()).toBe(1);
    });

    it('must notify when a column is added', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        let updateEvent;
        f.updates().subscribe(ue => {
            updateEvent = ue;
        });

        const col = f.addColumn('col1');
        expect(updateEvent).toBeDefined();
        expect(updateEvent.source).toBeDefined();
        expect(updateEvent.source.name).toBe('column_add');
        expect(updateEvent.source.value.id).toBe(col.id);
    });

    it('must notify when a row is added', () => {
        const f = new Feature(FeatureType.createDefault('MultiRowFeature'));
        let updateEvent;
        f.updates().subscribe(ue => {
            updateEvent = ue;
        });

        f.addRow();
        expect(updateEvent).toBeDefined();
        expect(updateEvent.source).toBeDefined();
        expect(updateEvent.source.name).toBe('row_add');
        expect(updateEvent.source.value.index).toBe(0);
    });

});
