import {Component, DoCheck, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {ServerError} from '../../../http/server-error.handler';
import {Subscription} from 'rxjs';
import {FieldControl, SectionForm} from '../subm-form/section-form';

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSidebarComponent implements OnChanges, DoCheck {
    @Input() isLoading: boolean = false;                                             //flag indicating the submission is being loaded
    @Input() isSubmitting: boolean = false;                                  //flag indicating submission data is being sent
    @Input() collapsed?: boolean = false;                                     //flag indicating if menu is minimized/collapsed
    @Input() sectionForm?: SectionForm;
    @Input() serverError?: ServerError;                                       //errors from server requests
    @Output() toggle? = new EventEmitter();                                  //event triggered when collapsed state changes

    isCheckTabActive: boolean = true;        //flag indicating if form status or "check" tab is being displayed
    numInvalid: number = 0;
    numInvalidAndTouched: number = 0;

    private subscr?: Subscription;

    private invalidControls: FormControl[] = [];

    get isEditTabActive(): boolean {
        return !this.isCheckTabActive;
    }

    onCheckTabClick(): void {
        this.isCheckTabActive = true;
    }

    onAddTabClick(): void {
        this.isCheckTabActive = false;
    }

    ngOnInit() {
        this.onSectionFormUpdate();
    }

    ngDoCheck() {
        this.numInvalidAndTouched = this.invalidControls.filter(c => c.touched).length;
        this.numInvalid = this.invalidControls.length;
    }

    /**
     * Handler for the button toggling the collapsed state of the whole sidebar menu,
     * bubbling the menu's state up.
     * @param {Event} [event] - Optional click event object.
     */
    onToggleCollapse(event?: Event): void {
        event && event.preventDefault();
        this.toggle && this.toggle.emit();
    }

    /**
     * Updates the list of type items whenever a feature is added or removed, cleaning up subscriptions if necessary
     * @param changes -  Object of current and previous property values.
     */
    ngOnChanges(changes: any): void {
        if (changes.sectionForm) {
            this.onSectionFormUpdate();
        }
    }

    private onSectionFormUpdate() {
        if (this.subscr) {
            this.subscr.unsubscribe();
            this.subscr = undefined;
        }

        if (this.sectionForm !== undefined) {
            this.subscr = this.sectionForm.structureChanges$.subscribe(() => {
                this.invalidControls = this.sectionForm!.invalidControls();
            });
        }
    }

    /**
     * Scrolls to and sets focus on the field represented by the form control clicked on within the check tab.
     * @param {Event} event - Click event object
     * @param {FieldControl} control - Form control augmented with the DOM element for the field.
     */
    onReviewClick(event: Event, control: FormControl) {
        const controlEl = (<any>control).nativeElement;
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

    /**
     * Determines the unit of addition when clicking a type add button.
     * @param {number} featureSize - Feature's number of rows.
     * @returns {string} Name of the smallest element to be added.
     */
    addUnit(featureSize: number): string {
        if (featureSize > 0) {
            return 'row';
        } else {
            return 'table';
        }
    }

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
        } else if (errors.uniqueColumn) {
            return 'not unique'
        }
        return Object.keys(errors)[0];
    }
}