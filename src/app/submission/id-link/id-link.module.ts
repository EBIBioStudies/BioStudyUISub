import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TypeaheadModule } from 'ngx-bootstrap';
import { IdLinkComponent } from './id-link.component';
import { IdLinkValueValidatorDirective } from './id-link.validator.directive';
import { IdLinkService } from './id-link.service';

@NgModule({
  declarations: [
    IdLinkComponent,
    IdLinkValueValidatorDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TypeaheadModule.forRoot(),
  ],
  providers: [
    IdLinkService
  ],
  exports: [
    IdLinkComponent
  ]
})
export class IdLinkModule {
}
