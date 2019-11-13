import { authors2Contacts, contacts2Authors } from './pagetab-authors.utils';

describe('AuthorsAndAffiliations:', () => {
    it('authorsToContacts: authors and affiliations are merged into contacts', () => {
        expect(authors2Contacts(
            [
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'John D'
                        },
                        {
                            name: 'affiliation',
                            reference: true,
                            value: 'o1'
                        }
                    ]
                },
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Guy R'
                        },
                        {
                            name: 'affiliation',
                            value: 'Some organisation'
                        }
                    ]
                },
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Bob D'
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
                },
                {
                    type: 'Other',
                    attributes: []
                }
            ])).toEqual(
            [
                {
                    type: 'Other',
                    attributes: []
                },
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
                },
                {
                    type: 'Contact',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Guy R'
                        },
                        {
                            name: 'Organisation',
                            value: 'Some organisation'
                        }
                    ]
                },
                {
                    type: 'Contact',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Bob D'
                        }
                    ]
                }
            ]);
    });

    it('contactsToAuthors: [contact] sections are split into authors and affiliations', () => {
        const authors = contacts2Authors(
            [
                {
                    type: 'Contact',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'John D'
                        },
                        {
                            name: 'Organisation',
                            value: 'Org1'
                        }]
                },
                {
                    type: 'Contact',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Bob D'
                        },
                        {
                            name: 'Organisation',
                            value: 'Org1'
                        }
                    ]
                },
                {
                    type: 'Contact',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Guy R'
                        },
                        {
                            name: 'Organisation',
                            value: ''
                        }
                    ]
                },
                {
                    type: 'Other',
                    attributes: []
                }]);

        expect(authors).toEqual(
            [
                {
                    type: 'Other',
                    attributes: []
                },
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'John D'
                        },
                        {
                            name: 'affiliation',
                            reference: true,
                            value: 'o1'
                        }
                    ]
                },
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Bob D'
                        },
                        {
                            name: 'affiliation',
                            reference: true,
                            value: 'o2'
                        }
                    ]
                },
                {
                    type: 'Author',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Guy R'
                        },
                        {
                            name: 'affiliation',
                            value: ''
                        }
                    ]
                },
                {
                    type: 'Organization',
                    accno: 'o2',
                    attributes: [
                        {
                            name: 'Name',
                            value: 'Org1'
                        }
                    ]
                }
            ]
        );

    });
});
