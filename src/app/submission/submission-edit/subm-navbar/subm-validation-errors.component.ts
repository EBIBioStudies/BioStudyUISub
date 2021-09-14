import { Component, Input } from '@angular/core';
import { SectionValidationError, SubmValidationErrors } from 'app/submission/submission-shared/model';

@Component({
  selector: 'st-subm-validation-errors',
  templateUrl: './subm-validation-errors.component.html'
})
export class SubmValidationErrorsComponent {
  @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;

  get hasValidationErrors(): boolean {
    return this.errors.total() > 0;
  }

  get sectionErrors(): Array<string> {
    const errors: (string | SectionValidationError)[] = this.errors.errors.filter(
      (error) => error instanceof SectionValidationError
    );

    return errors.map((error) => (error as SectionValidationError).message);
  }
}
