export class FileNode {
    expanded: boolean = false;
    icon: string | undefined = undefined;

    constructor(public name: string, public isDir: boolean, public path: string) {
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
