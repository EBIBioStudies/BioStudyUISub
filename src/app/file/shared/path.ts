export class Path {
    constructor(private rootPath: string,
                private relativePath: string) {
    }

    get root(): string {
        return this.rootPath;
    }

    get rel(): string {
        return this.relativePath;
    }

    absolutePath(name?: string) {
        if (name) {
            return Path.join(this.rootPath, this.relativePath, name);
        }
        return Path.join(this.rootPath, this.relativePath);
    }

    setRoot(r: string): Path {
        return new Path(r, this.relativePath);
    }

    setRel(r: string): Path {
        return new Path(this.rootPath, r);
    }

    addRel(name: string): Path {
        return new Path(this.rootPath, Path.join(this.relativePath, name));
    }

    static join(...parts: string[]) {
        return parts.join('/').replace(/\/[\/]+/, '/');
    }
}