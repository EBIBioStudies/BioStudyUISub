import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-help-modal',
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent {
  isHiddenForever: boolean = false;
  @Input() onHideForever: () => void = () => {};

  constructor(public bsModalRef: BsModalRef) {}

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
