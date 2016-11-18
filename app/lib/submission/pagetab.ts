import * as _ from 'lodash';

export class PageTab {
    private __origin: any;

    constructor(origin?: any = {type: 'Submission'}) {
        this.__origin = _.cloneDeep(origin);
    }

    get accno(): string {
        return this.__origin.accno || '';
    }

    set accno(accno: string) {
        this.__origin.accno = accno;
    }

    get title(): string {
        return this.findAttrValue(this.path('attributes', []), 'Title');
    }

    set title(title: string) {
        this.require('attributes', []);
        this.requireAttr(this.path('attributes'), {name: 'Title', value: title});
    }

    get description(): string {
        return this.findAttrValue(this.path('section.attributes', []), 'Description');
    }

    set description(descr: string) {
        this.require('section', {});
        this.require('section.attributes', []);
        this.requireAttr(this.path('section.attributes'), {name: 'Description', value: descr});
    }

    get releaseDate(): string { // yyyy-mm-dd
        return this.findAttrValue(this.path('attributes', []), 'ReleaseDate');
    }

    set releaseDate(date: string) {
        this.require('attributes', []);
        this.requireAttr(this.path('attributes'), {name: 'ReleaseDate', value: date});
    }

    get annotations() {
        return _.reject(this.path('section.attributes', []), {name: 'Description'});
    }

    get links() {
        return this.path('section.links') || [];
    }

    get files() {
        return this.path('section.files') || [];
    }

    get publications() {
        return _.filter(this.path('section.subsections', []), {type: 'Publication'});
    }

    get contacts() {
        return _.map(_.filter(this.path('section.subsections', []), {type: 'Author'}),
            (c) => {
                c.attributes = this.resolveReferences(c.attributes);
                return c;
            });
    }

    private resolveReferences(attributes) {
        return _.map(attributes, (a) => {
            return (a.isReference) ? this.findRef(a) : a;
        });
    }

    private findRef(attr) {
        let ref = attr.value;
        let found = _.find(this.path('section.subsections', []), {accno: ref});
        return {name: attr.name, value: found ? found.attributes[0].value : ''};
    }

    private require(path: string, deflt: any): any {
        let obj = this.__origin;
        let parts = path.split('.');
        for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }
        let lastPart = parts[parts.length - 1];
        if (!obj.hasOwnProperty(lastPart)) {
            obj[lastPart] = deflt;
        }
    }

    private requireAttr(obj, attr) {
        if (!_.isArray(obj)) {
            console.error('Can not set attribute to none array');
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

    private __path(obj: any, path: string, deflt?: any) {
        if (!obj) {
            return deflt;
        }
        if (!path) {
            return obj;
        }
        let parts = path.split('.', 1);
        return this.__path(obj[parts[0]], parts[1], deflt);
    }

    private findAttrValue(attributes: any[], attrName: string): string {
        let attr = _.find(attributes, {name: attrName}) || {};
        return attr.value || '';
    }

    static create(obj?:any): PageTab {
        return new PageTab(obj);
    }
}
