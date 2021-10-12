import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-help-modal',
  templateUrl: './help-modal.component.html'
})
export class HelpModalComponent {
  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }
}
