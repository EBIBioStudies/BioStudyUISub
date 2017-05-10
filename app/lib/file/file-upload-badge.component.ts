import {Component, EventEmitter, Output} from '@angular/core';
import {FileUploadService} from './file-upload.service';

import * as _ from 'lodash';

@Component({
    selector: 'file-upload-badge',
    template: `
   <div class="btn-group" dropdown>
      <span class="badge" dropdownToggle>{{count}}</span>
      <ul class="dropdown-menu" style="left:-160px" *dropdownMenu role="menu">
         <li *ngIf="uploads.length === 0" role="menuitem"><a class="dropdown-item">No uploads</a></li>
         <li role="menuitem" *ngFor="let u of uploads">
            <a class="dropdown-item" (click)="onMenuItemClick(u)">{{u.name}}, {{u.progress}}</a>
         </li>
      </ul>
   </div>      
`
})
export class FileUploadBadgeComponent {
    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    private _uploads = [];

    constructor(private uploader: FileUploadService) {
    }

    get count(): number {
        return this.uploads.length;
    }

    get uploads(): any[] {
        return this.merge(_.flatMap(this.uploader.activeUploads(), (u) => {
            return _.map(u.files, (f) => ({
                name: f,
                path: u.path,
                progress: u.failed() ? 'error' : u.progress + "%"
            }))
        }));
    }

    merge(dest: any[]): any[] {
        if (this._uploads.length == 0) {
           this._uploads = dest;
           return dest;
        }
        let src = this._uploads;
        let i = 0, j = 0;
        while (i < src.length || j < dest.length) {
            if (i >= src.length && j < dest.length) {
                src.push(dest[j]);
                continue;
            }
            if (j >= dest.length && i < src.length) {
                src.splice(i,1);
                continue;
            }
            let u1 = src[i];
            let u2 = dest[j];
            if (u1.name != u2.name) {
                src.splice(i,1);
                i++;
                continue;
            }
            u1.progress = u2.progress;
            i++;
            j++;
        }
        return src;
    }

    onMenuItemClick(u) {
        this.select.emit({path: u.path, name: u.name});
    }
}