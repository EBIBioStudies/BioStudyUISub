export class AppPath {
    private path: string;

    constructor(anchor: string) {
        let loc = window.location;
        this.path = loc.origin + loc.pathname + anchor;
    }

    get value(): string {
        return this.path;
    }
}