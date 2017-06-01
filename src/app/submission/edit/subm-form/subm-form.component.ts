import {
    Component,
    Input
} from '@angular/core';

import {
    FormGroup,
    FormBuilder, Validators
} from '@angular/forms';

import {Submission, Field} from '../../shared/submission.model';
import {SubmissionTemplate} from '../../shared/submission-template.model';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmissionFormComponent {
    @Input() subm: Submission;
    @Input() submTemplate: SubmissionTemplate;
    @Input() currSection: string;

    submForm: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        const config = {};

        this.fields.forEach(
            field => config[field.name] = [
                field.name,
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(24)
                ]
            ]
        );

        this.submForm = this.fb.group(config);
        this.submForm.valueChanges.subscribe(
            data =>
                this.onValueChanged(data)
        );
        this.onValueChanged(); // (re)set validation messages now
    }

    get fields(): Field[] {
        return this.subm.section(this.currSection).fields.list();
    }

    onValueChanged(data ?: any): void {
        console.log(data);
    }

    onSubmit(ev: any): void {
        return;
    }
}