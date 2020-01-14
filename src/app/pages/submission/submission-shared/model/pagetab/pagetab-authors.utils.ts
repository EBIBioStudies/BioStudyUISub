import { PtAttribute, PageTabSection } from './pagetab.model';

const isEqualTo = (value: string) => {
    return (s: Nullable<string>) => (String.isDefined(s) && s!.toLowerCase() === value);
};
export function getOrganizationFromSubsection(section, orgName) {
    const { sections = [] } = section.subsections || {};

    return sections.find((sectionItem) => (
        sectionItem.typeName === 'Organization' &&
        sectionItem.data.attributes.some((attribute) => attribute.value === orgName )
    )) || {};
}

export function authors2Contacts(sections: PageTabSection[] = []): PageTabSection[] {
    const isAffiliation = (s: Nullable<string>) => {
        return String.isDefined(s) && ['organization', 'organisation', 'affiliation'].includes(s!.toLowerCase());
    };
    const isAuthor = isEqualTo('author');
    const isName = isEqualTo('name');

    const affiliations: Dictionary<string> =
        sections
            .filter(s => String.isDefined(s.accno) && isAffiliation(s.type))
            .reduce((result, section) => {
                const nameAttribute: PtAttribute = section.attributes!.find((attribute) => isName(attribute.name)) || { value: '' };

                result[section.accno!] = nameAttribute.value;

                return result;
            }, <Dictionary<string>>{});

    const contacts = sections
        .filter(s => isAuthor(s.type))
        .map(a =>
            <PageTabSection>{
                type: 'Contact',
                attributes: (a.attributes || [])
                    .map(attr => {
                        if (isAffiliation(attr.name)) {
                            const value = (attr.reference || attr.isReference) && String.isDefinedAndNotEmpty(attr.value)
                                ? (affiliations[attr.value!] || attr.value)
                                : attr.value;

                            return <PtAttribute>{name: 'Organisation', value: value};
                        }

                        return attr;
                    })
            });
    return sections
        .filter(s => !isAuthor(s.type) && !isAffiliation(s.type))
        .concat(contacts);
}

class Organisations {
    private names: Dictionary<string> = {};
    private refs: Dictionary<string> = {};

    list(): { accno: string, name: string }[] {
        return Object.keys(this.refs).map(key => ({
            accno: this.refs[key]!,
            name: this.names[key]!
        }));
    }

    toReference(attr: PtAttribute): PtAttribute {
        if (String.isNotDefinedOrEmpty(attr.value)) {
            return <PtAttribute>{ name: 'affiliation', value: attr.value };
        }

        const orgRef = this.refFor(attr.value!, attr.accno!);
        return <PtAttribute>{ name: 'affiliation', value: orgRef, reference: true };
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

export function contacts2Authors(sections: PageTabSection[] = []): PageTabSection[] {
    const isContact = isEqualTo('contact');
    const isOrganisation = isEqualTo('organisation');
    const orgs = new Organisations();

    const authors: PageTabSection[] = sections
        .filter(s => isContact(s.type))
        .map(contact => <PageTabSection>{
            type: 'Author',
            attributes: (contact.attributes || [])
                .map(attr => {
                    if (isOrganisation(attr.name)) {
                        const organization = getOrganizationFromSubsection(contact, attr.value);

                        return orgs.toReference({ ...attr, accno: organization.accno });
                    }
                    return attr;
                })
        });

    const affiliations: PageTabSection[] = orgs.list().map(org =>
        <PageTabSection>{
            type: 'Organization',
            accno: org.accno,
            attributes: [<PtAttribute>{name: 'Name', value: org.name}]
        }
    );

    return sections
        .filter(s => !isContact(s.type))
        .concat(authors)
        .concat(affiliations);
}
