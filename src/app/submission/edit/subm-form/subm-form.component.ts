import {
    Component,
    Input,
    OnChanges
} from '@angular/core';

import {SubmFormService, SectionForm} from './subm-form.service';
import {Section} from '../../shared/submission.model';
import {SectionType} from '../../shared/submission-template.model';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmFormComponent implements OnChanges {
    @Input() sectionWithType: [Section, SectionType];

    sectionForm: SectionForm;

    constructor(private submFormService: SubmFormService) {
    }

    ngOnChanges(): void {
        this.sectionForm = this.submFormService.createForm(this.sectionAndTmpl);
    }

    onSubmit(ev: any): void {
        if (this.sectionForm.valid()) {
            //todo
        }
        return;
    }
}