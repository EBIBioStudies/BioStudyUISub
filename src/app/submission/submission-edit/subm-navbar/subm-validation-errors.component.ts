import { Component, Input } from '@angular/core';
import { SectionValidationError, SubmValidationErrors } from 'app/submission/submission-shared/model';

@Component({
  selector: 'st-subm-validation-errors',
  templateUrl: './subm-validation-errors.component.html'
})
export class SubmValidationErrorsComponent {
  @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;

  get hasFieldValidationErrors(): boolean {
    const fieldErrors: (string | SectionValidationError)[] = this.errors.errors.filter(
      (error) => !(error instanceof SectionValidationError)
    );

    return fieldErrors.length > 0;
  }

  get sectionErrorsMsg(): Array<string> {
    const sectionErrors: (string | SectionValidationError)[] = ([] = this.errors.errors.filter(
      (error) => error instanceof SectionValidationError
    ));

    return sectionErrors.map((error) => (error as SectionValidationError).message);
  }
}
