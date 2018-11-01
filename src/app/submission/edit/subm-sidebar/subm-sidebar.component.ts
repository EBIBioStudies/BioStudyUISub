import {Component, DoCheck, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {ServerError} from '../../../http/server-error.handler';
import {Subject, Subscription} from 'rxjs';
import {FieldControl, SectionForm} from '../section-form';
import {MyFormControl} from '../form-validators';
import {throttleTime} from 'rxjs/operators';

type FormControlGroup = Array<FormControl>;

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSidebarComponent implements OnChanges {
    @Input() isLoading: boolean = false;                                             //flag indicating the submission is being loaded
    @Input() isSubmitting: boolean = false;                                  //flag indicating submission data is being sent
    @Input() collapsed?: boolean = false;                                     //flag indicating if menu is minimized/collapsed
    @Input() sectionForm?: SectionForm;
    @Input() serverError?: ServerError;                                       //errors from server requests
    @Output() toggle? = new EventEmitter();                                  //event triggered when collapsed state changes

    isCheckTabActive: boolean = true;        //flag indicating if form status or "check" tab is being displayed
    invalidControls: FormControlGroup[] = [];

    private unsubscribe: Subject<void> = new Subject<void>();

    private controls: Array<FormControl>[] = [];

    get isEditTabActive(): boolean {
        return !this.isCheckTabActive;
    }

    get numInvalid(): number {
        return this.invalidControls.flatMap(c => c).length;
    }

    get numInvalidAndTouched(): number {
        return this.invalidControls.flatMap(c => c).filter(c => c.touched).length;
    };

    onCheckTabClick(): void {
        this.isCheckTabActive = true;
    }

    onAddTabClick(): void {
        this.isCheckTabActive = false;
    }

    ngOnInit() {
        this.onSectionFormUpdate();
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
        this.unsubscribe.next();

        if (this.sectionForm !== undefined) {
            this.sectionForm.structureChanges$.takeUntil(this.unsubscribe).subscribe(() => {
                this.controls = this.groupControlsBySectionId(this.sectionForm!.controls());
                this.updateInvalidControls();
            });

            this.sectionForm.form.valueChanges.takeUntil(this.unsubscribe).pipe(throttleTime(1000)).subscribe(() => {
                this.updateInvalidControls();
            });
        }
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

    private updateInvalidControls() {
        this.invalidControls =
            this.controls.map(g => g.filter(c => c.invalid)).filter(g => !g.isEmpty());
    }
}