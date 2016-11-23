import * as _ from 'lodash';

const SECTION = {type: "Study"};
const SUBMISSION = {type: 'Submission'};

export class PageTabProxy {
    private __origin: any;

    constructor(origin?: any = SUBMISSION) {
        this.__origin = _.cloneDeep(origin);
        console.log("origin", origin);
    }

    get data():any {
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

    get annotations(): any[] { // filter out description attribute
        return _.reject(this.path('section.attributes', []), {name: 'Description'});
    }

    set annotations(annotations:any[]) {
        this.requirePath('section', SECTION);
        this.requirePath('section.attributes', []);
        let descr = _.filter(this.path('section.attributes'), {name: 'Description'});
        this.updatePath('section.attributes', [].concat(descr, annotations));
    }

    get links(): any[] {
        return this.path('section.links', []);
    }

    set links(links:any[]) {
        this.requirePath('section', SECTION);
        this.updatePath('section.links', links);
    }

    get files(): any[] {
        return this.path('section.files', []);
    }

    set files(files:any[]) {
        this.requirePath('section', SECTION);
        this.updatePath('section.files', files);
    }

    get publications(): any[] {
        return _.filter(this.path('section.subsections', []), {type: 'Publication'});
    }

    set publications(publications:any[]) {
        this.requirePath('section', SECTION);
        this.requirePath('section.subsections', []);
        let other = _.reject(this.path('section.subsections'), {type: 'Publication'});
        this.updatePath('section.subsections', [].concat(other, publications));
    }

    get contacts(): any[] {
        return _.map(_.filter(this.path('section.subsections', []), {type: 'Author'}),
            (c) => {
                c.attributes = this.resolveReferences(c.attributes);
                return c;
            });
    }

    set contacts(contacts:any[]) {
        this.requirePath('section', SECTION);
        this.requirePath('section.subsections', []);
        let other = _.reject(this.path('section.subsections'), (a) => (a.type === 'Author' || a.type === 'Organization'));

        let cs = [], refs = [], tmp = {}, idx = 0;
        _.forEach(contacts, (contact) => {
            let attributes = [];
            _.forEach(contact.attributes, (attr) => {
                let copy = _.assign({}, attr);
                if (copy.name === 'Organisation') {
                    copy.name = 'affiliation';
                    let org = copy.value;
                    if (!tmp[org]) {
                        tmp[org] = 'ref' + (++idx);
                        refs.push({type: 'Organization', accno: tmp[org], attributes: [{name: 'Name', value: org}]});
                    }
                    copy.value = tmp[org];
                    copy.isReference = true;
                }
                attributes.push(copy);
            });
            cs.push({type: 'Author', attributes: attributes});
        });
        this.updatePath('section.subsections', [].concat(other, cs, refs));
    }

    private resolveReferences(attributes): void {
        return _.map(attributes, (a) => {
            return (a.isReference) ? this.findRef(a) : a;
        });
    }

    private findRef(attr):any {
        let ref = attr.value;
        let found = _.find(this.path('section.subsections', []), {accno: ref});
        return {name: attr.name, value: found ? found.attributes[0].value : ''};
    }

    private requirePath(path: string, value: any, forceUpdate?:boolean=false): any {
        let parts = path.split('.');
        let lastPart = parts.pop();
        let obj = this.path(parts.join('.'), null);
        if (!obj) {
            throw Error(`path ${path} doesn't exist`);
        }
        if (!obj.hasOwnProperty(lastPart) || forceUpdate){
            obj[lastPart]= value;
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
