import { Injectable } from '@angular/core';
import { FileNode } from './file-tree.model';
import { PathInfo, UserGroup } from '../shared/file-rest.model';
import { FileService } from '../shared/file.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap, publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class FileTreeStore {
    private files$ = {}; // path -> Observable<FileNode[]>
    private userGroups$?: Observable<UserGroup[]>;

    constructor(private fileService: FileService) {}

    clearCache(): void {
        this.userGroups$ = undefined;
        this.files$ = {};
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

    getFiles(path: string) {
        return this.getUserFiles(path).pipe(
            map((files) => files.map((file) => new FileNode(file.type === 'DIR', file.path, file.name)))
        );
    }

    getUserDirs(): Observable<FileNode[]> {
        return this.fileService.getUserDirs(this.getUserGroups()).pipe(
            map(groups => groups.map(g => new FileNode(true, g.path, g.name)))
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
}
