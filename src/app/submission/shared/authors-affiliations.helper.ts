function authorsToContacts(subsections: any[]): any[] {
    const isAffiliation = (s) => {
        return s !== undefined && ['organization', 'organisation', 'affiliation'].indexOf(s.toLowerCase()) > -1;
    };
    const isAuthor = (s) => {
        return s !== undefined && s.toLowerCase() === 'author';
    };

    const sections = (subsections || []);
    const authors = sections.filter(s => isAuthor(s.type));
    const affiliations = sections
        .filter(s => isAffiliation(s.type) && s.accno !== undefined)
        .reduce((rv, af) => {
            rv[af.accno] = ((af.attributes || [])
                .filter(at => at.name !== undefined)
                .find(at => at.name.toLowerCase() === 'name') || {value: ''})
                .value;

            return rv;
        }, {});

    const contacts =
        authors.map(a => {
            const c = Object.assign({}, a);
            c.type = 'Contact';
            c.attributes = (a.attributes || [])
                .map(attr => {
                    if (isAffiliation(attr.name)) {
                        return {
                            name: 'Organisation',
                            value: attr.isReference ?
                                (affiliations[attr.value] || attr.value) :
                                attr.value
                        }
                    }
                    return attr;
                });
            return c;
        });
    return sections
        .filter(s => !isAuthor(s.type) && !isAffiliation(s.type))
        .map(s => convertAuthorsToContacts(s))
        .concat(contacts);
}

function contactsToAuthors(subsections: any[] = []): any[] {
    const isContact = (s) => {
        return s !== undefined && s.toLowerCase() === 'contact';
    };

    const sections = (subsections || []);
    const orgRefs = {}, orgNames = {};

    const authors = sections
        .filter(s => isContact(s.type))
        .map(c => {
            const author: any = {type: 'Author'};
            const attributes = c.attributes
                .filter(a => a.value.trim().length > 0)
                .map(a => {
                    if (a.name.toLowerCase() === 'organisation') {
                        const v = a.value.trim().toLowerCase();
                        const orgRef = orgRefs[v] || `o${Object.keys(orgRefs).length + 1}`;
                        orgRefs[v] = orgRef;
                        orgNames[v] = orgNames[v] || a.value.trim();
                        return {
                            name: 'Affiliation',
                            isReference: true,
                            value: orgRef
                        }
                    }
                    return a;
                });

            if (attributes.length > 0) {
                author.attributes = attributes;
            }
            return author;
        });

    const affiliations = Object.keys(orgRefs).map(k => (
        {
            type: 'Organization',
            accno: orgRefs[k],
            attributes: [{
                name: 'Name',
                value: orgNames[k]
            }]
        }
    ));

    return sections
        .filter(s => !isContact(s.type))
        .concat(authors)
        .concat(affiliations);
}

export function convertAuthorsToContacts(obj: any): any {
    if (obj === undefined) {
        return obj;
    }

    if (obj.section !== undefined) {
        const newObj = Object.assign({}, obj);
        newObj.section = convertAuthorsToContacts(obj.section);
        return newObj;
    }

    if (obj.subsections !== undefined) {
        const newObj = Object.assign({}, obj);
        newObj.subsections = authorsToContacts(obj.subsections);
        return newObj;
    }
    return obj;
}

export function convertContactsToAuthors(obj: any): any {
    if (obj === undefined) {
        return obj;
    }

    if (obj.section !== undefined) {
        const newObj = Object.assign({}, obj);
        newObj.section = convertContactsToAuthors(obj.section);
        return newObj;
    }


    if (obj.subsections !== undefined) {
        const newObj = Object.assign({}, obj);
        newObj.subsections = contactsToAuthors(obj.subsections);
        return newObj;
    }
    return obj;
}
