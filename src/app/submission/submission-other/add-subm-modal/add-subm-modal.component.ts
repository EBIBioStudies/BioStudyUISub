import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemplateDetail } from 'app/submission/submission-shared/model/templates/submission.templates';

@Component({
  selector: 'st-add-subm-modal',
  templateUrl: './add-subm-modal.component.html'
})
export class AddSubmModalComponent {
  onOk?: (collection?: string, template?: string) => void;
  selectedCollection?: string;
  selectedTemplate: string = 'Default';
  templates?: TemplateDetail[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  hide(): void {
    this.bsModalRef.hide();
  }

  ok(): void {
    if (this.onOk) {
      this.onOk(this.selectedCollection, this.selectedTemplate);
    }
  }

  changeTemplate(tmpl: any): void {
    this.selectedTemplate = tmpl.name;
    this.selectedCollection = tmpl.title;
  }
}
