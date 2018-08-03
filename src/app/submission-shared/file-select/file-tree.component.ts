import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FileService} from 'app/file/index';
import {FileNode} from "./file-tree.model";

@Component({
    selector: 'file-tree',
    templateUrl: './file-tree.component.html',
    styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit{

    @Input() root: FileNode;
    @Output() select = new EventEmitter();

    nodes: FileNode[] = [];

    subscription;

    constructor(private fileService: FileService) {
    }

    ngOnInit() {
        if (this.root === undefined) {
            this.subscription = this.fileService.getUserDirs()
                .map(dirs => dirs.map(dir => new FileNode(true, dir.path)))
                .subscribe(nodes => {
                    console.log(nodes);
                    this.nodes = nodes;
                })
        } else if (this.root.isDir) {
            this.subscription = this.fileService.getFiles(this.root.path)
                .subscribe(
                        data => {
                            if (data.status === 'OK') {
                                this.nodes = data.files.map(file => new FileNode(file.type === 'DIR', file.path));
                            }
                        })
        }
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
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