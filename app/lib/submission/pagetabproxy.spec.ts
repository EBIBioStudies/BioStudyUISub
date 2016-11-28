import {PageTabProxy, PTLink, PTFile, PTContact, PTPubl, PTAttributes} from './pagetabproxy';

const SAMPLE = {
    type: 'Submission',
    accno: '1234',
    attributes: [
        {name: 'Title', value: 'Subm Title'},
        {name: 'ReleaseDate', value: '2016-01-01'}
    ],
    section: {
        attributes: [
            {name: 'Description', value: 'Subm Description'},
            {name: 'Annot 1', value: 'Annot Value 1'},
            {name: 'Annot 2', value: 'Annot Value 2'},
        ],
        links: [
            {
                url: 'http://example.com',
                attributes: [
                    {name: 'Description', value: 'url description'}
                ]
            }
        ],
        files: [{
            path: "/file",
            attributes: [
                {name: "Description", value: "file description"}
            ]
        }],
        subsections: [
            {
                type: "Publication",
                attributes: [
                    {name: "Title", value: "Publication Title"},
                    {name: "Journal", value: "PLoS biology"},
                    {name: "Volume", value: "3(1)"},
                    {name: "Pages", value: "e15"},
                    {name: "Publication date", value: "2005 Jan"}
                ]
            },
            {
                type: "Author",
                attributes: [
                    {name: "Name", value: "John Doe"},
                    {
                        name: "Affiliation",
                        value: "__affilRef1__",
                        isReference: true
                    }
                ]
            },
            {
                type: "Affiliation",
                accno: "__affilRef1__",
                attributes: [
                    {
                        "name": "Name", "value": "The Institute for Genomic Research, Rockville Maryland"
                    }
                ]
            }
        ]
    }


};

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
        let pt = PageTabProxy.create(SAMPLE);
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
    });
});
