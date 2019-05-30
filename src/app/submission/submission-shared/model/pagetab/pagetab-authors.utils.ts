import { PtAttribute, PtSection } from './pagetab.model';

const isEqualTo = (value: string) => {
    return (s: Nullable<string>) => (String.isDefined(s) && s!.toLowerCase() === value);
};

export function getOrganizationFromSubsection(section, orgName) {
    const subsections = section.subsections || [];

    return subsections.sections.find((sectionItem) => (
        sectionItem.typeName === 'Organization' &&
        sectionItem.data.attributes.some((attribute) => attribute.value === orgName )
    )) || {};
}

export function authors2Contacts(sections: PtSection[] = []): PtSection[] {
    const isAffiliation = (s: Nullable<string>) => {
        return String.isDefined(s) && ['organization', 'organisation', 'affiliation'].includes(s!.toLowerCase());
    };

    const isAuthor = isEqualTo('author');

    const isName = isEqualTo('name');

    const affiliations: Dictionary<string> =
        sections
            .filter(s => String.isDefined(s.accno) && isAffiliation(s.type))
            .reduce((rv, sec) => {
                rv[sec.accno!] =
                    ((sec.attributes || []).find(at => isName(at.name)) || {value: ''}).value;
                return rv;
            }, <Dictionary<string>>{});

    const contacts = sections
        .filter(s => isAuthor(s.type))
        .map(a =>
            <PtSection>{
                type: 'Contact',
                attributes: (a.attributes || [])
                    .map(attr => {
                        if (isAffiliation(attr.name)) {
                            const value = attr.isReference &&
                            String.isDefinedAndNotEmpty(attr.value) ?
                                (affiliations[attr.value!] || attr.value) : attr.value;
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
    private refs: Dictionary<string> = {};
    private names: Dictionary<string> = {};

    private refFor(value: string, accno: string): string {
        const key = value.trim().toLowerCase();
        this.refs[key] = accno ? accno : `o${Object.keys(this.refs).length + 1}`;
        this.names[key] = this.names[key] || value;
        return this.refs[key]!;
    }

    toReference(attr: PtAttribute): PtAttribute {
        if (String.isNotDefinedOrEmpty(attr.value)) {
            return <PtAttribute>{name: 'affiliation', value: attr.value};
        }

        const orgRef = this.refFor(attr.value!, attr.accno!);
        return <PtAttribute>{name: 'affiliation', value: orgRef, isReference: true};
    }

    list(): { accno: string, name: string }[] {
        return Object.keys(this.refs).map(key => ({accno: this.refs[key]!, name: this.names[key]!}));
    }
}

export function contacts2Authors(sections: PtSection[] = []): PtSection[] {
    const isContact = isEqualTo('contact');
    const isOrganisation = isEqualTo('organisation');
    const orgs = new Organisations();

    const authors: PtSection[] = sections
        .filter(s => isContact(s.type))
        .map(contact => <PtSection>{
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

    const affiliations: PtSection[] = orgs.list().map(org =>
        <PtSection>{
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
