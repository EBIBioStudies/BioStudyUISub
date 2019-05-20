import { mergeAttributes, updateAttachToAttribute } from './pagetab-attributes.utils';
import { PageTab } from './pagetab.model';

describe('Submission Attributes:', () => {
    it('creates empty list of attributes and adds AttachTo attributes to it', () => {
        const projects = ['proj1', 'proj2'];
        let obj: PageTab = {};
        obj = updateAttachToAttribute(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual(projects.map(p => {
            return {name: 'AttachTo', value: p};
        }));
    });

    it('adds AttachTo attributes to the existing list of attributes', () => {
        const projects = ['proj1', 'proj2'];
        const attr = {name: 'otherAttr', value: 'otherValue'};
        let obj: any = {attributes: [attr]};
        obj = updateAttachToAttribute(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual([...[attr], ...projects.map(p => {
            return {name: 'AttachTo', value: p};
        })]);
    });

    it('replaces Title attribute and adds AttachTo attribute', () => {
        const attrs1 = [{name: 'Title', value: 'a title 1'}, {name: 'AttachTo', value: 'prj1'}];
        const attrs2 = [{name: 'Title', value: 'a title 2'}, {name: 'AttachTo', value: 'prj2'}];

        const res = mergeAttributes(attrs1, attrs2);

        expect(res).toBeDefined();
        expect(res.length).toEqual(3);
        expect(res).toContain({name: 'Title', value: 'a title 2'});
        expect(res).toContain({name: 'AttachTo', value: 'prj1'});
        expect(res).toContain({name: 'AttachTo', value: 'prj2'});
    });
});
