import {
    Component,
    Input
} from '@angular/core';

import {Feature} from '../../../shared/submission.model';

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html'
})
export class SubmFeatureComponent {
    @Input() feature: Feature;
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

    get valid(): boolean {
        return true;
    }
}

