import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    AfterViewInit
} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap';
import {
    NgForm,
    NgModel
} from "@angular/forms";

@Component({
    selector: 'subm-add-dialog',
    templateUrl: './subm-add.component.html'
})
export class SubmAddDialogComponent implements AfterViewInit {
    private _type: string;       //form model member for the type property
    name: string;                //form model member for the name property
    isUnique: boolean;           //uniqueness flag of the chosen type name

    @Input() onAddType: Function = () => {}; //callback for add action (acts as an ad-hoc, async validator)

    @ViewChild('focusBtn')
    private focusEl: ElementRef;
    @ViewChild('bsModal')
    private modalDirective: ModalDirective;
    @ViewChild('typeName')
    private typeName: NgModel;
    
    get type(): string {
        return this._type;
    }

    /**
     * Sets the type of the new type item. If it's a section, then the type name doesn't have to be unique.
     * @param {boolean} value Type of the new type item.
     */
    set type(value: string) {
        if (value == 'Section') {
            this.isUnique = true;
        }
        this._type = value;
    }

    ngOnInit(): void {
        this.type = 'Grid';
    }

    /**
     * Renders the modal with default values.
     */
    show(): void {
        this.modalDirective.show();
    }

    /**
     * Closes the modal, making sure the last typeName typed in is not lost while
     * clearing any validation messages.
     */
    hide(): void {
        this.typeName.control.markAsUntouched({onlySelf: true});
        this.modalDirective.hide();
    }

    /**
     * Every time the type name is blank, it will be marked as unique (no existing type name is blank after all).
     */
    ngAfterViewInit() {
        this.typeName.statusChanges.subscribe((status) => {
            if (status == 'INVALID') {
                this.isUnique = true;
            }
        });
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     */
    onShown(): void {
        this.focusEl.nativeElement.focus();
    }

    /**
     * Handler for click events on "Cancel" button.
     */
    onCancel(): void {
        this.type = 'Grid';
        this.typeName.control.reset();
        this.hide();
    }

    /**
     * Shows validation errors globally on submission according to the nature of the type, using the addition operation
     * as a validator post-submission. Only after that op is the form data confirmed as valid.
     * modal is simply
     * @param {NgForm} form
     */
    onSubmit(form: NgForm): void {
        let isSingleRow: boolean = false;
        let isSection: boolean = false;

        //Adds type if all form fields completed satisfactorily
        if (form.valid && this.isUnique) {
            if (this._type == 'Section') {
                isSection = true;
            } else if (this._type == 'List') {
                isSingleRow = true;
            }

            //Add operation successful => gets form ready for further additions
            if (this.onAddType(this.name, isSection, isSingleRow)) {
                this.hide();
                form.reset({type: 'Grid', name: ''});

            //Add operation failed => type name was not unique => show error
            } else {
                this.isUnique = false;
            }

        //Triggers form-led validation of all fields.
        } else {
            this.typeName.control.markAsTouched({ onlySelf: true });
        }
    }
}