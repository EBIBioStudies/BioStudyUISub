import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'st-help-modal',
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent {
  isHiddenForever: boolean = false;
  @Input() onHideForever: () => void = () => {};

  constructor(public bsModalRef: BsModalRef, private appConfig: AppConfig) {}

  get introVideoPath(): string {
    return `${this.appConfig.contextPath}/images/help/new-submission.mp4`;
  }

  hide(): void {
    this.bsModalRef.hide();

    if (this.isHiddenForever) {
      this.onHideForever();
    }
  }

  hideForever(): void {
    this.isHiddenForever = !this.isHiddenForever;
  }
}
