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
    templateUrl: './subm-feature.component.html',
    styleUrls: ['./subm-feature.component.css']
})
export class SubmFeatureComponent implements OnInit {
    @Input() featureForm: FeatureForm;
    @Input() readonly?: boolean = false;
    @Input() isMenu?: boolean = true;
    @ViewChild('featureEl') featureEl: ElementRef;

    private actions: any[] = [];
    private errorNum: number = 0;
    private colTypeNames: string[];

    constructor(private changeRef: ChangeDetectorRef) {}

    /**
     * Defines the actions of the feature's menu according to its type (list or not). It also gets the type names
     * of all possible columns just once.
     */
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
        this.colTypeNames = this.feature.type.columnTypes.map(type => type.name);
    }

    get feature(): Feature {
        return this.featureForm === undefined ? undefined : this.featureForm.feature;
    }

    /**
     * Gets the names of allowed new column names. Since they have to be unique, it takes all columns from
     * the list of column types and removes the names for the current columns.
     */
    get colNames(): string[] {
        const currColNames = this.featureForm.columns.map(column => column.name);

        //Feature not loaded yet => returns no column names.
        if (this.feature === undefined) {
            return [];

        //Feature loaded => gets only uniques column names.
        } else {
            return this.colTypeNames.filter(name => currColNames.indexOf(name) == -1);
        }
    }

    /**
     * Counts the number of errors if the feature is not empty.
     */
    ngDoCheck(): void {
        if (this.featureEl) {
            this.errorNum = this.featureEl.nativeElement.getElementsByClassName('has-error').length;
            this.changeRef.detectChanges();
        }
    }
}

