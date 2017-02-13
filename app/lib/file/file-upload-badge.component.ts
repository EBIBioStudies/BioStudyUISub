import {Component, Inject, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';

import * as _ from 'lodash';

@Component({
    selector: 'file-upload-badge',
    template: `
    <!--template #popTemplate>
       <span *ngIf="uploads.length === 0">No uploads</span>
       <ul class="sidebar-menu">
          <li *ngFor="let u of uploads"><a>{{u.name}}, {{u.status}}</a></li>
       </ul>
    </template>
    <span class="badge"
          [popover]="popTemplate" 
          container="body"
          placement="bottom">{{count}}</span-->
    

   <div class="btn-group" dropdown>
      <span class="badge" dropdownToggle>{{count}}</span>
      <ul *ngIf="uploads.length === 0" class="dropdown-menu" style="left:-160px" dropdownMenu  role="menu">
         <li role="menuitem"><a class="dropdown-item">No uploads</a></li>
      </ul>
      <ul *ngIf="uploads.length > 0" class="dropdown-menu" style="left:-160px" dropdownMenu role="menu">
         <li role="menuitem" *ngFor="let u of uploads">
            <a class="dropdown-item" (click)="onMenuItemClick(u)">{{u.name}}, {{u.status}}</a>
         </li>
      </ul>
   </div>      
`
})
export class FileUploadBadgeComponent implements OnInit {
    @Input() path: string;
    @Output() select: EventEmitter<string> = new EventEmitter<string>();

    private __uploads = [];

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    get count(): number {
        return this.uploads.length;
    }

    get uploads(): any[] {
        return this.merge(_.flatMap(this.uploader.activeUploads(), (u) => {
            return _.map(u.files, (f) => ({
                name: f,
                path: u.path,
                status: u.status,
                progress: 0
            }))
        }));
    }

    merge(dest: any[]): any[] {
        if (this.__uploads.length == 0) {
           this.__uploads = dest;
           return dest;
        }
        let src = this.__uploads;
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
        console.log(u.path + '/' + u.name);
        this.select.emit(u.path + '/' + u.name);
    }

}