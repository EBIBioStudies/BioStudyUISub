import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-add-subm-modal',
  templateUrl: './add-subm-modal.component.html'
})
export class AddSubmModalComponent {
  onOk?: (collection?: string, template?: string) => void;
  selectedCollection?: string;
  selectedTemplate: string = 'Default';
  templates?: Array<{ description: string; name: string; title: string }> = [];

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  ok(): void {
    if (this.onOk) {
      this.onOk(this.selectedCollection, this.selectedTemplate);
    }
  }

  changeTemplate(tmpl: any) {
    this.selectedTemplate = tmpl.name;
    this.selectedCollection = tmpl.title;
  }
}
