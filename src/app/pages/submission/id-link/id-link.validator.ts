import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IdLinkService } from './id-link.service';
import { IdLinkValueValidatorState } from './id-link.validator.directive';

const IDENTIFIER_REGEXP = /^([\w-.]+):([\w-.]+)$/;
const URL_REGEXP = /^(http|https|ftp):\/\/.+$/;

/**
 * Custom validator factory for universal links, the latter comprising a full URL or a prefix:ID number.
 *
 * @param service - API service used for validating prefix:ID links.
 * @returns Routine for validation.
 */
export function idLinkValidator(service: IdLinkService, state: IdLinkValueValidatorState): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value: string = (control.value || '').trim();
    const isLink: boolean = URL_REGEXP.test(value);
    const isIdentifier: boolean = IDENTIFIER_REGEXP.test(value);

    state.isId = false;
    state.url = '';

    if (isIdentifier) {
      return service.validate(value).pipe(
        map((res) => {
          // The response has a URL => the link is valid
          if (res.compactIdentifierResolvedUrl) {
            state.isId = true;
            state.url = res.compactIdentifierResolvedUrl;

            return null;
          }

          return { format: true };
        }),
        // If identifers.org isn't responding don't mark the field as invalid
        catchError(() => of(null))
      );
    }

    if (isLink) {
      return of(null);
    }

    // If the entered value isn't a link or identifier then mark the field as invalid.
    return of({ format: true });
  };
}
