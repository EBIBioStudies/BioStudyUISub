import {AsyncValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {IdLinkService} from './id-link.service';

const VALUE_REGEXP = /^([\w-.]+):([\w-.]+)$/;
const URL_REGEXP = /^(http|https|ftp):\/\/.+$/;

let prevLink: string[] = ['', ''];                        //previous prefix and ID parts of the link
let prevResult: ValidationErrors = null;                  //last validation result

export function idLinkValidator(service: IdLinkService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const value = (control.value || '').trim();       //value of the control
        let currLinkMatches;                              //matched parts of the link
        let currLink;                                     //current prefix and ID parst of the link

        //If the control's value is empty or a well-formed URL, signal no error to the outside world.
        if (!value.length || URL_REGEXP.test(value)) {
            return Observable.of(null);
        }

        //If the control's value is a well-formed prefix:identifier, validate it against Identifier.org
        currLinkMatches = value.match(VALUE_REGEXP);
        if (currLinkMatches && currLinkMatches.length === 3) {

            //To save on requests, make sure the prefix is a known one. Otherwise, it's clear the link is invalid.
            if (service.prefixes.length && service.prefixes.indexOf(currLinkMatches[1]) == -1) {
                return Observable.of({pattern: true});
            }

            //Validation requests are made only once for the same invalid link. Otherwise, the last result is provided.
            currLink = currLinkMatches.slice(1);
            if (currLink.join() != prevLink.join()) {
                prevLink = currLink;
                return service.validate(currLink[0], currLink[1]).map(res => {
                    if (res['message']) {
                        prevResult = {pattern: true};
                    } else {
                        prevResult = null;
                    }
                    return prevResult;
                });
            }
            return Observable.of(prevResult);
        }

        //The control's value is neither a valid URL nor a valid prefix:identifier link
        return Observable.of({pattern: true});
    };
}