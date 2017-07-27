import {convertAuthorsToContacts} from './authors-affiliations.helper';

describe('AuthorsAndAffiliations:', () => {
    it("merge: returns undefined if the object is undefined", () => {
        expect(convertAuthorsToContacts(undefined)).toBeUndefined();
    });

    it("merge: sections that are not of type 'author' or 'affiliation' are stayed untouched", () => {
        const obj = {
            subsections: [
                {
                    type: 'Section1'
                },
                {
                    type: 'Section2'
                }
            ]
        };
        expect(convertAuthorsToContacts(obj)).toEqual(obj);
    });

    it("merge: authors and affiliations are merged into contacts", () => {
       expect(convertAuthorsToContacts({
           subsections: [
               {
                   type: 'Author',
                   attributes: [
                       {
                           name: 'Name',
                           value: 'John D'
                       },
                       {
                           name: 'Affiliation',
                           isReference: true,
                           value: 'o1'
                       }
                   ]
               },
               {
                   type: 'Organization',
                   accno: 'o1',
                   attributes: [
                       {
                           name: 'Name',
                           value: 'EMBL-EBI'
                       }
                   ]
               }
           ]
       })).toEqual({
           subsections: [
               {
                   type: 'Contact',
                   attributes: [
                       {
                           name: 'Name',
                           value: 'John D'
                       },
                       {
                           name: 'Organisation',
                           value: 'EMBL-EBI'
                       }
                   ]
               }
           ]
       });
    });
});
