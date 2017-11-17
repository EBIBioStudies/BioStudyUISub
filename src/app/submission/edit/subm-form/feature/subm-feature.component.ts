import {
    ChangeDetectorRef,
    Component, ElementRef,
    Input,
    OnInit, ViewChild
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
    @ViewChild('featureEl') featureEl: ElementRef;

    actions: any[] = [];
    errorNum: number = 0;

    constructor(private changeRef: ChangeDetectorRef) {}

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

    //Counts the number of errors if the feature is not empty.
    ngDoCheck(): void {
        if (this.featureEl) {
            this.errorNum = this.featureEl.nativeElement.getElementsByClassName('has-error').length;
            this.changeRef.detectChanges();
        }
    }
}

