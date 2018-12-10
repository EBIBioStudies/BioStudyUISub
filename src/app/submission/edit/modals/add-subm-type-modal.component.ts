import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {BsModalRef, PopoverDirective} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {Section, SectionType} from '../../shared/model';
import {SectionForm} from '../section-form';

@Component({
    selector: 'add-subm-type-modal',
    templateUrl: './add-subm-type-modal.component.html'
})
export class AddSubmTypeModalComponent implements OnInit, AfterViewInit {
    sectionForm?: SectionForm;

    public typeBase: string = 'Grid';
    public typeName?: string;

    private featNames?: string[];

    @ViewChild('focusBtn')
    private focusEl?: ElementRef;

    @ViewChild('uniquePop')
    private uniquePop?: PopoverDirective;

    constructor(public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        this.featNames = this.getFeatureNames();
    }

    ngAfterViewInit(): void {
       this.focusEl!.nativeElement.focus();
    }

    /**
     * Generates the list of type names for all features (including annotations) from section data.
     * @returns {string[]} Type names of all defined features.
     */
    private getFeatureNames(): string[] {
        if (this.sectionForm) {
            return this.sectionForm.featureForms.map(ff => ff.featureTypeName);
        }
        return [];
    }

    hide(): void {
        this.bsModalRef.hide();
    }

    onCancel(form: NgForm): void {
        form.reset();
        this.typeBase = 'Grid';
        this.hide();
    }

    /**
     * Shows validation errors globally on submission according to the nature of the type, using the addition operation
     * as a validator post-submission. Only after that op is the form data confirmed as valid.
     * @param {NgForm} form New type submit form.
     */
    onSubmit(form: NgForm): void {
        //Adds type if all form fields completed satisfactorily
        if (form.valid) {
            const isSection = this.typeBase === 'Section';
            const isSingleRow = this.typeBase === 'List';

            //Add operation successful => gets form ready for further additions
            if (this.typeName && this.onAddType(this.typeName, isSection, isSingleRow)) {
                this.onCancel(form);
            }
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
        const rootType: SectionType = this.sectionForm!.type;
        let addedType: any;

        if (isSection) {
            const sectionType = rootType.getSectionType(name);
            addedType = this.sectionForm!.addSection(sectionType);

        } else {
            const featureType = rootType.getFeatureType(name, isSingleRow);
            addedType = this.sectionForm!.addFeature(featureType);
        }

        return addedType;
    }

    /**
     * Handler for focus event on the type name field. It displays the popover with a list of existing type names.
     * NOTE: The popover is only rendered when the uniqueness test fails.
     */
    onTypeNameFocus() {
        if (this.uniquePop) {
            this.uniquePop.show();
        }
    }

    /**
     * Handler for blur event on the type name field. Hides the popover displayed by the method above.
     * NOTE: The popover is only rendered when the uniqueness test fails.
     */
    onTypeNameBlur() {
        if (this.uniquePop) {
            this.uniquePop.hide();
        }
    }
}