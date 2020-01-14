import { ValueMap } from './submission.model.valuemap';

describe('Submission Model: ValueMap', () => {
    it('can be empty', () => {
        const vm = new ValueMap();
        expect(vm.keys().length).toBe(0);
    });

    it('can be created with a list of keys', () => {
        const keys = ['k1', 'k2', 'k3'];
        const vm = new ValueMap(keys);
        expect(vm.keys().sort()).toEqual(keys.sort());
        expect(vm.values().map(v => v.value)).toEqual(['', '', '']);
    });

   /* it('allows to add a key (and a value)', () => {
        const vm = new ValueMap();
        vm.add('k1', 'v1');
        vm.add('k2');
        expect(vm.keys().sort()).toEqual(['k1', 'k2'].sort());
        expect(vm.values().map(v=>v.value)).toEqual(['v1', '']);
        expect(vm.valueFor('k1').value).toBe('v1');
        expect(vm.valueFor('k2').value).toBe('');
    });*/

    it('does not allow to add the same key twice', () => {
        const vm = new ValueMap(['k1', 'k1']);
        expect(vm.keys()).toEqual(['k1']);
        expect(vm.values().map(v => v.value)).toEqual(['']);
    });

    it('allows to remove a key', () => {
        const keys = ['k1', 'k2', 'k3'];
        const vm = new ValueMap(keys);
        vm.remove('k1');
        expect(vm.keys().sort()).toEqual(keys.slice(1).sort());
        expect(vm.values().map(v => v.value)).toEqual(['', '']);
    });

    /*it('notifies if a value has changed', () => {
        const vm = new ValueMap();
        vm.add('k1', 'v1');

        let updateEvent;
        vm.updates().subscribe(ue => {
            updateEvent = ue;
        });

        vm.valueFor('k1').value = 'v2';
        expect(updateEvent).toBeDefined();
        expect(updateEvent.source).toBeDefined();
        expect(updateEvent.source.value).toEqual('v2');
        expect(vm.valueFor('k1').value).toEqual('v2');
    });*/
});
