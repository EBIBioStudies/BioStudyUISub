import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';
import { IdLinkService } from './id-link.service';
import { Observable, of } from 'rxjs';

const VALUE_REGEXP = /^([\w-.]+):([\w-.]+)$/;
const URL_REGEXP = /^(http|https|ftp):\/\/.+$/;

/**
 * Custom validator factory for universal links, the latter comprising a full URL or a prefix:ID number.
 * @param {IdLinkService} service - API service used for validating prefix:ID links.
 * @param {Object} extra - Additional properties of links resolved dynamically after validation.
 * @param {Object} prev - Cached selection of values from the previous validation operation.
 * @returns {AsyncValidatorFn} Routine for validation.
 */
export function idLinkValidator(service: IdLinkService, extra: any, prev: any): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const value = (control.value || '').trim(); // value of the control
        let currLinkMatches; // matched parts of the link
        let currLink; // current prefix and ID parts of the link

        extra.url = '';
        extra.isId = false;

        // If the control's value is empty or a well-formed URL, signal no error to the outside world.
        if (!value.length || URL_REGEXP.test(value)) {
            extra.url = value;
            prev.url = value;
            return of(null);
        }

        // If the control's value is a well-formed prefix:identifier, validate it against Identifier.org
        currLinkMatches = value.match(VALUE_REGEXP);
        if (currLinkMatches && currLinkMatches.length === 3) {

            // To save on requests, make sure the prefix is a known one. Otherwise, it's clear the link is invalid.
            if (service.prefixes.length && service.prefixes.indexOf(currLinkMatches[1]) === -1) {
                return of({format: true});
            }

            // Validation requests are made only once for the same invalid link. Otherwise, the last result is provided.
            currLink = currLinkMatches.slice(1);
            if (currLink.join() !== prev.link.join()) {
                prev.link = currLink;
                return service.validate(currLink[0], currLink[1]).pipe(
                    map(res => {

                    // The response has a URL => the link is valid
                    if (res['compactIdentifierResolvedUrl']) {
                        extra.url = res['compactIdentifierResolvedUrl'];
                        extra.isId = true;
                        prev.url = res['compactIdentifierResolvedUrl'];
                        prev.error = null;

                    // The response is an error => the link is invalid
                    } else {
                        extra.url = '';
                        extra.isId = false;
                        prev.url = '';
                        prev.error = {format: true};
                    }
                    return prev.error;
                }));
            }

            // The validation request was for the same link => just outputs whatever previous outcome there was
            if (!prev.error) {
                extra.url = prev.url;
                extra.isId = true;
            }
            return of(prev.error);
        }

        // The control's value is neither a valid URL nor a valid prefix:identifier link
        return of({format: true});
    };
}
