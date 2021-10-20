import { AlertModule } from 'ngx-bootstrap/alert';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './modal/confirm-dialog.component';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { HelpLinkComponent } from './help-link/help-link.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalService } from './modal/modal.service';
import { NgModule } from '@angular/core';
import { ServerSentEventService } from './server-sent-event.service';

@NgModule({
  imports: [CommonModule, ModalModule, AlertModule],
  providers: [ModalService, ServerSentEventService],
  declarations: [FileUploadButtonComponent, ConfirmDialogComponent, HelpLinkComponent],
  exports: [FileUploadButtonComponent, ConfirmDialogComponent, HelpLinkComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}
