import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {BsModalRef, BsModalService, ModalDirective, PopoverDirective} from 'ngx-bootstrap';
import {NgForm, NgModel} from '@angular/forms';
import {Section} from '../../shared/submission.model';
import {SectionType} from '../../shared/submission-type.model';

@Component({
    selector: 'add-subm-type-modal',
    templateUrl: './add-subm-type-modal.component.html'
})
export class AddSubmTypeModalComponent implements OnInit {
    section?: Section;


    public type: string = 'Grid';       //form model member for the type property
    public name?: string;                //form model member for the new type's name property
    private featNames?: string[];         //existing feature type names

    @ViewChild('focusBtn')
    private focusEl?: ElementRef;
    @ViewChild('bsModal')
    private modalDirective?: ModalDirective;
    @ViewChild('typeName')
    private typeName?: NgModel;
    @ViewChild('uniquePop')
    private uniquePop?: PopoverDirective;

    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        this.featNames = this.getFeatNames();
    }

    /**
     * Generates the list of type names for all features (including annotations) from section data.
     * @returns {string[]} Type names of all defined features.
     */
    private getFeatNames(): string[] {
        let nonAnnotNames: string[];
        if (this.section) {
            nonAnnotNames = this.section.features.list().map((feature) => {
                return feature.typeName;
            });
            return [this.section.annotations.typeName].concat(nonAnnotNames);
        }
        return [];
    }

    /**
     * Renders the modal with default values.
     */
    show(): void {
        this.featNames = this.getFeatNames();
    }

    /**
     * Closes the modal, clearing any validation messages.
     */
    hide(): void {
        this.bsModalRef.hide();
    }

    /**
     * Handler for "onShown" event, triggered exactly after the modal has been fully revealed.
     */
    onShown(): void {
        this.typeName!.control.markAsUntouched({onlySelf: true});
        this.focusEl!.nativeElement.focus();
    }

    /**
     * Handler for click events on "Cancel" button.
     */
    onCancel(): void {
        this.type = 'Grid';
        this.typeName!.control.reset();
        this.hide();
    }

    /**
     * Shows validation errors globally on submission according to the nature of the type, using the addition operation
     * as a validator post-submission. Only after that op is the form data confirmed as valid.
     * @param {NgForm} form New type submit form.
     */
    onSubmit(form: NgForm): void {
        let isSingleRow: boolean = false;
        let isSection: boolean = false;

        //Adds type if all form fields completed satisfactorily
        if (form.valid) {
            if (this.type == 'Section') {
                isSection = true;
            } else if (this.type == 'List') {
                isSingleRow = true;
            }

            //Add operation successful => gets form ready for further additions
            if (this.name && this.onAddType(this.name, isSection, isSingleRow)) {
                this.onCancel();

                //Add operation failed => show error
            } else {
                this.typeName!.control.markAsTouched({onlySelf: true});
            }

            //Triggers form-led validation of all fields.
        } else {
            this.typeName!.control.markAsTouched({onlySelf: true});
        }
    }

    /**
     * Handler for adding the new type to the existing set of type items.
     * @param {string} name - Name of the new type.
     * @param {boolean} isSection - Indicates a section will be added.
     * @param {boolean} isSingleRow - Indicates a list will be added.
     * @returns {any} Result of the addition operation, which could be empty if the new type is not valid.
     */
    onAddType(name: string, isSection: boolean, isSingleRow: boolean = false): any {
        const rootType: SectionType = this.section!.type;
        let addedType: any;

        if (isSection) {
            const sectionType = rootType.getSectionType(name);
            addedType = this.section!.sections.add(sectionType);

        } else {
            const featureType = rootType.getFeatureType(name, isSingleRow);
            addedType = this.section!.features.add(featureType);
        }

        return addedType;
    }

    /**
     * Handler for focus event on the type name field. It displays the popover with a list of existing type names.
     * NOTE: The popover is only rendered when the uniqueness test fails.
     */
    onNameFocus() {
        if (this.uniquePop) {
            this.uniquePop.show();
        }
    }

    /**
     * Handler for blur event on the type name field. Hides the popover displayed by the method above.
     * NOTE: The popover is only rendered when the uniqueness test fails.
     */
    onNameBlur() {
        if (this.uniquePop) {
            this.uniquePop.hide();
        }
    }

    /**
     * Handler for blur event on the type class field. Ensures the submission of sections with duplicate
     * names goes ahead.
     * NOTE: Section names do not have to be unique.
     */
    onTypeBlur() {
        this.typeName!.control.updateValueAndValidity();
    }
}