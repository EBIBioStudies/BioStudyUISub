import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SectionForm } from '../shared/section-form';

@Component({
    selector: 'st-subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmFormComponent implements OnChanges {
    @Input() sectionForm?: SectionForm;
    @Input() readonly?: boolean = false;

    constructor() {}

    ngOnChanges(): void {}

    onSubmit() {}
}
