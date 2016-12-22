import {PageTab} from './pagetab';
import {PAGETAB_SAMPLE} from './pagetab.sample';

describe('PageTab', () => {
    it('ensure publications are parsed correctly', () => {
        let subm = PageTab.noWait(PAGETAB_SAMPLE).asSubmission({});
        expect(subm.publications.items.length).toEqual(1);

        let attrs = subm.publications.items[0].attributes;
        expect(attrs.attributes.length).toEqual(5);

        for (let n of ['Title', 'Journal', 'Volume', 'Pages', 'Publication date']) {
            let title = attrs.find(n);
            expect(title).not.toBe(null);
        }
    });
});