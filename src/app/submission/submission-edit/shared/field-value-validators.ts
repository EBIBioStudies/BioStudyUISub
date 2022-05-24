import { Observable, of, timer } from 'rxjs';
import { catchError, finalize, first, map, switchMap } from 'rxjs/operators';
import { CustomFormControl } from './model/custom-form-control.model';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { ValidationErrors } from '@angular/forms';

const DELAY_IN_MILLISECONDS = 500;

export class FormValueValidator {
  static forStudyTitle(
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<ValidationErrors | null> {
    return timer(DELAY_IN_MILLISECONDS).pipe(
      switchMap(() => submService.getSubmissions(true, { keywords: control.value })),
      map((submissions) => {
        const differentSubmissions = submissions.filter((submission) => submission.accno !== studyAccno);
        control.warningMessages =
          differentSubmissions.length > 0
            ? { uniqueSubmission: { value: control.value, payload: differentSubmissions } }
            : {};

        return null;
      }),
      catchError(() => of(null)),
      first(),
      finalize(() => {
        control.root.updateValueAndValidity({ onlySelf: true });
      })
    );
  }

  static forFileList(control: CustomFormControl, submService: SubmissionService): Observable<ValidationErrors> {
    if (!control.touched) {
      return of({});
    }

    return timer(DELAY_IN_MILLISECONDS).pipe(
      switchMap(() => submService.validateFileList(control.value)),
      catchError(({ error }) => {
        const {
          log: { message }
        } = error;

        control.errorMessages = {
          fileListNotValid: message
        };

        return of({ fileListNotValid: true });
      }),
      map((validation) => validation),
      finalize(() => {
        control.markAllAsTouched();
        control.root.updateValueAndValidity({ onlySelf: true });
      })
    );
  }
}
