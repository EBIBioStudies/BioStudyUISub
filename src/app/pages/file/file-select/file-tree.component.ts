import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FileNode } from './file-tree.model';
import { FileTreeStore } from './file-tree.store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'st-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit, OnDestroy {

  get nodes(): FileNode[] {
    return this._nodes;
  }

  set nodes(nodes: FileNode[]) {
    this._nodes = nodes;
    this.loaded = true;
  }
  private static ROOT_FOLDER_PATH = '/user/';

  loaded = false;
  @Input() root?: FileNode;
  @Output() select = new EventEmitter();

  private _nodes: FileNode[] = [];
  private unsubscribe = new Subject();

  constructor(private fileStore: FileTreeStore) {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit() {
    if (this.root === undefined) {
      this.fileStore.getUserDirs()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(nodes => this.nodes = nodes);
    } else if (this.root.isDir) {
      this.fileStore.getFiles(this.root.path)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(nodes => this.nodes = nodes);
    }
  }

  onChildTreeClick(path: string) {
    const finalPath = path.replace(FileTreeComponent.ROOT_FOLDER_PATH, '');

    this.select.emit(finalPath);
  }

  onNodeClick(node: FileNode) {
      this.select.emit(node.path);
  }

  onParentClick(node: FileNode) {
    node.expandOrCollapse();
  }
}
