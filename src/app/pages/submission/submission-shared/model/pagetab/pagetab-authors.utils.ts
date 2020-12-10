import { filter } from 'rxjs/operators';
import { PtAttribute, PageTabSection } from './pagetab.model';
import { isStringEmpty, isDefinedAndNotEmpty, isStringDefined, isAttributeEmpty } from 'app/utils';

export interface Dictionary<T> {
  [key: string]: T | undefined;
}
export type Nullable<T> = T | null | undefined;

const isEqualTo = (value: string) => {
  return (s: Nullable<string>) => isStringDefined(s) && s!.toLowerCase() === value;
};

export function getOrganizationFromSubsection(section, orgName): any {
  const { sections = [] } = section.subsections || {};

  return (
    sections.find(
      (sectionItem) =>
        sectionItem.typeName === 'Organization' &&
        sectionItem.data.attributes.some((attribute) => attribute.value === orgName)
    ) || {}
  );
}

export function authorsToContacts(sections: PageTabSection[] = []): PageTabSection[] {
  const isAffiliation = (s: Nullable<string>) => {
    return isStringDefined(s) && ['organization', 'organisation', 'affiliation'].includes(s!.toLowerCase());
  };
  const isAuthor = isEqualTo('author');
  const isName = isEqualTo('name');
  const orgs = new Organisations();

  const affiliations: Dictionary<string> = sections
    .filter((s) => isStringDefined(s.accno) && isAffiliation(s.type))
    .reduce((result, section) => {
      let nameAttribute: PtAttribute = { value: '' };

      if (section.attributes) {
        nameAttribute = section.attributes.find((attribute) => attribute.name && isName(attribute.name)) || {
          value: ''
        };
      }

      result[section.accno!] = nameAttribute.value as string;

      return result;
    }, {} as Dictionary<string>);

  const contacts = sections
    .filter((section) => section.type && isAuthor(section.type))
    .map((author) => ({ type: 'Contact', attributes: orgs.referencesToOrg(author, affiliations) } as PageTabSection));

  return sections
    .filter((section) => section.type && !isAuthor(section.type) && !isAffiliation(section.type))
    .concat(contacts);
}

class Organisations {
  private names: Dictionary<string> = {};
  private refs: Dictionary<string> = {};

  list(): { accno: string; name: string }[] {
    return Object.keys(this.refs).map((key) => {
      const ref = this.refs[key];
      const orgName = this.names[key];
      const accno = ref ? ref : '';
      const name = orgName ? orgName : '';

      return { name, accno };
    });
  }

  orgToReferences(contact: PageTabSection): PtAttribute[] {
    const attributes: PtAttribute[] = contact.attributes || [];
    const isOrganisation = isEqualTo('organisation');
    const orgAttribute = attributes.find((attribute) => isOrganisation(attribute.name));

    if (orgAttribute === undefined) {
      return attributes;
    }

    const attributesWithoutOrg = attributes.filter((attribute) => !isOrganisation(attribute.name));
    const orgAttributeValue = Array.isArray(orgAttribute.value) ? orgAttribute.value : [orgAttribute.value];

    const references = orgAttributeValue.map((value) => {
      const organization = getOrganizationFromSubsection(contact, value);

      return this.toReference(value, organization.accno);
    });

    return [...attributesWithoutOrg, ...references];
  }

  referencesToOrg(author: PageTabSection, affiliations: Dictionary<string>): PtAttribute[] {
    const attributes: PtAttribute[] = author.attributes || [];
    const isAffiliation = isEqualTo('affiliation');
    const affiliationAttributes = attributes.filter((attribute) => isAffiliation(attribute.name));
    const otherAttributes = attributes.filter((attribute) => !isAffiliation(attribute.name));

    const referenceValues = affiliationAttributes.map((attribute) => {
      const isReference: boolean = Boolean(attribute.reference || attribute.isReference);
      const attributeValue = attribute.value as string;

      return isReference ? affiliations[attributeValue] || attributeValue : attributeValue;
    });

    if (referenceValues.length > 0) {
      return [...otherAttributes, { name: 'Organisation', value: referenceValues }];
    }

    return otherAttributes;
  }

  private toReference(orgValue: string | undefined, accno: string): PtAttribute {
    if (orgValue === undefined || isStringEmpty(orgValue)) {
      return { name: 'affiliation', value: orgValue } as PtAttribute;
    }

    const orgRef = this.refFor(orgValue, accno!);
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
    const isAccnoDefined: boolean = isStringDefined(accno);
    const isValueDefined: boolean = isStringDefined(this.names[key]);

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
  const orgs = new Organisations();

  const contacts: PageTabSection[] = sections.filter((section) => isContact(section.type!));
  const authors: PageTabSection[] = contacts.map(
    (contact) =>
      ({
        type: 'Author',
        attributes: orgs.orgToReferences(contact).filter((ref) => !isAttributeEmpty(ref))
      } as PageTabSection)
  );

  const affiliations: PageTabSection[] = orgs.list().map(
    (org) =>
      ({
        type: 'Organization',
        accno: org.accno,
        attributes: [{ name: 'Name', value: org.name } as PtAttribute]
      } as PageTabSection)
  );

  return sections
    .filter((s) => !isContact(s.type!))
    .concat(authors)
    .concat(affiliations);
}
