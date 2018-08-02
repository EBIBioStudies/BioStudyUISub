export class FileNode {
    expanded: boolean = false;
    icon: String = undefined;

    constructor(public isDir: boolean, public path: string) {
        this.icon = this.getIcon();
    }

    expand() {
        this.expanded = !this.expanded;
        this.icon = this.getIcon();
    }

    private getIcon(): String {
        if (this.isDir) {
            if (this.expanded) {
                return '- ';
            }
            return '+ ';
        }
        return undefined;
    }
}