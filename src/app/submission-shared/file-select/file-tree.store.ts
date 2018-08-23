import {Injectable} from '@angular/core';
import {FileNode} from './file-tree.model';
import {FileService, UserGroup, PathInfo} from '../../file';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class FileTreeStore {

    private userGroups$: Observable<UserGroup[]>;

    private files$ = {}; // path -> Observable<FileNode[]>

    constructor(private fileService: FileService) {
    }

    /* checks if at least one file exists in the user's directories */
    isEmpty(): Observable<FileNode> {
        return this.getUserDirs()
            .mergeMap(dirs => this.dfs(dirs))
            .find(node => !node.isDir);
    }

    private dfs(nodes: FileNode[]): Observable<FileNode> {
        return Observable.from(nodes)
            .mergeMap(node =>
                node.isDir ?
                    this.getFiles(node.path)
                        .mergeMap(nodes => this.dfs(nodes)) : Observable.of(node))
    }

    getUserDirs(): Observable<FileNode[]> {
        return this.getUserGroups()
            .map(groups => groups.map(g => ({name: g.name, path: '/Groups/' + g.name, type: 'DIR'})))
            .map(paths => [].concat([{name: 'Home', path: '/User', type: 'DIR'}], paths))
            .map(groups => groups.map(g => new FileNode(true, g.path)));
    }

    getFiles(path: string) {
        return this.getUserFiles(path)
            .map(files => files.map(file => new FileNode(file.type === 'DIR', file.path)));
    }

    getUserFiles(path: string): Observable<PathInfo[]> {
        if (this.files$[path] === undefined) {
            this.files$[path] = this.fileService.getFiles(path)
                .publishReplay(1) //cache the most recent value
                .refCount(); // keep the observable alive for as long as there are subscribers
        }
        return this.files$[path];
    }

    getUserGroups(): Observable<UserGroup[]> {
        if (this.userGroups$ === undefined) {
            this.userGroups$ = this.fileService.getUserGroups()
                .publishReplay(1) //cache the most recent value
                .refCount(); // keep the observable alive for as long as there are subscribers
        }
        return this.userGroups$;
    }

    findFile(filePath: string): Observable<string> {
        if (filePath.trim().length === 0) {
            return Observable.of(filePath);
        }
        let parts = (filePath || '').split('/');
        let fileName = parts[parts.length - 1];
        let fileDir = parts.slice(0, -1).join('/');

        return this.getUserGroups()
            .map(groups => groups.find(g => g.groupId !== undefined && fileDir.startsWith(g.id)))
            .mergeMap(group => group ?
                Observable.of(fileDir.replace(group.id, '/Groups/' + group.name)) :
                Observable.of(fileDir))
            .map(dir => dir === '' ? dir : dir + '/')
            .map(dir => dir + fileName)
        /*.flatMap(dir => this.getFiles(dir))
        .catch((err) => {
            console.log(err);
            return Observable.of([]);
        })
        .flatMap(fileNodes => Observable.from(fileNodes))
        .find(fileNode => fileNode.name === fileName)
        .map(fileNode => fileNode ? fileNode.path : undefined);
        */
    }

    clearCache(): void {
        this.userGroups$ = undefined;
        this.files$ = {};
    }
}