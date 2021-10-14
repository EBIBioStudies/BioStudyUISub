import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ContainerRootComponent } from './container-root.component';
import { DNAInputComponent } from './dna-input/dna-input.component';
import { DateFormatDirective } from './date-format.directive';
import { DateInputComponent } from './date-input/date-input.component';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { HelpLinkComponent } from './help-link/help-link.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalService } from './modal.service';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ORCIDInputBoxComponent } from './orcid-input-box/orcid-input-box.component';
import { PluralPipe } from './plural.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProteinInputComponent } from './protein-input/protein-input.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { ServerSentEventService } from './server-sent-event.service';
import { StripHtmlPipe } from './strip-html.pipe';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ValidateOnBlurDirective } from './validate-onblur.directive';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    BsDropdownModule,
    BsDatepickerModule,
    ModalModule,
    PopoverModule,
    CollapseModule,
    AlertModule,
    CKEditorModule
  ],
  providers: [ModalService, ServerSentEventService],
  declarations: [
    ContainerRootComponent,
    ORCIDInputBoxComponent,
    FileUploadButtonComponent,
    ConfirmDialogComponent,
    StripHtmlPipe,
    ValidateOnBlurDirective,
    DateFormatDirective,
    DateInputComponent,
    DNAInputComponent,
    ProteinInputComponent,
    PluralPipe,
    SelectInputComponent,
    HelpLinkComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TypeaheadModule,
    TooltipModule,
    TabsModule,
    BsDropdownModule,
    BsDatepickerModule,
    ModalModule,
    PopoverModule,
    CollapseModule,
    AlertModule,
    ContainerRootComponent,
    ORCIDInputBoxComponent,
    FileUploadButtonComponent,
    ConfirmDialogComponent,
    StripHtmlPipe,
    ValidateOnBlurDirective,
    DateFormatDirective,
    DateInputComponent,
    DNAInputComponent,
    ProteinInputComponent,
    PluralPipe,
    SelectInputComponent,
    HelpLinkComponent
  ],
  entryComponents: [ConfirmDialogComponent]
})
export class SharedModule {}
