export const PAGETAB_SAMPLE = {
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
