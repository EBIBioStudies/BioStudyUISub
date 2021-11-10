import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { Field } from 'app/submission/submission-shared/model/submission/submission.model';
import { CustomFormControl } from './model/custom-form-control.model';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';

type ValidatorFn = (control: CustomFormControl, submService: SubmissionService, studyAccno: string) => Observable<null>;

export class FormValueValidator {
  static forStudyTitle = (
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<null> => {
    return submService.getSubmissions(true, { keywords: control.value }).pipe(
      map((submissions) => {
        const differentSubmissions = submissions.filter((submission) => submission.accno !== studyAccno);
        control.warnings =
          differentSubmissions.length > 0
            ? { uniqueSubmission: { value: control.value, payload: differentSubmissions } }
            : {};

        return null;
      }),
      catchError(() => of(null)),
      first()
    );
  };

  static forFileList = (control: CustomFormControl, submService: SubmissionService) => {
    return submService.validateFileList(control.value);
  };

  static forAsyncFieldValue = (
    field: Field,
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<null> => {
    const asyncValueValidatorName = field.type.asyncValueValidatorName;

    if (asyncValueValidatorName !== null && asyncValueValidatorName.length > 0) {
      const validator: ValidatorFn = FormValueValidator[asyncValueValidatorName];

      if (validator) {
        return validator(control, submService, studyAccno);
      }
    }

    return of(null);
  };
}
