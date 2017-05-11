import {Item, Attributes} from './submission';

describe('Item', () => {
    it('should be empty when created with no arguments', () => {
        let item = new Item(Attributes.create());
        expect(item.attributes.attributes.length).toBe(0);
    });

    it('should notify about changes',() => {
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
