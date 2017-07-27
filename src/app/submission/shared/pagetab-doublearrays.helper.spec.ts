import {flattenDoubleArrays} from "./pagetab-doublearrays.helper";
describe('PageTab flattenDoubleArrays:', () => {

    it("flattens double arrays", () => {
        const pt = {
            type: "Study",
            files: [[
                {
                    path: "file1"
                },
                {
                    path: "file2"
                }
            ]],
            links: [[
                {
                    url: "url1"
                },
                {
                    url: "url2"
                }
            ]],
            subsections: [[
                {
                    type: "Feature1",
                    subsections: [[
                        {
                            type: "Feature5"
                        },
                        {
                            type: "Feature6"
                        }
                    ]]
                },
                {
                    type: "Feature1"
                }
            ], [
                {
                    type: "Feature2"
                },
                {
                    type: "Feature2"
                }
            ]]
        };

        const res = flattenDoubleArrays(pt);
        expect(res.files.length).toBe(2);
        expect(res.links.length).toBe(2);
        expect(res.subsections.length).toBe(4);

        const sec = res.subsections.find(s => s.type === 'Feature1');
        expect(sec.subsections.length).toBe(2);
    });
});
