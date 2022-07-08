import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'st-subm-resubmit-modal',
  templateUrl: './subm-resubmit-modal.component.html'
})
export class SubmResubmitModalComponent {
  onResubmit?: (onlyMetadataUpdate: boolean) => void;
  onlyMetadataUpdate: boolean = false;

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  onOptionChange(option: string): void {
    this.onlyMetadataUpdate = option === 'noFilesUpdated';
  }

  resubmit(): void {
    if (this.onResubmit) {
      this.onResubmit(this.onlyMetadataUpdate);
    }

    this.hide();
  }
}
