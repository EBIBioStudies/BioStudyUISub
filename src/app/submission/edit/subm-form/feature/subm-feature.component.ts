import {
    Component,
    Input
} from '@angular/core';

import {Feature} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html'
})
export class SubmFeatureComponent {
    @Input() featureForm: FeatureForm;
    @Input() readonly?: boolean = false;

    actions: any[];

    constructor() {
        this.actions = [
            {
                label: 'Add Row',
                invoke: () => {
                    this.feature.addRow();
                }
            },
            {
                label: 'Add Column',
                invoke: () => {
                    this.feature.addColumn();
                }
            }
        ];
    }

    get feature(): Feature {
        return this.featureForm === undefined ? undefined : this.featureForm.feature;
    }

    get valid(): boolean {
        return this.featureForm.form.valid;
    }
}

