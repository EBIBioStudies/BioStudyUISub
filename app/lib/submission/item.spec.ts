import {Item, Attributes} from './submission';

describe('Item', () => {
    it('can be empty', () => {
        let item = new Item(Attributes.create());
        expect(item.attributes.attributes.length).toBe(0);
    });

    it('notifies about changes',() => {
        let item = new Item(Attributes.create());
        expect(item.changes()).toBeDefined();

        let res = [];

        let sub = item.changes().subscribe(
            m => {
               res.push(m);
            }
        );

        item.attributes.addNew();
        item.attributes.attributes[0].name = 'Name';
        item.attributes.attributes[0].value = 'Value';
        item.attributes.remove(0);

        sub.unsubscribe();

        expect(res.length).toBe(4);
    });
});
