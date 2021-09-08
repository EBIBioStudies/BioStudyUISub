import { isStringDefined, isStringEmpty } from 'app/utils/validation.utils';
import { AttributeNames, SectionNames } from './../../utils/constants';
import { Dictionary, Nullable } from './submission-common-types';
import { PageTabSection, PtAttribute } from './pagetab/pagetab.model';

const isEqualTo = (value: string) => {
  return (s: Nullable<string>) => isStringDefined(s) && s!.toLowerCase() === value;
};

export class Organisations {
  private static instance: Organisations;
  private names: Dictionary<string> = {};
  private refs: Dictionary<string> = {};

  private constructor() {}

  static getInstance(): Organisations {
    if (!Organisations.instance) {
      Organisations.instance = new Organisations();
    }

    return Organisations.instance;
  }

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
    const isOrganisation = isEqualTo(SectionNames.ORGANISATION);
    const orgAttribute = attributes.find((attribute) => isOrganisation(attribute.name));

    if (orgAttribute === undefined) {
      return attributes;
    }

    const attributesWithoutOrg = attributes.filter((attribute) => !isOrganisation(attribute.name));
    const orgAttributeValue = Array.isArray(orgAttribute.value) ? orgAttribute.value : [orgAttribute.value];

    const references = orgAttributeValue.map((value) => {
      const organization = this.getOrganizationFromSubsection(contact, value);

      return this.toReference(value, organization.accno);
    });

    return [...attributesWithoutOrg, ...references];
  }

  referencesToOrg(author: PageTabSection, affiliations: Dictionary<string>): PtAttribute[] {
    const attributes: PtAttribute[] = author.attributes || [];
    const isAffiliation = isEqualTo(SectionNames.AFFILIATION);
    const affiliationAttributes = attributes.filter((attribute) => isAffiliation(attribute.name));
    const otherAttributes = attributes.filter((attribute) => !isAffiliation(attribute.name));

    const referenceValues = affiliationAttributes.map((attribute) => {
      const isReference: boolean = Boolean(attribute.reference || attribute.reference);
      const attributeValue = attribute.value as string;

      return isReference ? affiliations[attributeValue] || attributeValue : attributeValue;
    });

    if (referenceValues.length > 0) {
      return [...otherAttributes, { name: AttributeNames.ORGANISATION, value: referenceValues, reference: false }];
    }

    return otherAttributes;
  }

  private getOrganizationFromSubsection(section, orgName): any {
    const { sections = [] } = section.subsections || {};

    return (
      sections.find(
        (sectionItem) =>
          sectionItem.typeName.toLowerCase() === SectionNames.ORGANISATION &&
          sectionItem.data.attributes.some((attribute) => attribute.value === orgName)
      ) || {}
    );
  }

  private toReference(orgValue: string | undefined, accno: string): PtAttribute {
    if (orgValue === undefined || isStringEmpty(orgValue)) {
      return { name: SectionNames.AFFILIATION, value: orgValue, reference: false } as PtAttribute;
    }

    const orgRef = this.refFor(orgValue, accno!);
    return { name: SectionNames.AFFILIATION, value: orgRef, reference: true } as PtAttribute;
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

  private refFor(value: string = '', accno: string): string {
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