import {Injectable} from '@angular/core';
import {FileNode} from './file-tree.model';
import {FileService} from '../../file';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/find';

@Injectable()
export class FileTreeStore {

    private userDirs$: Observable<FileNode[]>;

    private files$ = {}; // path -> Observable<FileNode[]>

    constructor(private fileService: FileService) {
    }

    /* checks if a file exists in the file tree */
    isEmpty(): Observable<FileNode> {
        return this.getUserDirs()
            .flatMap(dirs => this.dfs(dirs))
            .find(node => !node.isDir);
    }

    private dfs(nodes: FileNode[]): Observable<FileNode> {
        return Observable.from(nodes)
            .flatMap(node =>
                node.isDir ?
                    this.getFiles(node.path)
                        .flatMap(nodes => this.dfs(nodes)) : Observable.of(node))
    }

    getUserDirs(): Observable<FileNode[]> {
        if (this.userDirs$ === undefined) {
            this.userDirs$ = this.fileService.getUserDirs()
                .map(dirs => dirs.map(dir => new FileNode(true, dir.path)))
                .publishReplay(1) //cache the most recent value
                .refCount(); // keep the observable alive for as long as there are subscribers
        }
        return this.userDirs$;
    }

    getFiles(path: string): Observable<FileNode[]> {
        if (this.files$[path] === undefined) {
            this.files$[path] = this.fileService.getFiles(path)
                .map(data => (data.files || []))
                .map(files => files.map(file => new FileNode(file.type === 'DIR', file.path)))
                .publishReplay(1) //cache the most recent value
                .refCount(); // keep the observable alive for as long as there are subscribers
        }
        return this.files$[path];
    }

    clearCache(): void {
        this.userDirs$ = undefined;
        this.files$ = {};
    }
}