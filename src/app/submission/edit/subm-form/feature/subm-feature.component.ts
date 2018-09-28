import {
    ChangeDetectorRef,
    Component, ElementRef,
    Input,
    OnInit, ViewChild
} from '@angular/core';

import {Feature} from '../../../shared/submission.model';
import {UserData} from "../../../../auth/user-data";
import {FeatureForm} from '../section-form';

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html',
    styleUrls: ['./subm-feature.component.css']
})
export class SubmFeatureComponent implements OnInit {
    @Input() featureForm?: FeatureForm;
    @Input() readonly?: boolean = false;
    @Input() isMenu?: boolean = true;
    @ViewChild('featureEl') featureEl?: ElementRef;

    private actions: any[] = [];
    private errorNum: number = 0;
    private colTypeNames?: string[];
    private allowedCols?: string[];

    constructor(private changeRef: ChangeDetectorRef, public userData: UserData) {}

    /**
     * Defines the actions of the feature's menu according to its type (list or not). It also gets the type names
     * of all readable columns just once.
     */
    ngOnInit() {
        /*this.actions.push({
            label: 'Add column',
            invoke: () => this.feature!.addColumn()
        });
        if (!this.feature!.singleRow) {
            this.actions.push({
                label: 'Add row',
                invoke: () => this.feature!.addRow()
            });
        }
        this.colTypeNames = this.feature!.type.columnTypes
            .filter(type => !type.readonly)
            .map(type => type.name);*/
    }

   /* get feature(): Feature | undefined {
        return this.featureForm === undefined ? undefined : this.featureForm.feature;
    }
*/
    /**
     * It takes all columns from the list of column types and removes the names for the current columns.
     */
    uniqueColNames(): string[] {
        return [];

        //Feature not loaded yet => returns no column names.
       /* if (this.feature === undefined) {
            return [];

        //Feature loaded => gets only uniques column names.
        } else {
            return this.colTypeNames!.filter(name => this.feature!.colNames.indexOf(name) == -1);
        }*/
    }

    /**
     * Counts the number of errors if the feature is not empty.
     */
    ngDoCheck(): void {
        if (this.featureEl) {
            this.errorNum = this.featureEl.nativeElement.getElementsByClassName('has-error').length;

            /*if (this.feature!.uniqueCols) {
                this.allowedCols = this.uniqueColNames();
            } else {
                this.allowedCols = this.colTypeNames;
            }

            this.changeRef.detectChanges();*/
        }
    }
}

