import {Component, Inject, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {FileUploadService} from './file-upload.service';

@Component({
    selector: 'file-upload-badge',
    template: `
    <template #popTemplate>No uploads</template>
    <span class="badge"
          [popover]="popTemplate" 
          container="body"
          placement="bottom">{{count}}</span>
`
})
export class FileUploadBadgeComponent implements OnInit {
    @Input() path: string;

    private count = 0;

    constructor(@Inject(FileUploadService) private uploader: FileUploadService) {
    }

    ngOnInit() {

    }

}