import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserData } from 'app/auth/shared';
import { AppConfig } from 'app/app.config';

interface OSOption {
  displayName: string;
  link: string;
  name: string;
}

@Component({
  selector: 'st-ftp-upload-button',
  templateUrl: './ftp-upload-button.component.html',
  styleUrls: ['./ftp-upload-button.component.scss']
})
export class FTPUploadButtonComponent {
  modalRef?: BsModalRef;
  osOption: OSOption;
  osOptions: OSOption[] = [
    {
      name: 'Win',
      displayName: 'Windows',
      link: ''
    },
    {
      name: 'Mac',
      displayName: 'Mac OS',
      link: ''
    },
    {
      name: 'Linux',
      displayName: 'Linux',
      link: ''
    }
  ];
  secretId: string = '1234';
  ftpUser: string = 'bsftp';
  ftpPassword: string = 'bsftp1';
  isNewFtpUser = false;
  bsUploadPass = 'vsr5nW7Y';

  constructor(private userData: UserData, private modalService: BsModalService, private appConfig: AppConfig) {
    this.osOption = this.getCurrentOS();
  }

  getCurrentOS(): OSOption {
    const currentOS: OSOption | undefined = this.osOptions.find(
      (option) => navigator.appVersion.indexOf(option.name) !== -1
    );

    return currentOS === undefined ? this.osOptions[0] : currentOS;
  }

  onOSChange(optionName): void {
    this.osOption = this.osOptions.find((option) => option.name === optionName) || this.osOptions[0];
  }

  openModal(template: TemplateRef<any>): void {
    this.userData.info$.subscribe((extendedUserInfo) => {
      this.secretId =
        (this.appConfig.frontendURL.startsWith('https://www.ebi.ac.uk') ? '' : '.beta/') + extendedUserInfo.secret;
      this.ftpUser = extendedUserInfo.uploadType === 'ftp' ? 'bs-upload' : 'bsftp';
      this.ftpPassword = extendedUserInfo.uploadType === 'ftp' ? 'vsr5nW7Y' : 'bsftp1';
      this.isNewFtpUser = extendedUserInfo.uploadType === 'ftp';


      const version = extendedUserInfo.uploadType === 'ftp' ? '4.2.12' : '3.11.2';

      this.osOptions = [
        {
          name: 'Win',
          displayName: 'Windows',
          link: `https://www.ibm.com/support/fixcentral/swg/selectFixes?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+Connect&release=${version}&platform=Windows&function=all`
        },
        {
          name: 'Mac',
          displayName: 'Mac OS',
          link: `https://www.ibm.com/support/fixcentral/swg/selectFixes?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+Connect&release=${version}&platform=Mac+OSX&function=all`
        },
        {
          name: 'Linux',
          displayName: 'Linux',
          link: `https://www.ibm.com/support/fixcentral/swg/selectFixes?parent=ibm%7EOther%20software&product=ibm/Other+software/IBM+Aspera+Connect&release=${version}&platform=Linux&function=all`
        }
      ];
      this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    });
  }
}
