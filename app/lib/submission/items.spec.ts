import {Item, Items} from './submission';

describe('Items', () => {
    it('should be empty when created with no arguments', () => {
        let items = new Items(Item.factory([]));
        expect(items.items.length).toEqual(0);
    });

    it('should notify about changes', () => {
        let items = new Items(Item.factory([]));
        expect(items.changes()).toBeDefined();
        let res = [];

        let sub = items.changes().subscribe(m => {
            res.push(m);
        });

        items.addNew();
        items.items[0].attributes.addNew();
        items.items[0].attributes.attributes[0].name = 'new name';
        items.items[0].attributes.remove(0);
        items.remove(0);

        sub.unsubscribe();
        items.addNew();

        expect(res.length).toEqual(5);
    });
});
