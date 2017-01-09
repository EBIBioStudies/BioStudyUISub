import {PageTabProxy, PTLink, PTFile, PTContact, PTPubl, PTAttributes} from './pagetabproxy';

import {PAGETAB_SAMPLE} from './pagetab.sample';

describe('PageTabProxy', () => {
    it('ensure default values are set', () => {
        let pt = PageTabProxy.create();
        expect(pt.type).toBe('Submission');
        expect(pt.accno).toBe('');
        expect(pt.title).toBe('');
        expect(pt.description).toBe('');
        expect(pt.releaseDate).toBe('');
        expect(pt.annotations.length).toEqual(0);
        expect(pt.links.length).toEqual(0);
        expect(pt.files.length).toEqual(0);
        expect(pt.publications.length).toEqual(0);
        expect(pt.contacts.length).toEqual(0);
    });

    it('ensure initial values are set', () => {
        let pt = PageTabProxy.create(PAGETAB_SAMPLE);
        expect(pt.type).toBe('Submission');
        expect(pt.accno).toBe('1234');
        expect(pt.title).toBe('Subm Title');
        expect(pt.description).toBe('Subm Description');
        expect(pt.releaseDate).toBe('2016-01-01');
        expect(pt.annotations.length).toEqual(2);
        expect(pt.links.length).toEqual(1);
        expect(pt.files.length).toEqual(1);
        expect(pt.publications.length).toEqual(1);
        expect(pt.contacts.length).toEqual(1);
    });

    it('ensure title is updated', () => {
        let pt = PageTabProxy.create();
        pt.title = 'new title';
        expect(pt.title).toBe('new title');
    });

    it('ensure description is updated', () => {
        let pt = PageTabProxy.create();
        pt.description = 'new descr';
        expect(pt.description).toBe('new descr');
    });

    it('ensure releaseDate is updated', () => {
        let pt = PageTabProxy.create();
        pt.releaseDate = '2016-12-12';
        expect(pt.releaseDate).toBe('2016-12-12');
    });

    it('ensure annotations are updated', () => {
        let pt = PageTabProxy.create();
        pt.annotations = new PTAttributes([
            {name: 'annot', value: 'annot'}
        ]);
        expect(pt.annotations.length).toEqual(1);
    });

    it('ensure links are updated', () => {
        let pt = PageTabProxy.create();
        pt.links = [
            new PTLink({url: "url", attributes: [{name: 'test', value: 'test'}]})
        ];
        let links = pt.links;
        expect(links.length).toEqual(1);
        expect(links[0].attrs.length).toEqual(1);
    });

    it('ensure files are updated', () => {
        let pt = PageTabProxy.create();
        pt.files = [
            new PTFile({path: "/file", attributes: [{name: 'test', value: 'test'}]})
        ];
        let files = pt.files;
        expect(files.length).toEqual(1);
        expect(files[0].attrs.length).toEqual(1);
    });

    it('ensure contacts are updated', () => {
        let pt = PageTabProxy.create();
        pt.contacts = [
            new PTContact({
                attributes: [
                    {name: 'name', value: 'John Doe'},
                    {name: 'affiliation', value: 'EBI'}]
            })
        ];
        let cs = pt.contacts;
        expect(cs.length).toEqual(1);
        expect(cs[0].attrs.length).toEqual(1);
        expect(cs[0].org).toBe('EBI');
    });

    it('ensure publications are updated', () => {
        let pt = PageTabProxy.create();
        pt.publications = [
            new PTPubl({
                acc: '12345',
                attributes: [
                    {name: "Title", value: "Publication Title"},
                    {name: "Journal", value: "PLoS biology"},
                    {name: "Volume", value: "3(1)"},
                    {name: "Pages", value: "e15"},
                    {name: "Publication date", value: "2005 Jan"}
                ]
            })
        ];
        let publs = pt.publications;
        expect(publs.length).toEqual(1);
        expect(publs[0].attrs.length).toEqual(5);
        expect(publs[0].pubMedId).toBe('12345');
    });
});
