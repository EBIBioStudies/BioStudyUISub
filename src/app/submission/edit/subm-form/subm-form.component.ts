import {
    Component,
    Input
} from '@angular/core';

import {
    FormGroup,
    FormBuilder,
    Validators
} from '@angular/forms';

import {Subscription} from "rxjs/Subscription";

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
export class SubmFormComponent {
    @Input() submTemplate: SubmissionTemplate;
    @Input() submSection: Section;

    submForm: FormGroup;
    submFields: Field[] = [];

    formErrors: {[key: string]: string} = {};

    private subscr: Subscription;

    constructor(private fb: FormBuilder) {
    }

    ngOnChanges(): void {
        if (this.subscr != undefined) {
            this.subscr.unsubscribe();
            this.subscr = undefined;
        }
        this.subscr = this.submSection.fields
            .updates()
            .filter(ue => ue.name === 'field_add')
            .subscribe(ue => {
                this.buildForm();
            });
        this.buildForm();
    }

    buildForm(): void {
        const config = {};

        this.submFields = this.submSection.fields.list().slice(0);
        this.submFields.forEach(
            field => {
                config[field.id] = [
                    field.value,
                    [
                        Validators.required
                        //Validators.minLength(50)
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
        return this.submFields;
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