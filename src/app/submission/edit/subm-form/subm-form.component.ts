import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Section} from '../../shared/submission.model';
import {SectionForm} from './section-form';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmFormComponent implements OnChanges {
    @Input() section?: Section;
    @Input() readonly?: boolean = false;

    sectionForm?: SectionForm;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.section !== undefined) {
            this.sectionForm = new SectionForm(this.section);
        }

    }

    onSubmit(event) {
        //TODO
    }
}