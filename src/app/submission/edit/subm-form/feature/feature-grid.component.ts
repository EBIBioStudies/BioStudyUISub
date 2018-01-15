import {
    Component,
    AfterViewInit,
    ElementRef,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';

import {Feature, Attribute, ValueMap} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';
import {UserData} from "../../../../auth/user-data";

@Component({
    selector: 'subm-feature-grid',
    templateUrl: './feature-grid.component.html',
    styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent implements AfterViewInit {
    @Input() featureForm: FeatureForm;
    @Input() readonly? = false;
    @ViewChildren('rowEl') rowEls: QueryList<ElementRef>;
    @ViewChildren('colEl') colEls: QueryList<ElementRef>;

    constructor(private rootEl: ElementRef, private userData: UserData) {}

    get rows(): ValueMap[] {
        return this.featureForm.rows;
    }

    get columns(): Attribute[] {
        return this.featureForm.columns;
    }

    get feature(): Feature {
       return this.featureForm.feature;
    }

    ngAfterViewInit(): void {
        let oldNumRows = this.featureForm.rows.length;      //initial row count
        let oldNumCols = this.featureForm.columns.length;   //initial column count

        //On DOM change, compares current row and column count with the respective old value to find out if
        //a row or column was added.
        this.rowEls.changes.subscribe((rowEls) => {

            //Row added => sets focus to the first field of the row
            if (oldNumRows < this.featureForm.rows.length) {
                rowEls.last.nativeElement.querySelector('.form-control').focus();

            //Column added => sets focus to last field of the first row (first field of the added column)
            } else if (oldNumCols < this.featureForm.columns.length) {
                rowEls.first.nativeElement.querySelectorAll('.form-control')[oldNumCols].focus();
            }

            oldNumRows = this.featureForm.rows.length;
            oldNumCols = this.featureForm.columns.length;
        });
    }

    /**
     * Changes the values of an existing feature's row fields to those of a given a set of grid attributes,
     * bubbling a single DOM change event for all of them.
     * @param {object} data - Grid attribute data retrieved asynchronously.
     * @param {number} rowIdx - Row whose field values are to be changed.
     */
    addOnAsync(data: any, rowIdx: number) {
        const columns = this.feature.columns.slice(0);
        const attrNames = Object.keys(data);
        const attributes = [];

        //The first column is assumed to be the source of the async event and, therefore, does not require updating.
        columns.shift();

        //Converts data into attributes by filling in gaps (existing columns not included in the attributes).
        //This also guarantees that no new columns will be added.
        columns.forEach((column) => {
            const colName = column.name.toLowerCase();

            if (attrNames.indexOf(colName) == -1) {
                attributes.push({name: colName, value: ''});
            } else {
                attributes.push({name: colName, value: data[colName]});
            }
        });

        //Updates the row and notifies the a single change.
        this.feature.add(attributes, rowIdx);
        this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
    }
}
