import { Component, Input } from '@angular/core';
import { SubmValidationErrors } from 'app/pages/submission/submission-shared/model';

@Component({
  selector: 'st-subm-validation-errors',
  templateUrl: './subm-validation-errors.component.html'
})
export class SubmValidationErrorsComponent {
  @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;

  get errorList(): Array<string> {
    return this.errors.errors;
  }
}
