export class FileNode {
  expanded: boolean = false;
  icon: string | undefined = undefined;
  isDir: boolean;
  name: string;
  path: string;

  constructor(isDir: boolean, path: string, name: string) {
    const isRoot = name === '/';

    this.isDir = isDir;
    this.name = name;
    this.path = isRoot ? `/user` : `/${path}/${name}`;
    this.icon = this.getIcon();
    this.expanded = isRoot;
  }

  expandOrCollapse(): void {
    this.expanded = !this.expanded;
    this.icon = this.getIcon();
  }

  private getIcon(): string | undefined {
    if (this.isDir) {
      if (this.expanded) {
        return '- ';
      }
      return '+ ';
    }

    return undefined;
  }
}
