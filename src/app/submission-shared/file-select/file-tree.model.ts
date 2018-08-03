export class FileNode {
    expanded: boolean = false;
    icon: String = undefined;
    name: String;

    constructor(public isDir: boolean, public path: string) {
        this.icon = this.getIcon();
        this.name = this.getName();
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

    private getName(): String {
        var name = this.path.split(/\//).pop();
        name = name.replace('User', 'Home');
        return name;
    }
}