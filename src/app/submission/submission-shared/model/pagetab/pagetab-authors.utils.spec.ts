import { authorsToContacts } from './pagetab-authors.utils';

describe('AuthorsAndAffiliations:', () => {
  it('authorsToContacts: authors and affiliations are merged into contacts', () => {
    expect(
      authorsToContacts([
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
      ])
    ).toEqual([
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
            reference: false,
            value: [{ name: 'EMBL-EBI' }]
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
            reference: false,
            value: [{ Name: 'Some organisation' }]
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
});
