import {FormControl, ValidationErrors} from '@angular/forms';
import {Component, Input} from '@angular/core';
import {ServerError} from '../../../../http';


@Component({
    selector: 'subm-check-sidebar',
    templateUrl: './subm-check-sidebar.component.html'
})
export class SubmCheckSidebarComponent {
    @Input() invalidControls: Array<FormControl>[] = [];
    @Input() isLoading: boolean = false;
    @Input() isSubmitting: boolean = false;
    @Input() collapsed?: boolean = false;
    @Input() serverError?: ServerError;

    /**
     * Determines the abbreviated text matching a certain error key.
     * @param {ValidationErrors} errors Set of error keys.
     * @returns {string} Abbreviated text
     */
    tipText(errors: ValidationErrors): string {
        if (errors.required) {
            return 'blank';
        } else if (errors.maxlength) {
            return 'too long';
        } else if (errors.minlength) {
            return 'too short';
        } else if (errors.pattern) {
            return 'wrong format';
        } else if (errors.unique) {
            return 'not unique'
        }
        return Object.keys(errors)[0];
    }

    /**
     * Scrolls to and sets focus on the field represented by the form control clicked on within the check tab.
     * @param {Event} event - Click event object
     * @param {FieldControl} control - Form control augmented with the DOM element for the field.
     */
    onReviewClick(event: Event, control: FormControl) {
        const controlEl = (<any>control).nativeElement;
        console.log(controlEl);
        if (!controlEl) {
            return;
        }
        const buttonEl = <HTMLElement>event.target;
        let scrollTop = controlEl.getBoundingClientRect().top - buttonEl.getBoundingClientRect().top;

        //Prevents the submission topbar from overlapping the control's label area if it's at the top.
        //if (this.formControls.indexOf(control) == 0) {
        //    scrollTop -= 25;
        //}

        window.scrollBy(0, scrollTop);
        controlEl.querySelectorAll('input, select, textarea')[0].focus();
    }

    /**
     * Determines the text corresponding to a certain error status in the event of no message being provided already.
     * @returns {string} Descriptive text for the error.
     */
    errorMsg(): string {
        const error = this.serverError;

        if (!error) {
            return '';
        }

        if (error.message) {
            return error.message;
        } else switch (error.status) {
            case 401:
                return 'Authorisation error';
            case 403:
                return 'Forbidden access';
            case 404:
                return 'Submission not found';
            case 500:
                return 'Server error';
            default:
                return 'Error encountered';
        }
    }

}