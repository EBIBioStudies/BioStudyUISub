import {
    Component,
    Input
} from '@angular/core';

import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

import {
    Section,
    Field,
    Feature
} from '../../shared/submission.model';
import {SubmissionTemplate} from '../../shared/submission-template.model';

@Component({
    selector: 'subm-form',
    templateUrl: './subm-form.component.html'
})
export class SubmissionFormComponent {
    @Input() submTemplate: SubmissionTemplate;
    @Input() submSection: Section;

    submForm: FormGroup;

    formErrors: {[key: string]: string} = {};

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        const config = {};

        this.fields.forEach(
            field => {
                config[field.id] = [
                    field.value,
                    [
                        Validators.required,
                        Validators.minLength(50)
                    ]
                ];
                this.formErrors[field.id] = '';
            }
        );

        this.submForm = this.fb.group(config);
        this.submForm.valueChanges.subscribe(
            data =>
                this.onValueChanged(data)
        );
        this.onValueChanged();
    }

    get fields(): Field[] {
        return this.submSection.fields.list();
    }

    get features(): Feature[] {
        return this.submSection.features.list();
    }

    onValueChanged(data ?: any): void {
        if (!this.submForm) {
            return;
        }
        const form = this.submForm;

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                for (const key in control.errors) {
                    this.formErrors[field] += this.validationMessage(key);
                }
            }
        }
    }

    validationMessage(key: string): string {
        const m = {
            'required': 'the value is required',
            'minlength': 'must be at least 50 characters long'
        };
        return m[key];
    }

    onSubmit(ev: any): void {
        return;
    }
}