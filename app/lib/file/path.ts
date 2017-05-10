export class Path {
    constructor(private _root: string,
                private _rel: string) {
    }

    get root(): string {
        return this._root;
    }

    get rel(): string {
        return this._rel;
    }

    fullPath(name?: string) {
        if (name) {
            return Path.join(this._root, this._rel, name);
        }
        return Path.join(this._root, this._rel);
    }

    setRoot(r: string): Path {
        return new Path(r, this._rel);
    }

    setRel(r: string): Path {
        return new Path(this._root, r);
    }

    addRel(name: string): Path {
        return new Path(this._root, Path.join(this._rel, name));
    }

    static join(...parts: string[]) {
        return parts.join('/').replace(/\/[\/]+/, '/');
    }
}