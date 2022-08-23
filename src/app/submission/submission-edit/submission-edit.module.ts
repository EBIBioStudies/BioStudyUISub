import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { FileModule } from 'app/file/file.module';
import { ThemeModule } from 'app/theme/theme.module';
import { PubMedIdSearchModule } from '../pubmedid-search/pubmedid-search.module';
import { SubmissionOtherModule } from '../submission-other/submission-other.module';
import { SubmissionResultsModule } from '../submission-results/submission-results.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { Camelcase2LabelPipe } from './shared/camelcase-to-label.pipe';
import { SubmEditService } from './shared/subm-edit.service';
import { BootstrapValidationDirective } from './shared/bootstrap-validation.directive';
import { RemoveHostDirective } from './shared/remove-host.directive';
import { TextareaAutosizeDirective } from './shared/textarea-autosize.directive';
import { UniqueValidator } from './shared/unique.directive';
import { SubmissionEditComponent } from './submission-edit.component';
import { TableComponent } from './subm-form/table/table.component';
import { SingleColumnTableComponent } from './subm-form/table/single-column-table.component';
import { PasteTableDataModalComponent } from './subm-form/table/paste-table-data-modal.component';
import { SubmTableComponent } from './subm-form/table/subm-table.component';
import { SubmFieldComponent } from './subm-form/field/subm-field.component';
import { InlineEditComponent } from './subm-form/inline-edit/inline-edit.component';
import { InputValueComponent } from './subm-form-input/input-value.component';
import { SubmFormComponent } from './subm-form/subm-form.component';
import { SubmNavBarComponent } from './subm-navbar/subm-navbar.component';
import { SubmValidationErrorsComponent } from './subm-navbar/subm-validation-errors.component';
import { AddSubmTypeModalComponent } from './subm-sidebar/add-subm-type-modal/add-subm-type-modal.component';
import { SubmCheckSidebarComponent } from './subm-sidebar/subm-check-sidebar/subm-check-sidebar.component';
import { SubmEditSidebarComponent } from './subm-sidebar/subm-edit-sidebar/subm-edit-sidebar.component';
import { SubmSidebarComponent } from './subm-sidebar/subm-sidebar.component';
import { IdLinkComponent } from './id-link/id-link.component';
import { IdLinkValueValidatorDirective } from './id-link/id-link.validator.directive';
import { IdLinkService } from './id-link/id-link.service';
import { SubmResubmitModalComponent } from './subm-navbar/subm-resubmit-modal.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FieldDocsModalComponent } from './field-docs-modal/field-docs-modal.component';
import { HelpContextualComponent } from './field-docs-modal/help-contextual/help-contextual.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    RouterModule,
    FileModule,
    SubmissionSharedModule,
    SubmissionResultsModule,
    SubmissionOtherModule,
    PubMedIdSearchModule,
    ThemeModule,
    TooltipModule,
    PopoverModule,
    TypeaheadModule,
    TabsModule
  ],
  providers: [SubmEditService, IdLinkService],
  declarations: [
    SubmissionEditComponent,
    InputValueComponent,
    InlineEditComponent,
    SubmFormComponent,
    SubmFieldComponent,
    SubmTableComponent,
    SubmSidebarComponent,
    SubmEditSidebarComponent,
    SubmCheckSidebarComponent,
    SubmNavBarComponent,
    SubmValidationErrorsComponent,
    AddSubmTypeModalComponent,
    TableComponent,
    SingleColumnTableComponent,
    PasteTableDataModalComponent,
    Camelcase2LabelPipe,
    UniqueValidator,
    BootstrapValidationDirective,
    RemoveHostDirective,
    TextareaAutosizeDirective,
    IdLinkComponent,
    IdLinkValueValidatorDirective,
    SubmResubmitModalComponent,
    FieldDocsModalComponent,
    HelpContextualComponent
  ],
  exports: [SubmissionEditComponent, IdLinkComponent],
  entryComponents: [SubmValidationErrorsComponent, AddSubmTypeModalComponent]
})
export class SubmissionEditModule {}
