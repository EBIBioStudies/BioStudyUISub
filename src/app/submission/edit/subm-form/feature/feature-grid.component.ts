import {
    Component,
    Input
} from '@angular/core';

import {Feature, Attribute, ValueMap} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';

@Component({
    selector: 'subm-feature-grid',
    templateUrl: './feature-grid.component.html',
    styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent {
    @Input() featureForm: FeatureForm;
    @Input() readonly? = false;

    get rowWidth(): string {
        // TODO move window to provider for easy testing
        const w = window.innerWidth;
        const k = (w >= 768 ? 2 : 3);
        return 100 * (k * this.feature.colSize() + 1) / 12 + 'vw';
    }

    get rows(): ValueMap[] {
        return this.featureForm.rows;
    }

    get columns(): Attribute[] {
        return this.featureForm.columns;
    }

    get feature(): Feature {
       return this.featureForm.feature;
    }

    onColumnRemove(column: Attribute) {
        //this.featureForm.removeColumnControl(column.id); //Use add action to find out how it manages to call private methods within featureForm
    }
}
