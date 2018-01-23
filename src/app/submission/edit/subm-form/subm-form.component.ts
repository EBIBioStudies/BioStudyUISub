import {
    Component, ElementRef,
    Input,
    OnChanges
} from '@angular/core';

import {
    SubmFormService,
    SectionForm, FieldControl
} from './subm-form.service';

import {Section} from '../../shared/submission.model';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html',
    styleUrls: ['./subm-form.component.css']
})
export class SubmFormComponent implements OnChanges {
    @Input() section: Section;
    @Input() readonly: boolean;

    sectionForm: SectionForm;
    hasError: boolean = false;

    private hasErrorEls: NodeListOf<Element>;

    constructor(private submFormService: SubmFormService, private rootEl: ElementRef) {}

    ngOnChanges(): void {
        this.sectionForm = this.submFormService.createForm(this.section);
    }

    ngDoCheck(): void {
        if (this.hasErrorEls) {
            this.hasError = this.hasErrorEls.length != 0;
        }
    }

    ngAfterViewInit(): void {
        this.hasErrorEls = this.rootEl.nativeElement.getElementsByClassName('has-error');
    }

    /**
     * Convenience method to retrieve the control corresponding to a certain top-level field.
     * Optionally, it can also fetch the value of a certain attribute within the type assigned to that field.
     * @param {string} fieldId - ID for the field to be retrieved.
     * @param {string} [typeAttr = ''] - Name of the type attribute to be retrieved.
     * @returns {FieldControl} - Extended form control for the field.
     */
    get(fieldId: string, typeAttr?: string | ''): FieldControl | any {
        const fieldControl = this.sectionForm.fieldControl(fieldId);

        if (typeAttr) {
            return fieldControl.parentType[typeAttr];
        } else {
            return fieldControl;
        }
    }
}