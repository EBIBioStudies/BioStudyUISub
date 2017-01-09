import * as _ from 'lodash';

const SECTION = {type: 'Study'};
const SUBMISSION = {type: 'Submission', accno: ''};

export interface PTEntity {
    jsObj();
}

export class PTAttributes implements PTEntity {
    private attrs: any[];

    constructor(array?: any[]) {
        this.attrs = _.map(array || [], a => ({name: a.name || '', value: a.value || ''}));
    }

    jsObj(): any[] {
        return _.map(this.attrs, a => ({name: a.name, value: a.value}));
    }

    get length(): number {
        return this.attrs.length;
    }
}

export class PTLink implements PTEntity {
    url: string;
    attrs: PTAttributes;

    constructor(obj: any = {}) {
        this.url = obj.url || '';
        this.attrs = new PTAttributes(obj.attributes);
    }

    jsObj(): any {
        return {
            url: this.url,
            attributes: this.attrs.jsObj()
        }
    }

    static from(url: string, attributes: any[]): PTLink {
        let ln = new PTLink();
        ln.url = url;
        ln.attrs = new PTAttributes(attributes);
        return ln;
    }
}

export class PTFile implements PTEntity {
    path: string;
    attrs: PTAttributes;

    constructor(obj: any = {}) {
        this.path = obj.path || '';
        this.attrs = new PTAttributes(obj.attributes);
    }

    jsObj(): any {
        return {
            path: this.path,
            attributes: this.attrs.jsObj()
        }
    }

    static from(path: string, attributes: any[]): PTFile {
        let f = new PTFile();
        f.path = path;
        f.attrs = new PTAttributes(attributes);
        return f;
    }
}

export class PTPubl implements PTEntity {
    pubMedId: string;
    attrs: PTAttributes;

    constructor(obj: any = {}) {
        let attrs = obj.attributes || [];
        let isPubMedAttr = a => (a.name.toLowerCase() === 'pubmedid');
        this.pubMedId = (_.find(attrs, isPubMedAttr) || {value: ''}).value;
        this.attrs = new PTAttributes(_.reject(attrs, isPubMedAttr));

        if (obj.acc) {
            this.pubMedId = obj.acc;
        }
    }

    jsObj(): any {
        return {
            type: 'Publication',
            acc: this.pubMedId,
            attributes: [].concat(
                [{name: 'PubMedId', value: this.pubMedId}],
                this.attrs.jsObj()
            )
        }
    }

    static from(pubMedId: string, attributes: any[]): PTPubl {
        let f = new PTPubl();
        f.pubMedId = pubMedId;
        f.attrs = new PTAttributes(attributes);
        return f;
    }
}

export class PTContact implements PTEntity {
    org: string;
    attrs: PTAttributes;

    constructor(obj: any = {}) {
        let attrs = obj.attributes || [];
        let isOrgAttr = a => (a.name.toLowerCase() === 'affiliation');
        this.org = (_.find(attrs, isOrgAttr) || {value: ''}).value;
        this.attrs = new PTAttributes(_.reject(attrs, isOrgAttr));
    }

    jsObj(): any {
        return {
            type: 'Author',
            attributes: [].concat(
                [{name: 'affiliation', value: this.org}],
                this.attrs.jsObj()
            )
        }
    }

    static from(org: string, attributes: any[]): PTContact {
        let c = new PTContact();
        c.org = org;
        c.attrs = new PTAttributes(attributes);
        return c;
    }
}

export class PageTabProxy {
    private __origin: any;

    constructor(origin: any = SUBMISSION) {
        this.__origin = _.cloneDeep(origin);
    }

    get data(): any {
        return _.cloneDeep(this.__origin);
    }

    get type(): string {
        return this.path('type', '');
    }

    get accno(): string {
        return this.path('accno', '');
    }

    set accno(accno: string) {
        this.requirePath('accno', accno);
    }

    get title(): string {
        return this.attrValue('attributes', 'Title');
    }

    set title(title: string) {
        this.requirePath('attributes', []);
        this.requireAttr('attributes', {name: 'Title', value: title});
    }

    get description(): string {
        return this.attrValue('section.attributes', 'Description');
    }

    set description(descr: string) {
        this.requirePath('section', SECTION);
        this.requirePath('section.attributes', []);
        this.requireAttr('section.attributes', {name: 'Description', value: descr});
    }

    get releaseDate(): string { // yyyy-mm-dd
        return this.attrValue('attributes', 'ReleaseDate');
    }

    set releaseDate(date: string) {
        this.requirePath('attributes', []);
        this.requireAttr('attributes', {name: 'ReleaseDate', value: date});
    }

    get annotations(): PTAttributes { // filter out description attribute
        return new PTAttributes(_.reject(this.path('section.attributes', []), {name: 'Description'}));
    }

    set annotations(annotations: PTAttributes) {
        this.requirePath('section', SECTION);
        this.requirePath('section.attributes', []);
        let descr = _.filter(this.path('section.attributes'), {name: 'Description'});
        this.updatePath('section.attributes', [].concat(descr, annotations.jsObj()));
    }

    get links(): PTLink[] {
        return _.map(this.path('section.links', []), (ln: any) => new PTLink(ln));
    }

    set links(links: PTLink[]) {
        this.requirePath('section', SECTION);
        this.updatePath('section.links', _.map(links, (ln: PTLink) => ln.jsObj()));
    }

    get files(): PTFile[] {
        return _.map(this.path('section.files', []), (f: any) => new PTFile(f));
    }

    set files(files: PTFile[]) {
        this.requirePath('section', SECTION);
        this.updatePath('section.files', _.map(files, (f: PTFile) => f.jsObj()));
    }

    get publications(): PTPubl[] {
        let pubs = _.filter(this.path('section.subsections', []), {type: 'Publication'});
        return _.map(pubs, (p: any) => new PTPubl(p));
    }

    set publications(publications: PTPubl[]) {
        this.requirePath('section', SECTION);
        this.requirePath('section.subsections', []);
        let other = _.reject(this.path('section.subsections'), {type: 'Publication'});
        this.updatePath('section.subsections',
            [].concat(other, _.map(publications, p => p.jsObj())));
    }

    get contacts(): PTContact[] {
        return _.map(_.filter(this.path('section.subsections', []), {type: 'Author'}),
            (c) => {
                return new PTContact({
                    attributes: this.resolveReferences(c.attributes)
                });
            });
    }

    set contacts(contacts: PTContact[]) {
        this.requirePath('section', SECTION);
        this.requirePath('section.subsections', []);
        let other = _.reject(this.path('section.subsections'), (s) => (s.type === 'Author' || s.type === 'Organization'));

        let cs = [], refs = [], tmp = {}, idx = 0;
        _.forEach(contacts, (contact: PTContact) => {
            let org = contact.org;
            if (!tmp[org]) {
                tmp[org] = 'ref' + (++idx);
                refs.push({type: 'Organization', accno: tmp[org], attributes: [{name: 'Name', value: org}]});
            }

            let c = contact.jsObj();
            _.forEach(c.attributes, (attr) => {
                if (attr.name === 'affiliation') {
                    attr.value = tmp[attr.value];
                    attr.isReference = true;
                }
            });
            cs.push(c);
        });
        this.updatePath('section.subsections', [].concat(other, cs, refs));
    }

    private resolveReferences(attributes): void {
        return _.map(attributes, (a) => {
            return (a.isReference) ? this.findRef(a) : a;
        });
    }

    private findRef(attr): any {
        let ref = attr.value;
        let found = _.find(this.path('section.subsections', []), {accno: ref});
        return {name: attr.name, value: found ? found.attributes[0].value : ''};
    }

    private requirePath(path: string, value: any, forceUpdate?: boolean = false): any {
        let parts = path.split('.');
        let lastPart = parts.pop();
        let obj = this.path(parts.join('.'), null);
        if (!obj) {
            throw Error(`path ${path} doesn't exist`);
        }
        if (!obj.hasOwnProperty(lastPart) || forceUpdate) {
            obj[lastPart] = value;
        }
    }

    private updatePath(path: string, value: any) {
        this.requirePath(path, value, true);
    }

    private requireAttr(path: string, attr: any) {
        let obj = this.path(path);
        if (!_.isArray(obj)) {
            console.error('Can not add/remove/update attribute to none array type');
            return;
        }

        let found = _.find(obj, {name: attr.name});
        if (!found) {
            found = {name: attr.name, value: ''};
            obj.push(found);
        }
        found.value = attr.value;
    }

    private path(path: string, deflt?: any): any {
        return this.__path(this.__origin, path, deflt);
    }

    private __path(obj: any, path: string, deflt?: any): any {
        if (!obj) {
            return deflt;
        }
        if (!path) {
            return obj;
        }
        let parts = path.split(/\.(.+)?/);
        return this.__path(obj[parts[0]], parts[1], deflt);
    }

    private attrValue(path: string, attrName: string): string {
        let attributes = this.path(path, []);
        let attr = _.find(attributes, {name: attrName}) || {};
        return attr.value || '';
    }

    static create(obj?: any): PageTabProxy {
        return new PageTabProxy(obj);
    }
}
