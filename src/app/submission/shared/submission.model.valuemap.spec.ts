import {ValueMap} from './submission.model';

describe('Submission Model: ValueMap', () => {
    it("can be empty", () => {
        const vm = new ValueMap();
        expect(vm.keys().length).toBe(0);
    });

    it("can be created with a list of keys", () => {
        const keys = ["k1", "k2", "k3"];
        const vm = new ValueMap(keys);
        expect(vm.keys().sort()).toEqual(keys.sort());
        expect(vm.values().map(v=>v.value)).toEqual(['', '', '']);
    });

    it("allows to add a key (& a value)", () => {
        const vm = new ValueMap();
        vm.add("k1", "v1");
        vm.add("k2");
        expect(vm.keys().sort()).toEqual(["k1", "k2"].sort());
        expect(vm.values().map(v=>v.value)).toEqual(['v1', '']);
    });

    it("does not allow to add same keys", () => {
        const vm = new ValueMap(["k1", "k1"]);
        expect(vm.keys()).toEqual(["k1"]);
        expect(vm.values().map(v=>v.value)).toEqual(['']);
    });

    it("allows to remove a key (& a value)", () => {
        const keys = ["k1", "k2", "k3"];
        const vm = new ValueMap(keys);
        vm.remove("k1");
        expect(vm.keys().sort()).toEqual(keys.slice(1).sort());
        expect(vm.values().map(v=>v.value)).toEqual(['', '']);
    });
});