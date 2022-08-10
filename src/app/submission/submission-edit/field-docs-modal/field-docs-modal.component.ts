import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

export class DocItem {
  fieldName?: string;
  description?: string;
  examples?: Array<string>;
}

@Component({
  selector: 'st-docs',
  templateUrl: './field-docs-modal.component.html',
  styleUrls: ['./field-docs-modal.component.scss']
})
export class FieldDocsModalComponent {
  public contents?: DocItem;
  // @ts-ignore
  constructor(public modalRef: BsModalRef) {}
}
