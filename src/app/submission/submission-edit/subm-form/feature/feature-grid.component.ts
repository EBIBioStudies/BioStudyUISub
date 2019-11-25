import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { UserData } from 'app/auth/shared';
import { TypeaheadDirective } from 'ngx-bootstrap';
import { FeatureForm, RowForm, ColumnControl } from '../../shared/section-form';

@Component({
    selector: 'st-subm-feature-grid',
    templateUrl: './feature-grid.component.html',
    styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent implements AfterViewInit {
    @ViewChildren('colEl') colEls?: QueryList<ElementRef>;
    @Input() featureForm?: FeatureForm;
    @Input() readonly = false;
    @ViewChildren('rowEl') rowEls?: QueryList<ElementRef>;
    @ViewChildren('ahead') typeaheads?: QueryList<TypeaheadDirective>;

    constructor(private rootEl: ElementRef, public userData: UserData) {}

    get rows(): RowForm[] {
        return this.featureForm!.rows;
    }

    get columns(): ColumnControl[] {
        return this.featureForm!.columns;
    }

    ngAfterViewInit(): void {
        /*let oldNumRows = this.featureForm!.rows.length;      //initial row count
        let oldNumCols = this.featureForm!.columns.length;   //initial column count

        //On DOM change, compares current row and column count with the respective old value to find out if
        //a row or column was added.
        this.rowEls!.changes.subscribe((rowEls) => {

            //Row added => sets focus to the first field of the row
            if (oldNumRows < this.featureForm!.rows.length) {
                rowEls.last.nativeElement.querySelector('.form-control').focus();

                //Column added => sets focus to last field of the first row (first field of the added column)
            } else if (oldNumCols < this.featureForm!.columns.length) {
                rowEls.first.nativeElement.querySelectorAll('.form-control')[oldNumCols].focus();
            }

            oldNumRows = this.featureForm!.rows.length;
            oldNumCols = this.featureForm!.columns.length;
        });*/
    }

    /**
     * Handler for the change event. Only save an attribute when its associated cell changes.
     * @param {Object} attrObj - Object representative of the attribute.
     * @param {string} newValue - New value for the specified attribute.
     * @param {string} [attrName = 'value'] - Name of the attribute whose value is being saved.
    */
    onFieldChange(attrObj: any, newValue: string, attrName: string = 'value') {
        attrObj[attrName] = newValue;
    }

    /**
     * Changes the values of an existing feature's row fields to those of a given a set of grid attributes,
     * bubbling a single DOM change event for all of them. Attribute names are assumed to be in lower case.
     * @param {object} data - Grid attribute data retrieved asynchronously.
     * @param {number} rowIdx - Row whose field values are to be changed.
     */
    onInputValueSelect(data: { [key: string]: string }, rowIdx: number) {
        const attrNames = Object.keys(data);
        if (attrNames.length === 0) {
            return;
        }

        attrNames.forEach(attrName => {
            const rowForm = this.featureForm!.rows[rowIdx];
            const col = this.featureForm!.columns.find(c => c.name.toLowerCase() === attrName.toLowerCase());
            if (col !== undefined) {
                rowForm.cellControlAt(col.id)!.control.setValue(data[attrName]);
            }
        });

        this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
    }
}
