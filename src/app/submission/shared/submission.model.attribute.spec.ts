import {Attribute, UpdateEvent} from './submission.model';

describe('Submission Model: Attribute', () => {
    it('can be required or not', () => {
        const attr1 = new Attribute('Attr1');
        const attr2 = new Attribute('Attr2', true);
        const attr3 = new Attribute('Attr2', false);
        expect(attr1.required).toBeFalsy();
        expect(attr2.required).toBeTruthy();
        expect(attr3.required).toBeFalsy();
    });

    it('allows to change its name (if required == false)', () => {
        const attr1 = new Attribute('Attr1', false);
        attr1.name = 'Attr2';
        expect(attr1.name).toBe('Attr2');
    });

    it('notifies about name changes (if required == false)', () => {
        const attr1 = new Attribute('Attr1', false);
        let ue: UpdateEvent;
        attr1.updates().subscribe(u => {
            ue = u;
        });
        attr1.name = 'Attr2';
        expect(ue).toBeDefined();
        expect(ue.name).toBe('name');
        expect(ue.value).toBe('Attr2');
        expect(ue.source).toBeUndefined();
    });

    it('does not allow to change its name (if required == true)', () => {
        const attr1 = new Attribute('Attr1', true);
        attr1.name = 'Attr2';
        expect(attr1.name).toBe('Attr1');
    });

    it ('does not notify about name changes (if required == true)', () => {
        const attr1 = new Attribute('Attr1', true);
        let ue: UpdateEvent;
        attr1.updates().subscribe(u => {
            ue = u;
        });
        attr1.name = 'Attr2';
        expect(ue).toBeUndefined();
    });
});
