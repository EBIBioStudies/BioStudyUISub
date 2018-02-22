import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnChanges,
    SimpleChange
} from '@angular/core';
import {
    NgForm,
    FormControl, ValidationErrors,
} from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {
    Section,
    Feature
} from '../../shared/submission.model';
import { SubmTypeAddDialogComponent } from '../submtype-add/submtype-add.component';
import { ConfirmDialogComponent } from 'app/shared/index';
import {SubmValidationErrors} from "../../shared/submission.validator";
import {FieldControl} from "../subm-form/subm-form.service";
import {UserData} from "../../../auth/user-data";

/**
 * Submission item class aggregating its corresponding feature with UI-relevant metadata. It enables
 * items to be in an intermediate deletion state. It also abstracts the action logic on click.
 *
 * @author Hector Casanova <hector@ebi.ac.uk>
 */
class SubmItem {
    feature: Feature;           //submission item
    icon: string;               //class for fontawesome's icon representing the item
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
        super(...items);
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
    @Input() collapsed? = false;                                             //flag indicating if menu is minimized/collapsed
    @Input() section: Section;                                               //section of the form being displayed
    @Input() formControls: FieldControl[] = [];                              //refreshed array of form controls
    @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;      //errors from validator service
    @Output() toggle? = new EventEmitter();                                  //event triggered when collapsed state changes

    @ViewChild('addDialog') addDialog: SubmTypeAddDialogComponent;
    @ViewChild('confirmDialog') confirmDialog: ConfirmDialogComponent;

    isAdvancedOpen: boolean = false; //flag indicating if advanced options for types are being displayed
    isStatus: boolean = true;        //flag indicating if form status or "check" tab is being displayed
    editing: boolean = false;        //flag indicating component's mode: display or editing, with different renderings
    items: SubmItems;                //current collection of feature/subsection items
    iconMap: any = {};               //lookup table for icons
    numPending: number = 0;          //number of modified fields still pending review (still invalid)

    private subscr: Subscription;

    constructor(public userData: UserData) {}

    /**
     * Updates the list of type items whenever a feature is added or removed.
     * @param changes -  Object of current and previous property values.
     */
    ngOnChanges(changes: any): void {
        const change: SimpleChange = changes.section;

        if (change) {
            if (this.subscr) {
                this.subscr.unsubscribe();
            }
            if (this.section !== undefined) {
                this.subscr = this.section.features
                    .updates()
                    .subscribe(ev => {
                        if (ev.name === 'feature_add' ||
                            ev.name === 'feature_remove') {
                            this.onItemsChange();
                        }
                    });
                this.onItemsChange();
            }
        }
    }

    /**
     * Updates the pending fields counter only after the digest cycle. Otherwise Angular predictably complains
     * the change happened too early.
     */
    ngDoCheck() {
        this.numPending = FieldControl.numPending;
    }

    /**
     * Handler for clicks on the sidebar's tabs.
     * @param {boolean} isStatus - Is the status tab to be displayed after click?
     */
    onTabClick(isStatus: boolean): void {
        this.isStatus = isStatus;
    }

    /**
     * Handler for the button toggling the collapsed state of the whole sidebar menu,
     * bubbling the menu's state up.
     * @param {Event} [event] - Optional click event object.
     */
    onToggleCollapse(event?:Event): void {
        event.preventDefault();
        this.toggle && this.toggle.emit();
    }

    /**
     * Provided it is valid, it saves the form data onto the model's respective properties on submission.
     * The operation requires the user's confirmation if items have been deleted.
     * @param {NgForm} form Object generated from type name fields.
     */
    onSubmit(form: NgForm): void {
        let confirmShown = Observable.of(true);     //dummy observable in case modal not shown
        let deleted;                                //collection of items marked for deletion
        let isPlural;                               //more than one item is being deleted?

        //Only submits if no field has errors.
        //NOTE: disabled fields are not validated as per Angular's default behaviour. Therefore, the VALID/INVALID
        //fields cannot be relied on in this case.
        if (!form.errors) {

            //Removes features marked as deleted, showing a confirmation dialogue if applicable.
            if (this.items.isDeletion) {
                deleted = this.items.getDeleted();
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
                            this.section.features.remove(feature);
                        });
                    } else {
                        this.items.reset();
                    }
                });
            }

            //Scalar changes are only applied if deletion confirmed in the first place.
            //Otherwise, it doesn't apply any changes.
            confirmShown.subscribe((isConfirmed: boolean) => {
                if (form.dirty && form.valid && isConfirmed) {
                    Object.keys(form.value).forEach((key) => {
                        this.section.features.find(key).typeName = form.value[key];
                    }, this);
                }

                //If items deleted but not confirmed, it stays on edit mode
                isConfirmed && this.onEditModeToggle();
            });

        //Triggers validation of all fields at once.
        } else {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    /**
     * Renders the confirmation dialogue, internally creating a new reactive stream.
     * @param {string} message - Text to be shown within the dialogue's body section.
     * @returns {Observable<any>} Reactive stream for listening to confirmation event.
     */
    private confirm(message: string): Observable<any> {
        return this.confirmDialog.confirm(message, false);
    }

    /**
     * Cancels any pending deletion and goes back to display mode.
     * @param {Event} [event] - Optional click event object.
     */
    onCancel(event?: Event): void {
        if (this.items.isDeletion) {
            this.items.reset();
        }
        this.onEditModeToggle(event);
    }

    /**
     * Transitions between the display/edit mode by changing a flag.
     * @param {Event} [event] - Optional click event object. If passed in, bubbling is prevented.
     */
    onEditModeToggle(event?: Event): void {
        event && event.preventDefault();
        this.editing = !this.editing;
    }

    /**
     * Renders the new type dialogue that allows the user to choose what type is to be added.
     * @param {Event} event - Click event object, the bubbling of which will be prevented
     */
    onNewTypeClick(event: Event): void {
        event.preventDefault();
        this.addDialog.show();
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
        this.items.delete(itemIdx);
        delete controls[nameInput];
    }

    /**
     * Resets the submission item collection to the current section's annotations and features.
     */
    onItemsChange(): void {
        this.items = SubmItems.create();

        //Builds the item collection
        this.items.push(new SubmItem(this.section.annotations));
        this.section.features.list().forEach((feature) => {
            this.items.push(new SubmItem(feature))
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
    onReviewClick(event: Event, control: FieldControl) {
        const buttonEl = <HTMLElement>event.target;

        //Determines the scrolling offset needed to get the control alongside the review button just clicked.
        let scrollTop = control.nativeElement.getBoundingClientRect().top - buttonEl.getBoundingClientRect().top;

        //Prevents the submission topbar from overlapping the control's label area if it's at the top.
        if (this.formControls.indexOf(control) == 0) {
            scrollTop -= 25;
        }

        window.scrollBy(0, scrollTop);
        control.nativeElement.focus();
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
        }
    }
}