import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AlertModule,
  BsDatepickerModule,
  BsDropdownModule,
  CollapseModule,
  ModalModule,
  PopoverModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ContainerRootComponent } from './container-root.component';
import { ContainerMdComponent } from './container-md.component';
import { ORCIDInputBoxComponent } from './orcid-input-box.component';
import { FileUploadButtonComponent } from './file-upload-button.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { FilterPipe, MultiSelectComponent } from './multi-select.component';
import { ValidateOnBlurDirective } from './validate-onblur.directive';
import { StripHtmlPipe } from './strip-html.pipe';
import { DateFormatDirective } from './date-format.directive';
import { DateInputComponent } from './date-input.component';
import { DNAInputComponent } from './dna-input.component';
import { ProteinInputComponent } from './protein-input.component';
import { PluralPipe } from './plural.pipe';
import { ModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule,
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
    ModalService
  ],
  declarations: [
    ContainerRootComponent,
    ContainerMdComponent,
    ORCIDInputBoxComponent,
    FileUploadButtonComponent,
    ConfirmDialogComponent,
    MultiSelectComponent,
    FilterPipe,
    StripHtmlPipe,
    ValidateOnBlurDirective,
    DateFormatDirective,
    DateInputComponent,
    DNAInputComponent,
    ProteinInputComponent,
    PluralPipe
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
    ContainerMdComponent,
    ORCIDInputBoxComponent,
    FileUploadButtonComponent,
    ConfirmDialogComponent,
    MultiSelectComponent,
    FilterPipe,
    StripHtmlPipe,
    ValidateOnBlurDirective,
    DateFormatDirective,
    DateInputComponent,
    DNAInputComponent,
    ProteinInputComponent,
    PluralPipe
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class SharedModule {
}
