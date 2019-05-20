export class FileNode {
    expanded: boolean = false;
    icon: string | undefined = undefined;
    name: string;

    constructor(public isDir: boolean, public path: string) {
        this.icon = this.getIcon();
        this.name = this.getName();
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

    private getName(): string {
        let name = this.path.split(/\//).pop();
        name = name!.replace('User', 'Home');
        return name;
    }
}
