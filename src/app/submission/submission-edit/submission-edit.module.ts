import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SortablejsModule } from 'ngx-sortablejs';
import { SharedModule } from 'app/shared/shared.module';
import { FileModule } from 'app/file/file.module';
import { ThemeModule } from 'app/theme/theme.module';
import { IdLinkModule } from '../id-link/id-link.module';
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
import { ImportTableDataModalComponent } from './subm-form/table/import-table-data-modal.component';
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

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    FileModule,
    SubmissionSharedModule,
    SubmissionResultsModule,
    SubmissionOtherModule,
    IdLinkModule,
    PubMedIdSearchModule,
    SortablejsModule,
    ThemeModule
  ],
  providers: [SubmEditService],
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
    ImportTableDataModalComponent,
    Camelcase2LabelPipe,
    UniqueValidator,
    BootstrapValidationDirective,
    RemoveHostDirective,
    TextareaAutosizeDirective
  ],
  exports: [SubmissionEditComponent],
  entryComponents: [SubmValidationErrorsComponent, AddSubmTypeModalComponent]
})
export class SubmissionEditModule {}
