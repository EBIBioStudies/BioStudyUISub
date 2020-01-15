import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserData } from 'app/auth/shared';

@Component({
  selector: 'st-ftp-upload-button',
  templateUrl: './ftp-upload-button.component.html',
  styleUrls: ['./ftp-upload-button.component.css']
})
export class FTPUploadButtonComponent {
  modalRef?: BsModalRef;
  osName: string = 'unknown';
  secretId: string = '1234';

  constructor(
    private userData: UserData,
    private modalService: BsModalService
  ) {
    this.osName = this.getCurrentOSName();
  }

  getCurrentOSName() {
    if (navigator.appVersion.indexOf('Win') !== -1) {
      return 'windows';
    }

    if (navigator.appVersion.indexOf('Mac') !== -1) {
      return 'macos';
    }

    if (navigator.appVersion.indexOf('Linux') !== -1) {
      return 'linux';
    }

    return this.osName;
  }

  openModal(template: TemplateRef<any>) {
    this.userData.secretId$.subscribe((secret) => {
      this.secretId = secret;
      this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    });
  }
}
