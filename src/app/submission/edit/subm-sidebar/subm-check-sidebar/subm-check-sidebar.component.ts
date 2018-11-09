import {FormControl, ValidationErrors} from '@angular/forms';
import {Component, Input, OnDestroy} from '@angular/core';
import {ServerError} from '../../../../http';
import {SubmEditService} from '../../subm-edit.service';
import {MyFormControl} from '../../form-validators';
import {Subject, Subscription} from 'rxjs';
import {Option} from 'fp-ts/lib/Option';
import {SectionForm} from '../../section-form';
import {throttleTime} from 'rxjs/operators';

type FormControlGroup = Array<FormControl>;

@Component({
    selector: 'subm-check-sidebar',
    templateUrl: './subm-check-sidebar.component.html'
})
export class SubmCheckSidebarComponent implements OnDestroy {
    @Input() collapsed?: boolean = false;

    serverError?: ServerError;
    invalidControls: FormControlGroup[] = [];

    private controls: Array<FormControl>[] = [];
    private unsubscribe = new Subject<void>();
    private unsubscribeForm = new Subject<void>();

    constructor(private submEditService:SubmEditService) {
        this.submEditService.serverError$.takeUntil(this.unsubscribe)
            .subscribe(error => {
                this.serverError = ServerError.fromResponse(error);
            });

        this.submEditService.sectionSwitch$.takeUntil(this.unsubscribe)
            .subscribe(sectionForm => this.switchSection(sectionForm));
    }

    ngOnDestroy(): void {
        this.unsubscribeForm.next();
        this.unsubscribeForm.complete();

        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    get isLoading(): boolean {
        return this.submEditService.isLoading;
    }

    get isSubmitting(): boolean {
        return this.submEditService.isSubmitting;
    }

    get numInvalid(): number {
        return this.invalidControls.flatMap(c => c).length;
    }

    get numInvalidAndTouched(): number {
        return this.invalidControls.flatMap(c => c).filter(c => c.touched).length;
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
        if (control instanceof MyFormControl) {
            this.submEditService.scrollToControl(control);
        }
       // const buttonEl = <HTMLElement>event.target;
       // let scrollTop = controlEl.getBoundingClientRect().top - buttonEl.getBoundingClientRect().top;

        //Prevents the submission topbar from overlapping the control's label area if it's at the top.
        //if (this.formControls.indexOf(control) == 0) {
        //    scrollTop -= 25;
        //}

        //window.scrollBy(0, scrollTop);
        //controlEl.querySelectorAll('input, select, textarea')[0].focus();
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

    private switchSection(sectionFormOp: Option<SectionForm>) {
        this.unsubscribeForm.next();

        if (sectionFormOp.isSome()) {
            const secForm = sectionFormOp.toUndefined()!;
            secForm.structureChanges$.takeUntil(this.unsubscribeForm).subscribe(
                () => {
                    this.controls = this.groupControlsBySectionId(secForm.controls());
                    this.updateInvalidControls();
                }
            );
            secForm.form.valueChanges.takeUntil(this.unsubscribeForm).pipe(throttleTime(1000)).subscribe(() => {
                this.updateInvalidControls();
            });

        }
    }

    private updateInvalidControls() {
        this.invalidControls =
            this.controls.map(g => g.filter(c => c.invalid)).filter(g => !g.isEmpty());
    }

    private groupControlsBySectionId(controls: FormControl[]): FormControlGroup[] {
        return controls
            .reduce((rv, c) => {
                const group = rv.isEmpty() ? undefined : rv[rv.length - 1];
                const prevControl = group === undefined ? undefined : group[group.length - 1];
                if (prevControl !== undefined && MyFormControl.compareBySectionId(prevControl, c) === 0) {
                    group!.push(c);
                } else {
                    rv.push([c]);
                }
                return rv;
            }, [] as Array<FormControlGroup>);
    }
}
