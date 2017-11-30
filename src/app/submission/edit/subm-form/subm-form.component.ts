import {
    Component,
    Input,
    OnChanges
} from '@angular/core';

import {
    SubmFormService,
    SectionForm
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

    constructor(private submFormService: SubmFormService) {}

    ngOnChanges(): void {
        this.sectionForm = this.submFormService.createForm(this.section);
    }
}