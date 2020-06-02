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
  GROUPS_PATH = 'groups';
  isGroup: boolean = false;
  @Input() path: string = '';
  USER_PATH = 'user';

  get isEmpty(): boolean {
    return this.dirs.length === 0;
  }

  get isGroupRoot(): boolean {
    return this.isGroup;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path) {
      const pathValue: string = changes.path.currentValue;
      const pathParts: string[] = pathValue.split('/');
      this.isGroup = pathValue.indexOf(this.GROUPS_PATH) !== -1;

      if (this.isGroup) {
        this.groupName = pathParts[2];
        this.dirs = pathParts.filter((part) => part !== '' && part !== this.groupName && part !== this.GROUPS_PATH);
      } else {
        this.dirs = pathParts.filter((part) => part !== '' && part !== this.USER_PATH);
      }
    }
  }

  onDirectoryClick(idx) {
    const rootPath: string = this.isGroup ? `/${this.GROUPS_PATH}/${this.groupName}` : `/${this.USER_PATH}`;
    const dir: string = `${rootPath}/${this.dirs.slice(0, idx + 1).join('/')}`;

    this.change.emit(dir);
  }
}
