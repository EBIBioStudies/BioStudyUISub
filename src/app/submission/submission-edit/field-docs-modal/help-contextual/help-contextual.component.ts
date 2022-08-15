import { Component, Input } from '@angular/core';
import { DocItem, FieldDocsModalComponent } from '../field-docs-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'st-help-contextual',
  templateUrl: './help-contextual.component.html'
})
export class HelpContextualComponent {
  @Input() contents?: DocItem;

  constructor(private modalService: BsModalService) {}

  pushDocContents(): void {
    this.modalService.show(FieldDocsModalComponent, {
      initialState: {
        contents: this.contents
      },
      class: 'modal-xl modal-wrap-contents modal-dialog-centered modal-dialog'
    });
  }
}
