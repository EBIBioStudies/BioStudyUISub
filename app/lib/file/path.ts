export class Path {

    constructor(private __root: string,
                private __rel: string) {
    }

    get root(): string {
        return this.__root;
    }

    get rel(): string {
        return this.__rel;
    }

    fullPath(name?: string) {
        if (name) {
            return Path.join(this.__root, this.__rel, name);
        }
        return Path.join(this.__root, this.__rel);
    }

    setRoot(r: string): Path {
        return new Path(r, this.__rel);
    }

    setRel(r: string): Path {
        return new Path(this.__root, r);
    }

    addRel(name: string): Path {
        return new Path(this.__root, Path.join(this.__rel, name));
    }

    static join(...parts: string[]) {
        return parts.join('/').replace(/\/[\/]+/, '/');
    }

}