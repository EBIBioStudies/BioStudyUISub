import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContainerRootComponent } from './container-root.component';
import { AuthContainerComponent } from './auth-container.component';
import { ORCIDInputBoxComponent } from './orcid-input-box/orcid-input-box.component';
import { FileUploadButtonComponent } from './file-upload-button/file-upload-button.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ValidateOnBlurDirective } from './validate-onblur.directive';
import { StripHtmlPipe } from './strip-html.pipe';
import { DateFormatDirective } from './date-format.directive';
import { DateInputComponent } from './date-input/date-input.component';
import { DNAInputComponent } from './dna-input/dna-input.component';
import { ProteinInputComponent } from './protein-input/protein-input.component';
import { PluralPipe } from './plural.pipe';
import { ModalService } from './modal.service';
import { ServerSentEventService } from './server-sent-event.service';
import { SelectInputComponent } from './select-input/select-input.component';

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
  providers: [
    ModalService,
    ServerSentEventService
  ],
  declarations: [
    ContainerRootComponent,
    AuthContainerComponent,
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
    SelectInputComponent
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
    AuthContainerComponent,
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
    SelectInputComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule {
}
