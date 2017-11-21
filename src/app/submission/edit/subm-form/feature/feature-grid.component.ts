import {
    Component,
    AfterViewInit,
    ElementRef,
    Input,
    QueryList,
    ViewChildren
} from '@angular/core';

import {Feature, Attribute, ValueMap} from '../../../shared/submission.model';
import {FeatureForm} from '../subm-form.service';
import {AbstractControl} from "@angular/forms";

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

        //On DOM change, updates row and column count and compares it to the respective old value to find out if
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
}
