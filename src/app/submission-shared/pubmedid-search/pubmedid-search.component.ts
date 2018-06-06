import {
    Component,
    Input,
    Output,
    forwardRef,
    EventEmitter
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import * as _ from 'lodash';

import {PubMedSearchService} from './pubmedid-search.service';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'pubmedid-search',
    templateUrl: './pubmedid-search.component.html',
    styleUrls: ['./pubmedid-search.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => PubMedIdSearchComponent),
        multi: true
    }]
})

/**
 * PubMed ID lookup field implemented in the vein of an auto-suggest search box where the suggestion
 * acts as a preview of the with confirmation from the user by selection. It fetches publication data on
 * de-bounced key presses, supports the enter key and allows for any previously fetched publication data
 * to be displayed again (1st enter key press) or actioned upon (2nd key press).
 */
export class PubMedIdSearchComponent implements ControlValueAccessor {
    private onChange: any = (_:any) => {};      //placeholder for handler propagating changes outside the custom control
    private onTouched: any = () => {};          //placeholder for handler after the control has been "touched"

    public isPreviewPub: boolean = false;       //indicates if the retrieved publication's summary preview is on display
    private isBusy: boolean = false;            //indicates a transaction is in progress
    private pubMedId: string;                   //last PubMed ID number typed in
    private lastIDfetched: string;              //helps cancel unnecessary search actions triggered by enter key
    private publication: object = {};           //last publication retrieved

    @Input() required?: boolean = false;
    @Input() readonly?: boolean = false;
    @Output() found: EventEmitter<any> = new EventEmitter<any>();

    constructor(private pubMedSearchService: PubMedSearchService) {
        this.pubMedFetch = _.debounce(this.pubMedFetch, 300);
    }

    get value() {
        return this.pubMedId;
    }

    set value(newValue) {
        if (this.pubMedId !== newValue) {
            this.pubMedId = newValue;
            this.onChange(newValue);
        }
    }

    /**
     * Writes a new value from the form model into the view or (if needed) DOM property.
     * @see {@link ControlValueAccessor}
     * @param newValue - Value to be stored.
     */
    writeValue(newValue: any) {
        if (newValue) {
            this.pubMedId = newValue;
        }
    }

    /**
     * Registers a handler that should be called when something in the view has changed.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler telling other form directives and form controls to update their values.
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }


    /**
     * Registers a handler specifically for when a control receives a touch event.
     * @see {@link ControlValueAccessor}
     * @param fn - Handler for touch events.
     */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * Performs a new lookup operation provided the field is not blank and there is no request in progress.
     * It also hides the previous search result's preview if on display.
     */
    search() {
        if (this.pubMedId && !this.isBusy) {
            this.isPreviewPub = false;
            this.pubMedFetch();
        }
    }

    /**
     * Performs a lookup operation on pressing a certain key (filtered at the template level) as long as the
     * ID being searched is different from the last one. Otherwise it just directly selects the previously
     * searched publication for autofill.
     * @param {Event} event - DOM event for the click action.
     */
    searchOnKeypress(event: Event) {
        event.stopPropagation();

        if (this.pubMedId != this.lastIDfetched) {
            this.search();
        } else if (this.pubMedId) {
            this.selectPub();
        }
    }

    /**
     * Retrieves the publication data for the ID present in the search field shows its preview, ready
     * for selection so the user wishes. It will also notify the template that the transaction is going on so that
     * no further action is allowed in the interim.
     * @returns {Observable<any>} Stream of HTTP client events.
     */
    pubMedFetch(): Observable<any> {
        let eventStream;

        this.isBusy = true;
        eventStream = this.pubMedSearchService.search(this.pubMedId);
        eventStream.subscribe((response) => {
            this.isBusy = false;
            this.lastIDfetched = this.pubMedId;
            if (response.hasOwnProperty('title')) {
                this.publication = response;
                this.isPreviewPub = true;
            }
        });

        return eventStream;
    }

    /**
     * Bubbles the selected publication event up, hiding its preview too.
     */
    selectPub() {
        this.found.emit(this.publication);
        this.isPreviewPub = false;
    }

    /**
     * Shows or hides the publication's preview. If there is no preview to be shown because the field
     * has just been rendered, it checks for an already existing ID and retrieves the publication for that one.
     */
    togglePreviewPub() {
        if (this.pubMedId && _.isEmpty(this.publication) && !this.isPreviewPub ) {
            this.pubMedFetch();
            return;
        }
        this.isPreviewPub = !this.isPreviewPub;
    }
}