export class WithSnapshot {
    dataSnapshot(properties: Array<string>) {
        const s = {};
        for (let p of properties) {
            s[p] = this[p];
        }
        return s;
    }
}