import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserData } from 'app/auth/shared';

interface OSOption {
  displayName: string,
  link: string,
  name: string
}

@Component({
  selector: 'st-ftp-upload-button',
  templateUrl: './ftp-upload-button.component.html',
  styleUrls: ['./ftp-upload-button.component.css']
})
export class FTPUploadButtonComponent {
  modalRef?: BsModalRef;
  osOption: OSOption;
  osOptions: OSOption[] = [{
    name: 'Win',
    displayName: 'Windows',
    link: 'https://www.ibm.com/support/fixcentral/swg/selectFixes' +
          '?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+CLI&release=All&platform=Windows&function=all'
  }, {
    name: 'Mac',
    displayName: 'Mac OS',
    link: 'https://www.ibm.com/support/fixcentral/swg/selectFixes' +
          '?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+CLI&release=All&platform=Mac+OSX&function=all'
  }, {
    name: 'Linux',
    displayName: 'Linux',
    link: 'https://www.ibm.com/support/fixcentral/swg/selectFixes' +
          '?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+CLI&release=All&platform=Linux&function=all'
  }];
  secretId: string = '1234';

  constructor(
    private userData: UserData,
    private modalService: BsModalService
  ) {
    this.osOption = this.getCurrentOS();
  }

  getCurrentOS(): OSOption {
    const currentOS: OSOption | undefined = this.osOptions.find((option) => navigator.appVersion.indexOf(option.name) !== -1);

    return currentOS === undefined ? this.osOptions[0] : currentOS;
  }

  onOSChange(optionName): void {
    this.osOption = this.osOptions.find((option) => option.name === optionName) ||  this.osOptions[0];
  }

  openModal(template: TemplateRef<any>): void {
    this.userData.secretId$.subscribe((secret) => {
      this.secretId = secret;
      this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    });
  }
}
