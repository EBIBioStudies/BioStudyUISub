import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class FieldDocsModalComponent implements AfterViewInit {
  public contents?: DocItem;
  @ViewChild('btnClose') btnClose!: ElementRef;

  // @ts-ignore
  constructor(public modalRef: BsModalRef) {}

  ngAfterViewInit(): void {
    // button not yet added to document,
    //  and no way to define onShown callback in this component, if displaying the modal with BsModalService
    setTimeout((_) => this.btnClose.nativeElement.focus(), 0);
  }
}
