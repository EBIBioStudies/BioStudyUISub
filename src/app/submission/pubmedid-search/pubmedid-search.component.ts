import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { PubMedPublication, PubMedSearchService } from './pubmedid-search.service';
import { debounceTime, delay, distinctUntilChanged, mergeMap } from 'rxjs/operators';

import { PubMedIdSearchModalComponent } from './pubmedid-search-modal.component';

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
export class PubMedIdSearchComponent implements ControlValueAccessor, OnDestroy {
  @Output() found: EventEmitter<any> = new EventEmitter<any>();
  @Input() readonly?: boolean = false;
  @Input() required?: boolean = false;
  @Input() inputId: string = '';

  keyUp = new Subject<string>();
  publications: PubMedPublication[] = []; // last publication retrieved
  isBusy: boolean = false; // indicates a transaction is in progress
  pubMedId: string | undefined; // last PubMed ID number typed in
  private keyUpSubscription: Subscription;
  private searchModalRef?: BsModalRef;

  constructor(
    private pubMedSearchService: PubMedSearchService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
    this.keyUpSubscription = this.keyUp
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        mergeMap((idToSearch) => this.pubMedFetch(idToSearch).pipe(delay(500)))
      )
      .subscribe(
        (response) => {
          this.isBusy = false;
          this.publications = response;

          if (this.publications.length > 0) {
            this.showSearchModal(this.publications);
          }

          this.changeDetectorRef.detectChanges();
        },
        () => {
          this.isBusy = false;
          this.changeDetectorRef.detectChanges();
        }
      );
  }

  ngOnDestroy(): void {
    this.keyUpSubscription.unsubscribe();
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
   */
  pubMedFetch(idToSearch: string): Observable<PubMedPublication[]> {
    this.isBusy = true;
    this.changeDetectorRef.detectChanges();

    return this.pubMedSearchService.search(idToSearch);
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
   * Bubbles the selected publication event up, hiding its preview too.
   */
  selectPub(publication: PubMedPublication): void {
    this.found.emit(publication);
    this.searchModalRef?.hide();
  }

  onPubMedIdChange(value): void {
    this.keyUp.next(value);
    this.value = value;
  }

  onSearchModalHide(): void {
    this.searchModalRef = undefined;
  }

  showSearchModal(publications: PubMedPublication[]): void {
    if (!this.searchModalRef) {
      this.searchModalRef = this.modalService.show(PubMedIdSearchModalComponent, {
        class: 'modal-lg',
        initialState: {
          publications,
          onSelectPub: this.selectPub.bind(this),
          onPubMedIdChange: this.onPubMedIdChange.bind(this),
          value: this.value
        }
      });

      this.searchModalRef.onHidden.subscribe(() => this.onSearchModalHide());
    } else {
      this.searchModalRef.content.publications = publications;
    }
  }

  /**
   * Shows or hides the publication's preview. If there is no preview to be shown because the field
   * has just been rendered, it checks for an already existing ID and retrieves the publication for that one.
   */
  togglePreviewPub(): void {
    if (this.pubMedId && this.publications.length === 0) {
      this.keyUp.next(this.pubMedId);
    }

    if (this.publications.length > 0) {
      this.searchModalRef?.hide();
      this.searchModalRef = undefined;
      this.showSearchModal(this.publications);
    }
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
