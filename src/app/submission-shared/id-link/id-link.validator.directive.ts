import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Directive} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IdLinkService} from './id-link.service';
import {idLinkValidator} from './id-link.validator';

@Directive({
    selector: '[idLinkValue][formControlName],[idLinkValue][formControl], [idLinkValue][ngModel]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: IdLinkValueValidatorDirective, multi: true}]
})
export class IdLinkValueValidatorDirective implements AsyncValidator {
    extra: any;                     //Dynamic link properties determined after validation.
    prev: any;                      //Cache for past validation process.

    /**
     * Initialises the dynamic and cached properties to those matching an invalid empty link.
     * @param {IdLinkService} linkService - Singleton API service for Identifier.org.
     */
    constructor(private linkService: IdLinkService) {
        this.extra = {
            url: '',                //current valid URL (be it conventional or prefix:ID
            isId: false             //indicates if the current link is a valid prefix:ID
        };
        this.prev = {
            link: ['', ''],         //previous prefix and ID parts of the link
            url: '',                //previous valid URL
            error: null             //previous error object after validation
        };
    }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return idLinkValidator(this.linkService, this.extra, this.prev)(control);
    }
}
