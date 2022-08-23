export class Path {
  constructor(private rootPath: string, private relativePath: string) {}

  static join(...parts: string[]): string {
    return parts.join('/').replace(/\/[/]+/, '/');
  }

  get absolute(): string {
    return Path.join(this.rootPath, this.relativePath);
  }

  get root(): string {
    return this.rootPath;
  }

  get rel(): string {
    return this.relativePath;
  }

  absolutePath(name?: string): string {
    if (name) {
      return Path.join(this.rootPath, this.relativePath, name);
    }

    return Path.join(this.rootPath, this.relativePath);
  }

  addRel(name: string): Path {
    return new Path(this.rootPath, Path.join(this.relativePath, name));
  }

  setRel(relativePath: string): Path {
    return new Path(this.rootPath, relativePath);
  }

  setRoot(r: string): Path {
    return new Path(r, this.relativePath);
  }
}
