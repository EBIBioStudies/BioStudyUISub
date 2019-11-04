import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, PopoverDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { SectionType } from 'app/submission/submission-shared/model/templates';
import { SectionForm } from '../../shared/section-form';

@Component({
    selector: 'st-add-subm-type-modal',
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
        // Adds type if all form fields completed satisfactorily
        if (form.valid) {
            const isSection = this.typeBase === 'Section';
            const isSingleRow = this.typeBase === 'List';

            this.onAddType(this.typeName!, isSection, isSingleRow);
            this.onCancel(form);
        }
    }

    onAddType(name: string, isSection: boolean, isSingleRow: boolean): boolean {
        const rootType: SectionType = this.sectionForm!.type;

        if (isSection) {
            const sectionType = rootType.getSectionType(name);
            console.log(sectionType);
            this.sectionForm!.addSection(sectionType);
            return true;
        }

        const featureType = rootType.getFeatureType(name, isSingleRow);
        return this.sectionForm!.addFeature(featureType) !== undefined;
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
