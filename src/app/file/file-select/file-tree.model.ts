export class FileNode {
    expanded: boolean = false;
    icon: string | undefined = undefined;
    isDir: boolean;
    name: string;
    path: string;

    constructor(isDir: boolean, path: string, name: string) {
        this.isDir = isDir;
        this.name = name;
        this.path = path.length === 0 ? `/${name}` : `/${path}/${name}`;
        this.icon = this.getIcon();
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
