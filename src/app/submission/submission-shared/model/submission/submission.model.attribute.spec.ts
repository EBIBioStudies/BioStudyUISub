import { Attribute } from './submission.model';

describe('Submission Model: Attribute', () => {
    it('it has default values if nothing is specified', () => {
        const attr = new Attribute();
        expect(attr.name.isEmpty).toBeTruthy();
        expect(attr.canEditName).toBeTruthy();
        expect(attr.displayType.isOptional).toBeTruthy();
        expect(attr.valueType.isText).toBeTruthy();
        expect(attr.id).toBeDefined();
    });

    it('it can not change its name if it is came from a template', () => {
        const attr1 = new Attribute('Attr1', undefined, undefined, true);
        attr1.name = 'Attr2';
        expect(attr1.name).toBe('Attr1');
    });
});
