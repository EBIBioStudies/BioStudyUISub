import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { Field } from 'app/submission/submission-shared/model/submission/submission.model';
import { CustomFormControl } from './model/custom-form-control.model';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { AsyncValidatorFn, ValidationErrors } from '@angular/forms';

type ValidatorFn = (
  control: CustomFormControl,
  submService: SubmissionService,
  studyAccno: string
) => Observable<ValidationErrors>;

export class FormValueValidator {
  validatorNameToFnMap = {
    forStudyTitle: this.forStudyTitle,
    forFileList: this.forFileList
  };

  forAsyncFieldValue(field: Field, submService: SubmissionService, studyAccno: string): AsyncValidatorFn {
    const asyncValueValidatorName = field.type.asyncValueValidatorName;

    if (asyncValueValidatorName !== null && asyncValueValidatorName.length > 0) {
      const validator: ValidatorFn = this.validatorNameToFnMap[asyncValueValidatorName];

      if (validator) {
        return (control: CustomFormControl) => validator(control, submService, studyAccno);
      }
    }

    return () => Promise.resolve(null);
  }

  private forStudyTitle(
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<ValidationErrors | null> {
    return submService.getSubmissions(true, { keywords: control.value }).pipe(
      map((submissions) => {
        const differentSubmissions = submissions.filter((submission) => submission.accno !== studyAccno);
        control.warningMessages =
          differentSubmissions.length > 0
            ? { uniqueSubmission: { value: control.value, payload: differentSubmissions } }
            : {};

        return null;
      }),
      catchError(() => of(null)),
      first()
    );
  }

  private forFileList(control: CustomFormControl, submService: SubmissionService): Observable<ValidationErrors> {
    return submService.validateFileList(control.value).pipe(
      map(({ log }) => {
        const { message } = log;

        control.errorMessages = {
          fileListNotValid: message
        };

        return { fileListNotValid: true };
      })
    );
  }
}
