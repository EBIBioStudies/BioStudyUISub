import { AfterViewInit, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-add-subm-modal',
  templateUrl: './add-subm-modal.component.html'
})
export class AddSubmModalComponent implements AfterViewInit {
  onOk?: Function;
  selected: string = 'Default';
  templates?: Array<{ description: string, name: string }> = [];

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  ngAfterViewInit(): void {
    (document.getElementsByClassName('project-radio')[0] as HTMLInputElement).focus();
  }

  ok(): void {
    if (this.onOk) {
      this.onOk(this.selected);
    }
  }
}
