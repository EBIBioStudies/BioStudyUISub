import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SectionForm } from '../shared/section-form';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmFormComponent {
    @Input() readonly?: boolean = false;
    @Input() sectionForm?: SectionForm;

    constructor() {}
}
