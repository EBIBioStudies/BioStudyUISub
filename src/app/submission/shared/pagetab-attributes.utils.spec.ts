import {attachTo} from './pagetab-attributes.utils';

describe('Submission Attributes:', () => {

    it('does not attach projects to an undefined object', () => {
        const newObj = attachTo(undefined, []);
        expect(newObj).toBeUndefined();
    });

    it('creates empty list of attributes and adds AttachTo attributes to it', () => {
        const projects = ['proj1', 'proj2'];
        let obj: any = {};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual(projects.map(p => {
            return {name: 'AttachTo', value: p}
        }));
    });

    it('adds AttachTo attributes to the existing list of attributes', () => {
        const projects = ['proj1', 'proj2'];
        const attr = {name: 'otherAttr', value: 'otherValue'};
        let obj: any = {attributes: [attr]};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual([...[attr], ...projects.map(p => {
            return {name: 'AttachTo', value: p}
        })]);
    });

    it('replaces AttachTo attributes in the attribute list', () => {
        const projects = ['proj1', 'proj2'];
        const attr = {name: 'otherAttr', value: 'otherValue'};
        let obj: any = {attributes: [attr]};
        obj = attachTo(obj, projects);

        expect(obj.attributes).toBeDefined();
        expect(obj.attributes).toEqual([...[attr], ...projects.map(p => {
            return {name: 'AttachTo', value: p}
        })]);
    });
});
