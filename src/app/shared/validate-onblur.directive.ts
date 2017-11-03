import {NgControl} from "@angular/forms";
import {Directive} from "@angular/core";

/**
 * Directive that Replicates "touched" flag behaviour beyond the first blur event. By default, once the latter happens,
 * "touched" is permanently set to true. Thus, it allows the flag to be used as a proxy indicator for blur and, by
 * extension, for resetting error feedback. The flag is only reset on key down, to avoid a situation where the
 * user loses track of what the error was in the first place.
 * Based on StackOverflow answer: {@link https://stackoverflow.com/a/39461544}
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
@Directive({
    selector: '[validate-onblur]',
    host: {
        '(keydown)': 'onKeyDown()',
        '(blur)': 'onBlur()'
    }
})
export class ValidateOnBlurDirective {
    constructor(public formControl: NgControl) {
    }

    onKeyDown() {
        this.formControl.control.markAsUntouched({onlySelf: false});
    }

    onBlur() {
        this.formControl.control.markAsTouched({onlySelf: true});
    }
}