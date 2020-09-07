import { Section } from 'app/pages/submission/submission-shared/model/submission';
import { PtAttribute, PageTabSection } from './pagetab.model';

export interface Dictionary<T> { [key: string]: T | undefined }
export type Nullable<T> = T | null | undefined;

const isEqualTo = (value: string) => (s: string) => s.toLowerCase() === value;

export function getOrganizationFromSubsection(section, orgName): any {
  const { sections = [] } = section.subsections || {};

  return sections.find((sectionItem) => (
    sectionItem.typeName === 'Organization' &&
    sectionItem.data.attributes.some((attribute) => attribute.value === orgName )
  )) || {};
}

export function authorsToContacts(sections: PageTabSection[] = []): PageTabSection[] {
  const isAffiliation = (s: string) => ['organization', 'organisation', 'affiliation'].includes(s.toLowerCase());
  const isAuthor = isEqualTo('author');
  const isName = isEqualTo('name');

  const affiliations: Dictionary<string> =
    sections
      .filter((section) => section.accno && section.type && isAffiliation(section.type))
      .reduce((result, section) => {
        let nameAttribute: PtAttribute = { value: '' };

        if (section.attributes) {
          nameAttribute = section.attributes.find((attribute) => attribute.name && isName(attribute.name)) || { value: '' };
        }

        result[section.accno] = nameAttribute.value;

        return result;
      }, {} as Dictionary<string>);

  const contacts = sections
    .filter((section) => section.type && isAuthor(section.type))
    .map(a =>
      ({
        type: 'Contact',
        attributes: (a.attributes || [])
          .map(attr => {
            if (attr.name && isAffiliation(attr.name)) {
              const value = (attr.reference || attr.isReference) && attr.value
                ? (affiliations[attr.value] || attr.value)
                : attr.value;

              return {name: 'Organisation', value} as PtAttribute;
            }

            return attr;
          })
      }) as PageTabSection);

  return sections
    .filter((section) => section.type && !isAuthor(section.type) && !isAffiliation(section.type))
    .concat(contacts);
}

class Organisations {
  private names: Dictionary<string> = {};
  private refs: Dictionary<string> = {};

  list(): { accno: string, name: string }[] {
    return Object.keys(this.refs).map((key) => {
      const ref = this.refs[key];
      const orgName = this.names[key];
      const accno = ref ? ref : '';
      const name = orgName ? orgName : '';

      return { name, accno };
    });
  }

  toReference(attr: PtAttribute): PtAttribute {
    if (String.isNotDefinedOrEmpty(attr.value)) {
      return { name: 'affiliation', value: attr.value } as PtAttribute;
    }

    const orgRef = this.refFor(attr.value!, attr.accno!);
    return { name: 'affiliation', value: orgRef, reference: true } as PtAttribute;
  }

  private generateNextRefValue(): string {
    const onlyDigitsRegex: RegExp = /\d+/;
    const refKeys: string[] = Object.keys(this.refs);

    const refValueNumbers: number[] = refKeys.map((key: string) => {
      const keyValue: string = this.refs[key] || '';
      const [num] = keyValue.match(onlyDigitsRegex) || ['0'];

      return Number.parseInt(num, 10);
    });

    const highestValueNumber: number = refValueNumbers.length > 0 ? Math.max(...refValueNumbers) : 0;

    return `o${highestValueNumber + 1}`;
  }

  private refFor(value: string, accno: string): string {
    const key: string = value.trim().toLowerCase();
    const isAccnoDefined: boolean = String.isDefined(accno);
    const isValueDefined: boolean = String.isDefined(this.names[key]);

    if (isValueDefined) {
      return this.refs[key]!;
    }

    if (isAccnoDefined) {
      this.refs[key] = accno;
      this.names[key] = value;

      return this.refs[key]!;
    }

    this.refs[key] = this.generateNextRefValue();
    this.names[key] = value;

    return this.refs[key]!;
  }
}

export function contactsToAuthors(sections: PageTabSection[] = []): PageTabSection[] {
  const isContact = isEqualTo('contact');
  const isOrganisation = isEqualTo('organisation');
  const orgs = new Organisations();

  const contacts: PageTabSection[] = sections.filter((section) => isContact(section.type!));
  const authors: PageTabSection[] = contacts.map(contact => ({
      type: 'Author',
      attributes: (contact.attributes || [])
        .map(attr => {
          if (isOrganisation(attr.name!)) {
            const organization = getOrganizationFromSubsection(contact, attr.value);

            return orgs.toReference({ ...attr, accno: organization.accno });
          }
          return attr;
        })
    }) as PageTabSection);

  const affiliations: PageTabSection[] = orgs.list().map(org =>
    ({
      type: 'Organization',
      accno: org.accno,
      attributes: [{name: 'Name', value: org.name} as PtAttribute]
    }) as PageTabSection
  );

  return sections
    .filter(s => !isContact(s.type!))
    .concat(authors)
    .concat(affiliations);
}
