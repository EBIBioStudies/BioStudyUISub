import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'st-subm-resubmit-modal',
  templateUrl: './subm-resubmit-modal.component.html'
})
export class SubmResubmitModalComponent {
  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  onOptionChange(option: string): void {
    console.log(option);
  }
}
