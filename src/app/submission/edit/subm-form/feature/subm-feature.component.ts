import {ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserData} from 'app/auth/shared';
import {FeatureForm} from 'app/submission/edit/shared/section-form';

interface FeatureOperation {
    label: string,
    callback: () => void
}

@Component({
    selector: 'subm-feature',
    templateUrl: './subm-feature.component.html',
    styleUrls: ['./subm-feature.component.css']
})
export class SubmFeatureComponent implements OnInit, DoCheck {
    @Input() featureForm?: FeatureForm;
    @Input() readonly?: boolean = false;
    @Input() isMenu?: boolean = false;
    @ViewChild('featureEl') featureEl?: ElementRef;

    operations: FeatureOperation[] = [];
    private colTypeNames: string[] = [];

    private _errorNum: number = 0;
    private _uniqueColNames: string[] = [];
    private _allowedColNames: string[] = [];

    constructor(private changeRef: ChangeDetectorRef, public userData: UserData) {
    }

    ngOnInit() {
        if (this.featureForm === undefined) {
            return;
        }

        this.operations.push({
            label: 'Add column',
            callback: () => {
                this.featureForm!.addColumn()
            }
        });

        this.operations.push({
            label: 'Add row',
            callback: () => {
                this.featureForm!.addRow()
            }
        });
    }

    get allowedColNames(): string [] {
        return this._allowedColNames;
    }

    get uniqueColNames(): string[] {
        return this._uniqueColNames;
    }

    get errorNum(): number {
        return this._errorNum;
    }

    /**
     * Counts the number of errors if the feature is not empty.
     */
    ngDoCheck(): void {
        this._errorNum = Object.keys(this.featureForm!.form.errors || {}).length;
        this._uniqueColNames = this.colTypeNames.filter(name => this.featureForm!.columnNames.includes(name));
        this._allowedColNames = this.featureForm!.hasUniqueColumns ? this._uniqueColNames : this.colTypeNames;
        this.changeRef.detectChanges();
    }
}

