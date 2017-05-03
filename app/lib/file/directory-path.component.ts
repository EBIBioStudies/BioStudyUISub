import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'directory-path',
    template: `
    <span *ngFor="let dir of dirs; let last = last; let index = index">
        <a *ngIf="!last"
           (click)="onDirectoryClick(index)" style="color:black">
           {{dir}}
        </a>
        <span *ngIf="last">{{dir}}</span>
        <span>/</span>
</span>
`
})
export class DirectoryPathComponent {
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    private dirs = [];

    @Input()
    set path(path: string) {
        if (path) {
            let p = path.replace(/\/\s*$/, '');
            this.dirs = (('\u2022' + p).split('/'));
        }
    }

    onDirectoryClick(idx) {
        this.change.emit('/' + (this.dirs.slice(1, idx + 1)).join('/'));
    }
}