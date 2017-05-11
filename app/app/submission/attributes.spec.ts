import {Attributes} from './submission';

describe('Attributes', () => {
    it('can be empty', () => {
        let attrs = Attributes.create();
        expect(attrs.attributes.length).toEqual(0);
    });

    it('can be created with predefined set of attributes', () => {
        let attrs = Attributes.create([
            {name: 'Name1', value: 'Value1'},
            {name: 'Name2', value: 'Value2'},
        ], [
            {name: 'Name1', type: 'some_type'} // required
        ]);
        expect(attrs.attributes.length).toEqual(2);
        let fst = attrs.attributes[0];
        expect(fst.name).toBe('Name1');
        expect(fst.value).toBe('Value1');
        expect(fst.required).toBe(true);
        expect(fst.type).toBe('some_type');
    });

    it('ignores removing required attribute', () => {
        let attrs = Attributes.create([
            {name: 'Name1', value: 'Value1'},
            {name: 'Name2', value: 'Value2'},
        ], [
            {name: 'Name1', type: 'some_type'}
        ]);
        attrs.remove(1); //ok
        attrs.remove(0); //should ignore this
        expect(attrs.attributes.length).toEqual(1);
    });

    it('notifies about changes', () => {
        let attrs = Attributes.create();
        expect(attrs.changes()).toBeDefined();
        let res = [];

        let sub = attrs.changes().subscribe(m => {
            res.push(m);
        });

        attrs.addNew();
        attrs.attributes[0].name = 'new name';
        attrs.attributes[0].value = 'new value';
        attrs.remove(0);

        sub.unsubscribe();
        attrs.addNew();

        expect(res.length).toEqual(4);
    });
});
