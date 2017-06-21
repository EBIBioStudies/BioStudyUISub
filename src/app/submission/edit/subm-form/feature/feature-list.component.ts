import {
    Component,
    Input
} from '@angular/core';

import {Feature} from '../../../shared/submission.model';

@Component({
    selector: 'subm-feature-list',
    templateUrl: './feature-list.component.html'
})
export class FeatureListComponent {
    @Input() feature: Feature;
    @Input() readonly?: boolean = false;
}
