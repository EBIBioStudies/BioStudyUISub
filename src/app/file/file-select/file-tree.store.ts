import { Injectable } from '@angular/core';
import { FileNode } from './file-tree.model';
import { PathInfo, UserGroup } from '../shared/file-rest.model';
import { FileService } from '../shared/file.service';
import { from, Observable, of } from 'rxjs';
import { find, map, mergeMap, publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class FileTreeStore {
    private userGroups$?: Observable<UserGroup[]>;
    private files$ = {}; // path -> Observable<FileNode[]>

    constructor(private fileService: FileService) {
    }

    /* checks if at least one file exists in the user's directories */
    isEmpty(): Observable<FileNode | undefined> {
        return this.getUserDirs().pipe(
            mergeMap(dirs => this.dfs(dirs)),
            find(node => !node.isDir)
        );
    }

    private dfs(nodes: FileNode[]): Observable<FileNode> {
        return from(nodes).pipe(
            mergeMap(node => node.isDir ?
                this.getFiles(node.path).pipe(mergeMap(nodes => this.dfs(nodes)))
                : of(node))
        );
    }

    getUserDirs(): Observable<FileNode[]> {
        return this.fileService.getUserDirs(this.getUserGroups()).pipe(
            map(groups => groups.map(g => new FileNode(g.name, true, g.path)))
        );
    }

    getFiles(path: string) {
        return this.getUserFiles(path).pipe(
            map(files => files.map(file => new FileNode(file.name, file.type === 'DIR', file.path)))
        );
    }

    getUserFiles(path: string): Observable<PathInfo[]> {
        if (this.files$[path] === undefined) {
            this.files$[path] = this.fileService.getFiles(path).pipe(
                publishReplay(1), // cache the most recent value
                refCount() // keep the observable alive for as long as there are subscribers
            );
        }
        return this.files$[path];
    }

    getUserGroups(): Observable<UserGroup[]> {
        if (this.userGroups$ === undefined) {
            this.userGroups$ = this.fileService.getUserGroups().pipe(
                publishReplay(1), // cache the most recent value
                refCount() // keep the observable alive for as long as there are subscribers
            );
        }
        return this.userGroups$;
    }

    findFile(filePath: string): Observable<string> {
        if (filePath.trim().length === 0) {
            return of(filePath);
        }
        const parts = (filePath || '').split('/');
        const fileName = parts[parts.length - 1];
        const fileDir = parts.slice(0, -1).join('/');

        return this.getUserGroups().pipe(
            map(groups => groups.find(g => g.groupId !== undefined && fileDir.startsWith(g.id))),
            mergeMap(group => group ?
                of(fileDir.replace(group.id, '/Groups/' + group.name)) :
                of(fileDir)),
            map(dir => dir === '' ? dir : dir + '/'),
            map(dir => dir + fileName)
        );
    }

    clearCache(): void {
        this.userGroups$ = undefined;
        this.files$ = {};
    }
}
