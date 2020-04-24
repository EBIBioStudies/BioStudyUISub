import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'st-directory-path',
  templateUrl: './directory-path.component.html',
  styleUrls: ['./directory-path.component.css']
})
export class DirectoryPathComponent implements OnChanges {
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  dirs: string[] = [];
  @Input() path: string = '';

  get isEmpty(): boolean {
    return this.dirs.length === 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const pathValue = changes.path.currentValue;
    this.dirs = (pathValue || '').split('/').filter(Boolean);
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
