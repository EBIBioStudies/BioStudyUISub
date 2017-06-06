import {
    Component, Input
} from '@angular/core';

import {Feature} from '../../shared/submission.model';

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html',
    styleUrls: ['./subm-feature.component.css']
})
export class SubmissionFeatureComponent {
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

    get rowWidth(): string {
        //TODO move window to providers for easy testing
        const w = window.innerWidth;
        const k = (w >= 768 ? 2 : 3);
        const rw = 100 * (k*this.feature.colSize()+1)/12 + 'vw';
        console.log(w, k, rw);
        return rw;
    }

}

