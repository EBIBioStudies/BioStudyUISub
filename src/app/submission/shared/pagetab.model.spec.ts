import {pageTabSample1} from './pagetab.samples';
import {PageTab} from './pagetab.model';

describe('PageTab', () => {
    it("doesn't create the root section if the original object is undefined", () => {
        const pt = new PageTab();
        expect(pt.section).not.toBeDefined();
    });

    it("sets undefined section type to 'Undefined' value", () => {
        const pt = new PageTab({});
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toEqual('Undefined');
    });

    it("doesn't change the original object", () => {
       //TODO
    });

    it("extracts sections and features from the original PageTab", () => {
        const pt = new PageTab({
            type: "Study",
            subsections: [
                {
                    type: "Feature1"
                },
                {
                    type: "Feature1"
                }
            ]
        });
        expect(pt.section).toBeDefined();
        expect(pt.section.type).toEqual('Study');
        expect(pt.section.features.length).toEqual(1);

        const feature = pt.section.features[0];
        expect(feature.type).toEqual('Feature1');
    });

});