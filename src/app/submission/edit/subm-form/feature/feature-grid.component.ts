import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren,} from '@angular/core';
import {UserData} from '../../../../auth/user-data';
import {TypeaheadDirective} from 'ngx-bootstrap';
import {ColumnControl, FeatureForm, RowForm} from '../../section-form';

@Component({
    selector: 'subm-feature-grid',
    templateUrl: './feature-grid.component.html',
    styleUrls: ['./feature-grid.component.css']
})
export class FeatureGridComponent implements AfterViewInit {
    @Input() featureForm?: FeatureForm;
    @Input() readonly? = false;

    @ViewChildren('ahead') typeaheads?: QueryList<TypeaheadDirective>;
    @ViewChildren('rowEl') rowEls?: QueryList<ElementRef>;
    @ViewChildren('colEl') colEls?: QueryList<ElementRef>;

    constructor(private rootEl: ElementRef, public userData: UserData) {
    }

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
     * Changes the values of an existing feature's row fields to those of a given a set of grid attributes,
     * bubbling a single DOM change event for all of them. Attribute names are assumed to be in lower case.
     * @param {object} data - Grid attribute data retrieved asynchronously.
     * @param {number} rowIdx - Row whose field values are to be changed.
     */
    addOnAsync(data: any, rowIdx: number) {
       // const columns = this.feature.columns.slice(0);
        const attrNames = Object.keys(data);
        const attributes: { name: string, value: string }[] = [];      //column attributes to be changed with their respective values
        const formValues = {};      //formgroup version of the above

        //The first column is assumed to be the source of the async event and, therefore, does not require updating.
      //  columns.shift();

        //Converts data into attributes by filling in gaps (existing columns that are not included in the attributes).
        //This also guarantees that no new columns will be added.
        /*columns.forEach((column) => {
            const colName = column.name.toLowerCase();

            if (attrNames.indexOf(colName) == -1) {
                attributes.push({name: column.name, value: ''});
            } else {
                attributes.push({name: column.name, value: data[colName]});
            }
        });*/

        //Updates the form controls corresponding to the fields of the affected row in the feature.
        attributes.forEach(attribute => {
           // formValues[this.feature.firstId(attribute.name)] = attribute.value;
        });
       // this.featureForm!.patchRow(rowIdx, formValues);

        //Updates the submission model's row and notifies the outside world as a single change event.
        //TODO this.feature.add(attributes, rowIdx);
        this.rootEl.nativeElement.dispatchEvent(new Event('change', {bubbles: true}));
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
}
