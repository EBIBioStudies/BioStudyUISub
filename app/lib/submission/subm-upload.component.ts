import {Component, Inject} from '@angular/core';

@Component({
    selector: 'subm-upload',
    template: `
<file-upload-button title="Select submission..." (select)="onUploadFilesSelect($event)"></file-upload-button>
`
})

export class SubmissionUploadComponent {
}