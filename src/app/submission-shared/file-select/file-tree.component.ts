import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FileNode} from "./file-tree.model";
import {FileTreeStore} from "./file-tree.store";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'file-tree',
    templateUrl: './file-tree.component.html',
    styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit, OnDestroy {

    @Input() root: FileNode;
    @Output() select = new EventEmitter();

    loaded = false;

    private _nodes: FileNode[] = [];
    private unsubscribe = new Subject();

    constructor(private fileStore: FileTreeStore) {
    }

    ngOnInit() {
        if (this.root === undefined) {
            this.fileStore.getUserDirs()
                .takeUntil(this.unsubscribe)
                .subscribe(nodes => {
                    this.nodes = nodes
                })
        } else if (this.root.isDir) {
            this.fileStore.getFiles(this.root.path)
                .takeUntil(this.unsubscribe)
                .subscribe(nodes => {
                    this.nodes = nodes
                })
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onChildTreeClick(value: string) {
        this.select.emit(value)
    }

    onNodeClick(node: FileNode) {
        if (node.isDir) {
            node.expandOrCollapse();
        } else {
            this.select.emit(node.path);
        }
    }

    get nodes(): FileNode[] {
        return this._nodes;
    }

    set nodes(nodes: FileNode[]) {
        this._nodes = nodes;
        this.loaded = true;
    }
}