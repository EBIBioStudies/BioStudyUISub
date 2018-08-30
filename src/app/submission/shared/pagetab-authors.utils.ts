import {PtAttribute, PtSection} from './pagetab.model';

export function authors2Contacts(sections: PtSection[] = []): PtSection[] {
    const isAffiliation = (s: string) => {
        return s !== undefined && ['organization', 'organisation', 'affiliation'].indexOf(s.toLowerCase()) > -1;
    };

    const isAuthor = (s: string) => {
        return s !== undefined && s.toLowerCase() === 'author';
    };

    const affiliations: { [key: string]: string } =
        sections.filter(s => isAffiliation(s.type) && s.accno !== undefined)
            .reduce((rv, affil) => {
                rv[affil.accno!] =
                    ((affil.attributes || []).find(at => at.name.toLowerCase() === 'name') || {value: ''}).value;
                return rv;
            }, {});

    const contacts = sections.filter(s => isAuthor(s.type))
        .map(a => {
            const contact = new PtSection('Contact');
            contact.attributes = (a.attributes || [])
                .map(attr => {
                    if (isAffiliation(attr.name)) {
                        const affil = attr.isReference ? (affiliations[attr.value] || attr.value) : attr.value;
                        return new PtAttribute('Organisation', affil);
                    }
                    return attr;
                });
            return contact;
        });
    return sections
        .filter(s => !isAuthor(s.type) && !isAffiliation(s.type))
        .concat(contacts);
}

class Organisations {
    private refs: { [key: string]: string } = {};
    private names: { [key: string]: string } = {};

    private refFor(value: string): string {
        const key = value.trim().toLowerCase();
        this.refs[key] = this.refs[key] || `o${Object.keys(this.refs).length + 1}`;
        this.names[key] = value;
        return this.refs[key];
    }

    toReference(attr: PtAttribute): PtAttribute {
        const orgRef = this.refFor(attr.value);
        return new PtAttribute('Affiliation', orgRef, true);
    }

    list(): { accno: string, name: string }[] {
        return Object.keys(this.refs).map(key => ({accno: this.refs[key], name: this.names[key]}));
    }
}

export function contacts2Authors(sections: PtSection[] = []): PtSection[] {
    const isContact = (s: string) => {
        return s !== undefined && s.toLowerCase() === 'contact';
    };

    const isOrganisation = (s: string) => {
        return s !== undefined && s.toLowerCase() === 'organisation';
    };

    const orgs = new Organisations();

    const authors: PtSection[] = sections
        .filter(s => isContact(s.type))
        .map(contact => {
            const author = new PtSection('Author');
            author.attributes = (contact.attributes || [])
                .map(attr => {
                    if (isOrganisation(attr.name)) {
                        return orgs.toReference(attr);
                    }
                    return attr;
                });
            return author;
        });

    const affiliations: PtSection[] = orgs.list().map(org => {
            const affil = new PtSection('Organization');
            affil.accno = org.accno;
            affil.attributes = [new PtAttribute('Name', org.name)];
            return affil;
        }
    );

    return sections
        .filter(s => !isContact(s.type))
        .concat(authors)
        .concat(affiliations);
}