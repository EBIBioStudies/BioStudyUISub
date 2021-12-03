import { AlertModule } from 'ngx-bootstrap/alert';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './modal/confirm-dialog.component';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { HelpLinkComponent } from './help-link/help-link.component';
import { ModalService } from './modal/modal.service';
import { ServerSentEventService } from './server-sent-event.service';
import { ORCIDInputBoxComponent } from './orcid-input-box/orcid-input-box.component';

@NgModule({
  imports: [CommonModule, ModalModule, AlertModule, FormsModule],
  providers: [ModalService, ServerSentEventService],
  declarations: [FileUploadButtonComponent, ConfirmDialogComponent, HelpLinkComponent, ORCIDInputBoxComponent],
  exports: [FileUploadButtonComponent, ConfirmDialogComponent, HelpLinkComponent, ORCIDInputBoxComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}
