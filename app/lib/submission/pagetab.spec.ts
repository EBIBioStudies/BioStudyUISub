import {PAGETAB_SAMPLE} from './pagetab.sample';
import {PageTab, PageTabProxy} from './index';

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

    it('ensure publications are created correctly', () => {
        let pt = PageTab.noWait();
        pt.asSubmission({})
            .addPublication('1234', [
                {name: 'type', value: 'journal'},
                {name: 'title', value: 'title'}
            ]);
        let d = new PageTabProxy(pt.data);
        let publications = d.publications;
        expect(publications.length).toEqual(1);
        expect(publications[0].pubMedId).toBe('1234');
        expect(publications[0].attrs.length).toEqual(2);
    });
});