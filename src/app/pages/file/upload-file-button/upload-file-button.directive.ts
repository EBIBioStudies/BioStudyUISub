import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UploadFileModalComponent } from './upload-file-modal.component';

@Directive({
  selector: 'button[stUploadFileButton]'
})
export class UploadFileButtonDirective {
  @Output() onUploadFile: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: BsModalService) {}

  @HostListener('click', ['$event.target']) onClick() {
    this.onUploadFileClick();
  }

  private onUploadFileClick() {
    this.uploadFileTemplate();
  }

  private uploadFileTemplate() {
    const modal = this.modalService.show(UploadFileModalComponent, { ignoreBackdropClick: true });

    (modal.content as UploadFileModalComponent).onClose.subscribe((fileName) => {
      this.onUploadFile.emit({ fileName });
    });
  }
}
