import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, NgForm, ValidationErrors} from '@angular/forms';

import {Feature, Section} from '../../shared/submission.model';
import {SubmTypeAddDialogComponent} from '../submtype-add/submtype-add.component';
import {ConfirmDialogComponent} from 'app/shared/index';
import {UserData} from '../../../auth/user-data';
import {ServerError} from '../../../http/server-error.handler';
import {Observable, of, Subscription} from 'rxjs';
import {FieldControl, SectionForm} from '../subm-form/section-form';

/**
 * Submission item class aggregating its corresponding feature with UI-relevant metadata. It enables
 * items to be in an intermediate deletion state. It also abstracts the action logic on click.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
class SubmItem {
    feature: Feature;           //submission item
    icon?: string;               //class for fontawesome's icon representing the item
    private _deleted: boolean;  //is item marked for deletion?

    /**
     * Instantiates a submission item for a given feature with a certain icon.
     * @param {Feature} feature - Feature object for this item.
     */
    constructor(feature: Feature) {
        this.feature = feature;
        this._deleted = false;
    }

    get isDeleted(): boolean {
        return this._deleted;
    }

    /**
     * Marks the item as permanently deleted.
     */
    delete(): void {
        this._deleted = true;
    }

    /**
     * Cancels deletion if applicable.
     */
    reset(): void {
        this._deleted = false;
    }

    /**
     * Tests if the feature type can be changed
     * @returns {boolean} If true, the feature type can be changed.
     */
    isReadOnly(): boolean {
        return !this.feature.type.canModify;
    }

    /**
     * Automatically determines the appropriate action on click, adding a column and/or row according
     * to the type of table and/or number of existing columns.
     */
    onClick(): void {
        if (this.feature.singleRow) {
            this.feature.addColumn();
            return;
        }

        if (this.feature.colSize() === 0) {
            this.feature.addColumn();
        }

        this.feature.addRow();
    }
}

/**
 * Collection class for submission items with a global flag for pending deletions. Items are only
 * permanently deleted when removed from the collection.
 * Class pattern loosely based on convention for global prototypes created by SimonTest:
 * {@link https://blog.simontest.net/extend-array-with-typescript-965cc1134b3}
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
class SubmItems extends Array<SubmItem> {
    private _isDeletion: boolean;    //has any of the items been deleted?

    /**
     * Instantiates a collection of submission items. Private to prevent erroneous extension.
     * @param {Array<SubmItem>} [items] - Optional literal of initial items.
     */
    private constructor(items?: Array<SubmItem>) {
        super(...items || []);
        this._isDeletion = false;
    }

    /**
     * Factory to ensure prototypal inheritance.
     * @returns {SubmItems} Collection of submission items.
     */
    static create(): SubmItems {
        return Object.create(SubmItems.prototype);
    }

    get isDeletion(): boolean {
        return this._isDeletion;
    }

    /**
     * Removes a given item from the collection, flagging it globally for the collection.
     * @param {number} itemIdx - Array index of the item to be removed.
     */
    delete(itemIdx: number): void {
        this[itemIdx].delete();
        this._isDeletion = true;
    }

    /**
     * Gets items within the collection that are pending deletion.
     * @returns {SubmItem[]} Collection of items flagged for deletion.
     */
    getDeleted(): SubmItem[] {
        return this.filter((item) => {
            return item.isDeleted
        });
    }

    /**
     * Resets both the item and collection-level flags, effectively cancelling all
     * pending deletions.
     */
    reset(): void {
        this.forEach((item) => item.reset());
        this._isDeletion = false;
    }
}

@Component({
    selector: 'subm-sidebar',
    templateUrl: './subm-sidebar.component.html',
    styleUrls: ['./subm-sidebar.component.css']
})
export class SubmSideBarComponent implements OnChanges {
    @Input() isLoading: boolean = false;                                             //flag indicating the submission is being loaded
    @Input() isSubmitting: boolean = false;                                  //flag indicating submission data is being sent
    @Input() collapsed?: boolean = false;                                     //flag indicating if menu is minimized/collapsed
    @Input() sectionForm?: SectionForm;
    @Input() serverError?: ServerError;                                       //errors from server requests
    @Output() toggle? = new EventEmitter();                                  //event triggered when collapsed state changes

    @ViewChild('addDialog') addDialog?: SubmTypeAddDialogComponent;
    @ViewChild('confirmDialog') confirmDialog?: ConfirmDialogComponent;

    isAdvancedOpen: boolean = false; //flag indicating if advanced options for types are being displayed
    isCheckTabActive: boolean = true;        //flag indicating if form status or "check" tab is being displayed
    isEditModeOn: boolean = false;        //flag indicating component's mode: display or editing, with different renderings
    items?: SubmItems;                //current collection of feature/subsection items
    iconMap: any = {};               //lookup table for icons

    private subscr?: Subscription;

    private invalidControls: FormControl[] = [];

    constructor(public userData: UserData) {
    }

    get isAddTabActive(): boolean {
        return !this.isCheckTabActive;
    }

    get isEditModeOff(): boolean {
        return !this.isEditModeOn;
    }

    get isAdvancedClosed(): boolean {
        return !this.isAdvancedOpen;
    }

    onCheckTabClick(): void {
        this.isCheckTabActive = true;
    }

    onAddTabClick(): void {
        this.isCheckTabActive = false;
    }

    private updateInvalidControlList(form: FormGroup) {
        this.invalidControls = this.listControls(form)
            .filter(control => control.invalid)
            .reverse();
    }

    listControls(control: AbstractControl): FormControl[] {
        if (control instanceof FormGroup) {
            const map = (<FormGroup>control).controls;
            return Object.keys(map)
                .map(key => map[key])
                .flatMap(control => this.listControls(control));
        }
        else if (control instanceof FormArray) {
            const array = (<FormArray>control).controls;
            return array.flatMap(control => this.listControls(control));
        }
        return [<FormControl>control];
    }

    ngOnInit() {
        if (this.sectionForm) {
            const form = this.sectionForm.form;
            form.valueChanges.subscribe(() => this.updateInvalidControlList(form));
            this.updateInvalidControlList(form);
        }
    }

    /**
     * Updates the list of type items whenever a feature is added or removed, cleaning up subscriptions if necessary
     * @param changes -  Object of current and previous property values.
     */
    ngOnChanges(changes: any): void {
        if (changes.sectionForm) {
            if (this.sectionForm) {
                const form = this.sectionForm.form;
                form.valueChanges.subscribe(() => this.updateInvalidControlList(form));
                this.updateInvalidControlList(form);

                this.onItemsChange();
            }
        }
    }

    ngDoCheck() {
        /*  this.numPending = FieldControl.numPending;
          this.numInvalid = FieldControl.numInvalid;*/
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
     * Provided it is valid, it saves the form data onto the model's respective properties on submission.
     * The operation requires the user's confirmation if items have been deleted.
     * @param {NgForm} form Object generated from type name fields.
     */
    onSubmit(form: NgForm): void {
        let confirmShown = of(true);     //dummy observable in case modal not shown
        let deleted;                                //collection of items marked for deletion
        let isPlural;                               //more than one item is being deleted?

        //Only submits if no field has errors.
        //NOTE: disabled fields are not validated as per Angular's default behaviour. Therefore, the VALID/INVALID
        //fields cannot be relied on in this case.
        if (!form.errors) {

            //Removes features marked as deleted, showing a confirmation dialogue if applicable.
            if (this.items!.isDeletion) {
                deleted = this.items!.getDeleted();
                isPlural = deleted.length > 1;

                confirmShown = this.confirm(`The submission 
                    ${isPlural ? `items` : `item`} with type
                    ${deleted.map(({feature}) => `"${feature.typeName}"`).join(', ')} 
                    ${isPlural ? `have` : `has`} been deleted. If you proceed, 
                    ${isPlural ? `they` : `it`} will be removed from the
                    list of items and any related features or sections will be permanently deleted.`);

                confirmShown.subscribe((isConfirmed: boolean) => {
                    if (isConfirmed) {
                        deleted.forEach(({feature}) => {
                            this.sectionForm!.section.features.remove(feature);
                        });
                    } else {
                        this.items!.reset();
                    }
                });
            }

            //Scalar changes are only applied if deletion confirmed in the first place.
            //Otherwise, it doesn't apply any changes.
            confirmShown.subscribe((isConfirmed: boolean) => {
                if (form.dirty && form.valid && isConfirmed) {
                    Object.keys(form.value).forEach((key) => {
                        this.sectionForm!.section.features.find(key)!.typeName = form.value[key];
                    }, this);
                }

                //If items deleted but not confirmed, it stays on edit mode
                isConfirmed && this.onEditModeToggle();
            });

            //Triggers validation of all fields at once.
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({onlySelf: true});
            });
        }
    }

    /**
     * Renders the confirmation dialogue, internally creating a new reactive stream.
     * @param {string} message - Text to be shown within the dialogue's body section.
     * @returns {Observable<any>} Reactive stream for listening to confirmation event.
     */
    private confirm(message: string): Observable<any> {
        return this.confirmDialog!.confirm(message, false);
    }

    /**
     * Cancels any pending deletion and goes back to display mode.
     * @param {Event} [event] - Optional click event object.
     */
    onCancelChanges(event?: Event): void {
        if (this.items!.isDeletion) {
            this.items!.reset();
        }
        this.onEditModeToggle(event);
    }

    /**
     * Transitions between the display/edit mode by changing a flag.
     * @param {Event} [event] - Optional click event object. If passed in, bubbling is prevented.
     */
    onEditModeToggle(event?: Event): void {
        event && event.preventDefault();
        this.isEditModeOn = !this.isEditModeOn;
    }

    /**
     * Renders the new type dialogue that allows the user to choose what type is to be added.
     * @param {Event} event - Click event object, the bubbling of which will be prevented
     */
    onNewTypeClick(event: Event): void {
        event.preventDefault();
        this.addDialog!.show();
    }

    /**
     * Removes the submission item from the list of controls and marks it for deletion.
     * @param {Event} event - Click event object.
     * @param {FormControl[]} controls - Array of controls making up the component's form.
     * @param {string} nameInput - Name of the input control corresponding to the item being removed.
     * @param {number} itemIdx - Index of control for the item being removed.
     */
    onItemDelete(event: Event, nameInput: string, controls: FormControl[], itemIdx: number): void {
        event.preventDefault();
        this.items!.delete(itemIdx);
        delete controls[nameInput];
    }

    /**
     * Resets the submission item collection to the current section's annotations and features.
     */
    onItemsChange(): void {
        this.items = SubmItems.create();

        //Builds the item collection
        this.items.push(new SubmItem(this.sectionForm!.section.annotations));
        this.sectionForm!.section.features.list().forEach((feature) => {
            this.items!.push(new SubmItem(feature))
        });

        //Indexes icons by type name
        this.iconMap = {};
        this.items.forEach((item) => {
            this.iconMap[item.feature.typeName] = item.feature.type.icon;
        });
    }

    /**
     * Opens/closes the collapsible box for advanced type options.
     */
    toggleAdvanced() {
        this.isAdvancedOpen = !this.isAdvancedOpen;
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