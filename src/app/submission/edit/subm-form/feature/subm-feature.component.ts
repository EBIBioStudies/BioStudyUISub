import {
    Component,
    Input,
    OnInit
} from '@angular/core';

import {Feature} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html'
})
export class SubmFeatureComponent implements OnInit {
    @Input() featureForm: FeatureForm;
    @Input() readonly?: boolean = false;

    actions: any[] = [];

    ngOnInit() {
        this.actions.push({
            label: 'Add column',
            invoke: () => this.feature.addColumn()
        });

        if (!this.feature.singleRow) {
            this.actions.push({
                label: 'Add row',
                invoke: () => this.feature.addRow()
            });
        }
    }

    get feature(): Feature {
        return this.featureForm === undefined ? undefined : this.featureForm.feature;
    }

    get valid(): boolean {
        return this.featureForm.form.valid;
    }
}

