import {
    Component,
    Input
} from '@angular/core';

import {Attribute, Feature} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';

@Component({
    selector: 'subm-feature-list',
    templateUrl: './feature-list.component.html',
    styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent {
    @Input() featureForm: FeatureForm;
    @Input() readonly?: boolean = false;

    get columns(): Attribute[] {
        return this.featureForm.columns
    }

    get feature(): Feature {
        return this.featureForm.feature;
    }
}
