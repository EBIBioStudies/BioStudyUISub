import {Component, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap';
import {UserData} from '../../../auth/shared';

@Component({
    selector: 'ftp-upload-button',
    templateUrl: './ftp-upload-button.component.html'
})

export class FTPUploadButtonComponent {

    modalRef?: BsModalRef;
    secretId: string = '1234';

    constructor(
        private userData: UserData,
        private modalService: BsModalService) {
    }

    openModal(template: TemplateRef<any>) {
        this.userData.secretId$.subscribe(secret => {
            this.secretId = secret;
            this.modalRef = this.modalService.show(template);
        });
    }
}
