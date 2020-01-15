import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FileModule } from 'app/pages/file/file.module';
import { IdLinkModule } from '../id-link/id-link.module';
import { PubMedIdSearchModule } from '../pubmedid-search/pubmedid-search.module';
import { SubmissionOtherModule } from '../submission-other/submission-other.module';
import { SubmissionResultsModule } from '../submission-results/submission-results.module';
import { SubmissionSharedModule } from '../submission-shared/submission-shared.module';
import { Camelcase2LabelPipe } from './shared/camelcase-to-label.pipe';
import { SubmEditService } from './shared/subm-edit.service';
import { TextareaAutosizeDirective } from './shared/textarea-autosize.directive';
import { UniqueValidator } from './shared/unique.directive';
import { SubmissionEditComponent } from './submission-edit.component';
import { FeatureGridComponent } from './subm-form/feature/feature-grid.component';
import { FeatureListComponent } from './subm-form/feature/feature-list.component';
import { SubmFeatureComponent } from './subm-form/feature/subm-feature.component';
import { SubmFieldComponent } from './subm-form/field/subm-field.component';
import { InlineEditComponent } from './subm-form/inline-edit/inline-edit.component';
import { InputValueComponent } from './subm-form/input-value/input-value.component';
import { NativeElementAttachDirective } from './subm-form/native-element-attach.directive';
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
    PubMedIdSearchModule
  ],
  providers: [
    SubmEditService
  ],
  declarations: [
    SubmissionEditComponent,
    InputValueComponent,
    InlineEditComponent,
    SubmFormComponent,
    SubmFieldComponent,
    SubmFeatureComponent,
    SubmSidebarComponent,
    SubmEditSidebarComponent,
    SubmCheckSidebarComponent,
    SubmNavBarComponent,
    SubmValidationErrorsComponent,
    AddSubmTypeModalComponent,
    FeatureGridComponent,
    FeatureListComponent,
    Camelcase2LabelPipe,
    UniqueValidator,
    NativeElementAttachDirective,
    TextareaAutosizeDirective
  ],
  exports: [
    SubmissionEditComponent
  ],
  entryComponents: [
    SubmValidationErrorsComponent,
    AddSubmTypeModalComponent
  ]
})
export class SubmissionEditModule {
}
