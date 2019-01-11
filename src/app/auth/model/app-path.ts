export class AppPath {
    private _value: string;

    constructor(anchor: string) {
        this._value = this.getAppPath(anchor);
    }

    get value(): string {
        return this._value;
    }

    private getAppPath(anchor: string = '') {
        let loc = window.location;
        return loc.origin + loc.pathname + anchor;
    }
}