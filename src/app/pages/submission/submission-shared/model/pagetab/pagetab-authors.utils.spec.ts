import { authorsToContacts, contactsToAuthors } from './pagetab-authors.utils';

describe('AuthorsAndAffiliations:', () => {
  it('authorsToContacts: authors and affiliations are merged into contacts', () => {
    expect(authorsToContacts(
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
    const authors = contactsToAuthors(
      [
        {
          type: 'Contact',
          attributes: [
            {
              name: 'Name',
              value: 'John D'
            },
            {
              accno: 'o1',
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
              accno: 'o1',
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
              value: ''
            }
          ]
        },
        {
          type: 'Organization',
          accno: 'o1',
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
