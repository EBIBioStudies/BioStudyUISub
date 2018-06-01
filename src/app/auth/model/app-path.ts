export class AppPath {
    private _value: string;

    constructor(ancor: string) {
        this._value = this.getAppPath(ancor);
    }

    get value(): string {
        return this._value;
    }

    private getAppPath(ancor: string = '') {
        let loc = window.location;
        return loc.origin + loc.pathname + ancor;
    }
}