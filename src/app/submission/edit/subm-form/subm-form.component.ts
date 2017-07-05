import {
    Component,
    Input,
    OnChanges, SimpleChanges, SimpleChange
} from '@angular/core';

import {
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';

import {Subscription} from 'rxjs/Subscription';

import {
    Section
} from '../../shared/submission.model';
import {SectionTemplate} from '../../shared/submission-template.model';
import {SubmFormService, SectionForm} from './subm-form.service';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmFormComponent implements OnChanges {
    @Input() sectionAndTmpl: [Section, SectionTemplate];

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