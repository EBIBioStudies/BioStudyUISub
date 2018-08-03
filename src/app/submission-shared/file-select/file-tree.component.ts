import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FileNode} from "./file-tree.model";
import {FileTreeStore} from "./file-tree.store";

@Component({
    selector: 'file-tree',
    templateUrl: './file-tree.component.html',
    styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit, OnDestroy{

    @Input() root: FileNode;
    @Output() select = new EventEmitter();

    nodes: FileNode[] = [];

    subscription;

    constructor(private fileStore: FileTreeStore) {
    }

    ngOnInit() {
        if (this.root === undefined) {
            this.subscription = this.fileStore.getUserDirs()
                .subscribe(nodes => {this.nodes = nodes})
        } else if (this.root.isDir) {
            this.subscription = this.fileStore.getFiles(this.root.path)
                .subscribe(nodes => {this.nodes = nodes})
        }
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        this.fileStore.clearCache();
    }

    onChildTreeClick(value: string) {
        this.select.emit(value)
    }

    onNodeClick(node: FileNode) {
        if (!node.isDir) {
            this.select.emit(node.path);
        }
    }
}