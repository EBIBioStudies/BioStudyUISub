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
  private static ROOT_FOLDER_PATH = '/user/';

  loaded = false;
  @Input() root?: FileNode;
  @Output() fileTreeSelect = new EventEmitter();

  private fileTreeNodes: FileNode[] = [];
  private unsubscribe = new Subject();

  constructor(private fileStore: FileTreeStore) {}

  get nodes(): FileNode[] {
    return this.fileTreeNodes;
  }

  set nodes(nodes: FileNode[]) {
    this.fileTreeNodes = nodes;
    this.loaded = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
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

  onChildTreeClick(path: string): void {
    const finalPath = path.replace(FileTreeComponent.ROOT_FOLDER_PATH, '');

    this.fileTreeSelect.emit(finalPath);
  }

  onNodeClick(node: FileNode): void {
    this.fileTreeSelect.emit(node.path);
  }

  onParentClick(node: FileNode): void {
    node.expandOrCollapse();
  }
}
