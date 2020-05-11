import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'st-directory-path',
  templateUrl: './directory-path.component.html',
  styleUrls: ['./directory-path.component.css']
})
export class DirectoryPathComponent implements OnChanges {
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  dirs: string[] = [];
  groupName: string = '';
  isGroup: boolean = false;
  @Input() path: string = '';
  @Input() root: string = '';

  get isEmpty(): boolean {
    return this.dirs.length === 0;
  }

  get isGroupRoot(): boolean {
    return this.isGroup;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path) {
      const pathValue = changes.path.currentValue;
      this.dirs = (pathValue || '').split('/').filter(Boolean);
    }

    if (changes.root) {
      const currentValue: string = changes.root.currentValue;
      this.isGroup = currentValue.indexOf('/groups') !== -1;
      this.groupName = currentValue.split('/')[2];
    }
  }

  onDirectoryClick(idx) {
    if (idx === 'root') {
      this.change.emit('/');
    } else {
      const dir = '/' + (this.dirs.slice(0, idx + 1)).join('/');
      this.change.emit(dir);
    }
  }
}
