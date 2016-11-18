import {PageTab} from './pagetab';

describe('PageTab class', () => {
    it('can be empty', () => {
        let pt = PageTab.create();
        expect(pt.type).toBe('submission');
        expect(pt.accno).toBe('');
    });
});
