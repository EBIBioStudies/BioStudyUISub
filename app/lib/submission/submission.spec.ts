import {Submission} from './submission';

describe('Submission', () => {
    it('should be empty when created with no arguments', () => {
        let subm = Submission.create({});
        expect(subm.accno).toBe('');
        expect(subm.title).toBe('');
        expect(subm.description).toBe('');
        expect(subm.releaseDate).toBe('');
        expect(subm.annotations.items.length).toBe(1);
        expect(subm.annotations.items[0].attributes.attributes.length).toBe(0);
        expect(subm.files.items.length).toBe(0);
        expect(subm.links.items.length).toBe(0);
        expect(subm.contacts.items.length).toBe(0);
        expect(subm.publications.items.length).toBe(0);
    });

    it('', () => {

    });
});