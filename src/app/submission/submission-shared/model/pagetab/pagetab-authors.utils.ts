import { PtAttribute, PageTabSection } from './pagetab.model';
import { isStringDefined } from 'app/utils/validation.utils';
import { Organisations } from '../organisations';
import { Dictionary, Nullable } from '../submission-common-types';

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
  const orgs: Organisations = Organisations.getInstance();

  const affiliations: Dictionary<PtAttribute[]> = sections
    .filter((s) => isStringDefined(s.accno) && isAffiliation(s.type))
    .reduce((result, section) => {
      if (section.attributes) {
        result[section.accno!] = section.attributes;
      }

      return result;
    }, {} as Dictionary<PtAttribute[]>);

  const contacts = sections
    .filter((section) => section.type && isAuthor(section.type))
    .map((author) => ({ type: 'Contact', attributes: orgs.referencesToOrg(author, affiliations) } as PageTabSection));

  return sections
    .filter((section) => section.type && !isAuthor(section.type) && !isAffiliation(section.type))
    .concat(contacts);
}
