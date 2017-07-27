function mergeSubsIntoContacts(subsections: any[]): any[] {
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
        newObj.subsections = mergeSubsIntoContacts(obj.subsections);
        return newObj;
    }
    return obj;
}

export function convertContactsToAuthors(obj: any): any {
    //todo
}
