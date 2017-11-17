import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

@Component({
    selector: 'directory-path',
    templateUrl:'./directory-path.component.html'
})
export class DirectoryPathComponent {
    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    private dirs:string[] = [];
    private _path:string = '';

    @Input()
    get path() {
        return this._path;
    }
    set path(path: string) {
        if (path.trim().length) {
            this.dirs = path.split('/').filter(Boolean);
        }
        this._path = path;
    }

    onDirectoryClick(idx) {
        this.change.emit('/' + (this.dirs.slice(1, idx + 1)).join('/'));
    }
}