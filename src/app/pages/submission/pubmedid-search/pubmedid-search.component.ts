import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import debounce from 'lodash.debounce';
import isEmpty from 'lodash.isempty';
import { PubMedSearchService } from './pubmedid-search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'st-pubmedid-search',
  templateUrl: './pubmedid-search.component.html',
  styleUrls: ['./pubmedid-search.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PubMedIdSearchComponent),
      multi: true
    }
  ]
})

/**
 * PubMed ID lookup field implemented in the vein of an auto-suggest search box where the suggestion
 * acts as a preview of the with confirmation from the user by selection. It fetches publication data on
 * de-bounced key presses, supports the enter key and allows for any previously fetched publication data
 * to be displayed again (1st enter key press) or actioned upon (2nd key press).
 */
export class PubMedIdSearchComponent implements ControlValueAccessor {
  @Output() found: EventEmitter<any> = new EventEmitter<any>();
  isPreviewPub: boolean = false; // indicates if the retrieved publication's summary preview is on display
  @Input() readonly?: boolean = false;
  @Input() required?: boolean = false;
  @Input() inputId: string = '';

  publication: { [key: string]: string } = {}; // last publication retrieved
  isBusy: boolean = false; // indicates a transaction is in progress
  pubMedId: string | undefined; // last PubMed ID number typed in
  private lastIDfetched: string | undefined; // helps cancel unnecessary search actions triggered by enter key

  constructor(private pubMedSearchService: PubMedSearchService) {
    this.pubMedFetch = debounce(this.pubMedFetch, 300);
  }

  get value(): string | undefined {
    return this.pubMedId;
  }

  set value(newValue) {
    if (this.pubMedId !== newValue) {
      this.pubMedId = newValue;
      this.onChange(newValue);
    }
  }

  /**
   * Retrieves the publication data for the ID present in the search field shows its preview, ready
   * for selection so the user wishes. It will also notify the template that the transaction is going on so that
   * no further action is allowed in the interim.
   * @returns Stream of HTTP client events.
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
   * Registers a handler that should be called when something in the view has changed.
   * @see {@link ControlValueAccessor}
   * @param fn - Handler telling other form directives and form controls to update their values.
   */
  registerOnChange(fn): void {
    this.onChange = fn;
  }

  /**
   * Registers a handler specifically for when a control receives a touch event.
   * @see {@link ControlValueAccessor}
   */
  registerOnTouched(): void {}

  /**
   * Performs a new lookup operation provided the field is not blank and there is no request in progress.
   * It also hides the previous search result's preview if on display.
   */
  search(): void {
    if (this.pubMedId && !this.isBusy) {
      this.isPreviewPub = false;
      this.pubMedFetch();
    }
  }

  /**
   * Performs a lookup operation on pressing a certain key (filtered at the template level) as long as the
   * ID being searched is different from the last one. Otherwise it just directly selects the previously
   * searched publication for autofill.
   * @param event - DOM event for the click action.
   */
  searchOnKeypress(event: Event): void {
    event.stopPropagation();

    if (this.pubMedId !== this.lastIDfetched) {
      this.search();
    } else if (this.pubMedId) {
      this.selectPub();
    }
  }

  /**
   * Bubbles the selected publication event up, hiding its preview too.
   */
  selectPub(): void {
    this.found.emit(this.publication);
    this.isPreviewPub = false;
  }

  /**
   * Shows or hides the publication's preview. If there is no preview to be shown because the field
   * has just been rendered, it checks for an already existing ID and retrieves the publication for that one.
   */
  togglePreviewPub(): void {
    if (this.pubMedId && isEmpty(this.publication) && !this.isPreviewPub) {
      this.pubMedFetch();
      return;
    }
    this.isPreviewPub = !this.isPreviewPub;
  }

  /**
   * Writes a new value from the form model into the view or (if needed) DOM property.
   * @see {@link ControlValueAccessor}
   * @param newValue - Value to be stored.
   */
  writeValue(newValue: any): void {
    if (newValue) {
      this.pubMedId = newValue;
    }
  }

  private onChange: any = () => {};
}
