import {
    Component,
    Input
} from '@angular/core';

import {Feature} from '../../shared/submission.model';

@Component({
    selector: 'subm-feature-grid',
    templateUrl: './feature-grid.component.html',
    styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent {
    @Input() feature: Feature;
    @Input() readonly?: boolean = false;

    get rowWidth(): string {
        //TODO move window to provider for easy testing
        const w = window.innerWidth;
        const k = (w >= 768 ? 2 : 3);
        return 100 * (k * this.feature.colSize() + 1) / 12 + 'vw';
    }
}